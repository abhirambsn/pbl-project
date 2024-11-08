import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DeleteIcon, Plus } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useMainProvider } from "@/hooks/use-main-provider";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

const CreateKBForm = () => {
  const formSchema = z.object({
    name: z.string({ required_error: "Please enter a name" }),
    urls: z
      .array(z.string())
      .nonempty({ message: "Please enter at least one URL" }),
  });

  const [url, setUrl] = useState<string>("");
  const { knowledgeBaseService } = useMainProvider();
  const authState = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!authState.userDetails) {
      console.log("DEBUG: User not found");
      return;
    }
    const payload = { ...data, files: [] };
    console.log("DEBUG: form data", payload);
    const response = await knowledgeBaseService?.createKnowledgeBase(
      payload.name,
      payload.urls,
      authState.userDetails?.id as string
    );
    if (response) {
      console.log("DEBUG: KB created", response);
      toast({
        title: "Knowledge Base Created",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      urls: [],
    },
  });

  const addUrl = (field: ControllerRenderProps<z.infer<typeof formSchema>>) => {
    if (!url.length) return;
    field.onChange([...field.value, url]);
    setUrl("");
  };

  const removeUrl = (index: number) => {
    const urls = form.getValues("urls") as string[];
    const filteredUrls = urls.filter((_, i) => i !== index) as [
      string,
      ...string[]
    ];

    form.setValue("urls", filteredUrls);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My KB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs</FormLabel>
              {field.value && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {field.value.map((url, index) => (
                      <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>{url}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            onClick={() => removeUrl(index)}
                            variant="outline"
                            className="p-2"
                          >
                            <DeleteIcon className="text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="http:// or https://"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button type="button" onClick={() => addUrl(field)}>
                    <Plus />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          <Plus />
          <span>Create Knowledge Base</span>
        </Button>
      </form>
    </Form>
  );
};

export default CreateKBForm;
