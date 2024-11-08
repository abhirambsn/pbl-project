import { useNotificationStore } from "@/store/notifications-store";
import NotificationEntry from "./notification-entry";

const NotificationsList = () => {
  const { notifications } = useNotificationStore();
  return notifications.length > 0 ? (
    notifications.map((notification, index) => (
      <NotificationEntry
        key={notification.id}
        notification={notification}
        isLast={index === notifications.length - 1}
      />
    ))
  ) : (
    <div className="p-2 text-center text-muted-foreground">
      No notifications
    </div>
  );
};

export default NotificationsList;
