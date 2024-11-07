import React, { Fragment, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell, BellDotIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationList from "./notification-list";
import { useNotificationStore } from "@/store/notifications-store";
import { NOTIFICATIONS } from "@/utils/constants";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useChatStore } from "@/store/chat-store";

type NavbarProps = {
  SidebarTrigger: React.FC;
};

const MainNavbar = ({ SidebarTrigger }: NavbarProps) => {
  const { addNotification, clearNotifications, notifications } =
    useNotificationStore();
  const { currentChat } = useChatStore();
  useEffect(() => {
    NOTIFICATIONS.map((n) => addNotification(n));

    return () => {
      clearNotifications();
    };
  }, [addNotification, clearNotifications]);
  return (
    <nav className="flex items-center p-2 gap-4 bg-sidebar">
      <SidebarTrigger />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{currentChat?.name || "Dashboard"}</h3>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {notifications.length > 0 ? (
              <Fragment>
                <BellDotIcon className="h-[1.2rem] w-[1.2rem] text-primary" />
                <Badge className="rounded-full text-[0.5rem]">
                  {notifications.length}
                </Badge>
              </Fragment>
            ) : (
              <Bell className="h-[1.2rem] w-[1.2rem] text-primary" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px]">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg">Notifications</h2>
            <Button onClick={clearNotifications} variant="outline" size="icon">
              <XIcon className="h-2 w-2 text-muted-foreground" />
            </Button>
          </div>
          <Separator />
          <NotificationList />
        </PopoverContent>
      </Popover>
      <ThemeToggle />
    </nav>
  );
};

export default MainNavbar;
