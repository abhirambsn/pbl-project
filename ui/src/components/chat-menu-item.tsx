import { ChatMetadata } from "@/typings";
import { SidebarMenuButton } from "./ui/sidebar";
import {
  DeleteIcon,
  MessageCircle,
  MoreHorizontalIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  chat: ChatMetadata;
};

const ChatMenuItem = ({ chat }: Props) => {
  const navigate = useNavigate();

  const deleteChat = () => {
    console.log("DEBUG: Deleting Chat with ID", chat.id);
  };
  return (
    <SidebarMenuButton
      key={chat.id}
      onClick={() => navigate(`/chat/${chat.id}`)}
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
