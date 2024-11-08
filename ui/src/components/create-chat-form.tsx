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
import { KB_LIST } from "@/utils/constants";
import { useMainProvider } from "@/hooks/use-main-provider";

const CreateChatForm = () => {
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

  const { chatService, ragBotService } = useMainProvider();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("DEBUG: form data", data);
    const chatId = await chatService?.createChat(data.name, data.kb);
    if (chatId) {
      console.log("DEBUG: chat created", chatId);
      await ragBotService?.triggerStore(chatId, data.kb);
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
                        ? KB_LIST.find((kb) => kb.id === field.value)?.name
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
                        {KB_LIST.map((kb) => (
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
