import { cn } from "@/lib/utils";
import { Check, DeleteIcon, Info, XIcon } from "lucide-react";
import moment from "moment";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "./ui/separator";
import { useNotificationStore } from "@/store/notifications-store";
import { AppNotification } from "@/typings";

type AppNotificationProp = {
  notification: AppNotification;
  isLast?: boolean
};

const NotificationEntry = ({ notification, isLast = false }: AppNotificationProp) => {
  const { removeNotification } = useNotificationStore();
  return (
    <Fragment>
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarFallback
              className={cn(
                "rounded-full",
                notification.type === "info" && "bg-blue-500",
                notification.type === "success" && "bg-green-500",
                notification.type === "error" && "bg-red-500"
              )}
            >
              {notification.type === "info" && <Info className="h-4 w-4" />}
              {notification.type === "success" && <Check className="h-4 w-4" />}
              {notification.type === "error" && <XIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-xs">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {moment(notification.timestamp).fromNow()}
            </p>
          </div>
        </div>
        <Button
          onClick={() => removeNotification(notification.id)}
          variant="outline"
          size="icon"
        >
          <DeleteIcon className="h-2 w-2 text-muted-foreground" />
        </Button>
      </div>
      {!isLast && (<Separator />)}
    </Fragment>
  );
};

export default NotificationEntry;
