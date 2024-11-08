import { useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "./ui/command";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMainProvider } from "@/hooks/use-main-provider";
import { useToast } from "@/hooks/use-toast";
import { useKnowledgeBaseStore } from "@/store/kb-store";
import { useAuthStore } from "@/store/auth-store";

const CreateChatForm = () => {
  const { toast } = useToast();
  const formSchema = z.object({
    name: z.string({ required_error: "Please enter a name" }),
    kb: z.string({ required_error: "Please choose a knowledge base" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      kb: "",
    },
  });

  const authState = useAuthStore();

  const { chatService, ragBotService } = useMainProvider();
  const { knowledgeBaseList } = useKnowledgeBaseStore();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("DEBUG: form data", data);
    if (!authState.userDetails) {
      console.log("DEBUG: User not found");
      return;
    }
    const chatId = await chatService?.createChat(
      data.kb,
      authState.userDetails?.id,
      data.name
    );
    if (chatId) {
      console.log("DEBUG: chat created", chatId);
      const response = await ragBotService?.triggerStore(chatId, data.kb);
      if (response) {
        toast({
          title: "Chat Created",
          description: response.message,
        });
      }
    }
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
                <Input placeholder="My Chat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kb"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Knowledge Base</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="w-full">
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? knowledgeBaseList.find((kb) => kb.id === field.value)
                            ?.name
                        : "Select Knowledge Base"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search Knowledge Bases..." />
                    <CommandList>
                      <CommandEmpty>No Knowledge Base found.</CommandEmpty>
                      <CommandGroup>
                        {knowledgeBaseList.map((kb) => (
                          <CommandItem
                            value={kb.name}
                            key={kb.id}
                            onSelect={() => {
                              form.setValue("kb", kb.id);
                            }}
                          >
                            {kb.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                kb.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          <Plus />
          <span>Create Chat</span>
        </Button>
      </form>
    </Form>
  );
};

export default CreateChatForm;
