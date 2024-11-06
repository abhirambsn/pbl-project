import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/chat/bubble";
import { ChatMessageList } from "@/components/chat/list";
import { ChatInput } from "@/components/chat/message-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/typings";
import { MESSAGES } from "@/utils/constants";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "@/components/chat/display-code";
import { useAuthStore } from "@/store/auth-store";

const ChatPage = () => {
  const params = useParams();
  const { toast } = useToast();
  const authState = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (!params?.chatId) {
      toast({
        title: "Chat ID not found",
        description: "Chat ID not found in the URL",
        variant: "destructive",
      });

      redirect("/");
      return;
    }

    console.log("DEBUG: Chat ID", params.chatId, "Loading Messages");
    setIsLoading(true);
    setTimeout(() => {
      setMessages(MESSAGES);
      setIsLoading(false);
    }, 2000);

    return () => {
      console.log("DEBUG: Cleaning up Chat Page");
      setMessages([]);
      setInput("");
      setIsGenerating(false);
      setIsLoading(false);
    };
  }, [params, toast]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("DEBUG: Submitting Form");
    // handleSubmit(e);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: input,
        _id: "alfa" + Math.random().toString(),
        createdOn: null,
        senderType: "USER",
      },
    ]);
    setInput("");
    await dispatchResponse(input);
  };

  const dispatchResponse = async (msg: string) => {
    console.log("DEBUG: fetching response from model of query", msg);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: "Sample Response " + Math.random(),
          _id: "beta" + Math.random().toString(),
          createdOn: null,
          senderType: "BOT",
        },
      ]);
      setIsGenerating(false);
    }, 5000);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <section className="min-h-[95svh] flex flex-col">
      <ChatMessageList className="flex-grow" ref={messagesRef}>
        <ChatBubble variant="received">
          <ChatBubbleAvatar src="" fallback="🤖" />
          <ChatBubbleMessage>
            Hello! I'm the AI assistant. How can I help you today?
          </ChatBubbleMessage>
        </ChatBubble>

        {messages &&
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.senderType == "USER" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src={
                  message.senderType === "USER"
                    ? `https://api.dicebear.com/9.x/initials/svg?seed=${authState.userDetails?.firstName}+${authState.userDetails?.lastName}`
                    : ""
                }
                fallback={message.senderType === "USER" ? "👨🏽" : "🤖"}
              />
              <ChatBubbleMessage
                variant={message.senderType === "USER" ? "sent" : "received"}
              >
                {message.message
                  .split("```")
                  .map((part: string, index: number) => {
                    if (index % 2 === 0) {
                      return (
                        <Markdown key={index} remarkPlugins={[remarkGfm]}>
                          {part}
                        </Markdown>
                      );
                    } else {
                      return (
                        <pre className=" pt-2" key={index}>
                          <CodeDisplayBlock code={part} lang="" />
                        </pre>
                      );
                    }
                  })}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

        {isGenerating && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar src="" fallback="🤖" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>

      <div className="p-3">
        <form ref={formRef} className="flex relative gap-2" onSubmit={onSubmit}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="min-h-12 bg-background shadow-none "
          />
          <Button
            className="absolute top-1/2 right-2 transform  -translate-y-1/2"
            type="submit"
            size="icon"
            disabled={isLoading || isGenerating || !input}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ChatPage;
