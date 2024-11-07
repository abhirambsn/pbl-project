import { ChatMetadata } from "@/typings";
import { SidebarMenuButton } from "./ui/sidebar";
import {
  DeleteIcon,
  MessageCircle,
  MoreHorizontalIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useChatStore } from "@/store/chat-store";
import { useMainProvider } from "@/hooks/use-main-provider";
import { useToast } from "@/hooks/use-toast";

type Props = {
  chat: ChatMetadata;
};

const ChatMenuItem = ({ chat }: Props) => {
  const navigate = useNavigate();
  const { setCurrentChat } = useChatStore();
  const { ragBotService } = useMainProvider();
  const { toast } = useToast();

  const navigateToChat = () => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`);
  };

  const deleteChat = () => {
    console.log("DEBUG: Deleting Chat with ID", chat.id);
  };

  const refreshContext = async () => {
    console.log(
      "DEBUG: Refreshing context for chat",
      chat.id,
      chat.knowledgeBaseId
    );
    const response = await ragBotService?.triggerStore(
      chat.id,
      chat.knowledgeBaseId
    );
    if (response) {
      toast({
        title: response.message,
        description: "Refresh is in progress, you will be notified once done",
      });
    }
  };
  return (
    <SidebarMenuButton
      key={chat.id}
      onClick={navigateToChat}
      className="justify-between"
    >
      <div className="flex items-center gap-2">
        <MessageCircle size={18} />
        <span>{chat.name}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={refreshContext}>
            <RefreshCcwIcon />
            <span>Refresh Context</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteChat}>
            <DeleteIcon className="text-red-500" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuButton>
  );
};

export default ChatMenuItem;
