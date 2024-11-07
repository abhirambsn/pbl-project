import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  ChevronUp,
  CogIcon,
  Database,
  LogOutIcon,
  MessageCircleMoreIcon,
  Plus,
  User2,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { SIDEBAR_CHATS } from "@/utils/constants";
import { useAuthStore } from "@/store/auth-store";
import { useModalStore } from "@/store/modal-store";
import CreateChatForm from "./create-chat-form";
import ChatMenuItem from "./chat-menu-item";
import AuthenticationService from "@/service/AuthenticationService";

const MainSidebar = () => {
  const { theme } = useTheme();
  const { userDetails, clear } = useAuthStore();
  const { onOpen, setCustomFormComponent, setSubtitle, setTitle } =
    useModalStore();
  useEffect(() => {
    console.log("DEBUG: theme", theme);
  }, [theme]);
  const navigate = useNavigate();

  const openCreateChatForm = () => {
    setCustomFormComponent(CreateChatForm);
    setTitle("Create Chat");
    setSubtitle("Create a new chat to start a conversation");
    onOpen();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => navigate("/")}>
            <div className="p-1 w-full flex items-center gap-3 hover:cursor-pointer">
              <MessageCircleMoreIcon
                size={24}
                className={
                  theme === "light" ? "text-teal-800" : "text-teal-500"
                }
              />
              <span
                className={cn(
                  "text-lg tracking-wide",
                  theme === "light" ? "text-teal-800" : "text-teal-500"
                )}
              >
                ConvoBot
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuButton onClick={() => openCreateChatForm()}>
              <Plus />
              <span>New Chat</span>
            </SidebarMenuButton>
            <SidebarMenuButton onClick={() => navigate("/kb")}>
              <Database />
              <span>Knowledge Bases</span>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_CHATS.map((chat) => (
                <ChatMenuItem key={chat.id} chat={chat} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userDetails?.firstName} {userDetails?.lastName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <CogIcon />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await AuthenticationService.logout();
                    clear();
                  }}
                  className="text-red-500"
                >
                  <LogOutIcon />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
