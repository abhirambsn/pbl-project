import { ChatMetadata } from "@/typings";
import { SidebarMenuButton } from "./ui/sidebar";
import { DeleteIcon, MessageCircle, MoreHorizontalIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useChatStore } from "@/store/chat-store";

type Props = {
  chat: ChatMetadata;
};

const ChatMenuItem = ({ chat }: Props) => {
  const navigate = useNavigate();
  const { setCurrentChat } = useChatStore();

  const navigateToChat = () => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`);
  };

  const deleteChat = () => {
    console.log("DEBUG: Deleting Chat with ID", chat.id);
  };
  return (
    <SidebarMenuButton
      key={chat.id}
      onClick={navigateToChat}
      className="justify-between"
    >
      <div className="flex items-center gap-2">
        <MessageCircle size={18} />
        <span>{chat.title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => deleteChat()}>
            <DeleteIcon className="text-red-500" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuButton>
  );
};

export default ChatMenuItem;
