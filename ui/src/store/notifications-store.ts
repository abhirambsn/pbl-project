import { NotificationState } from "@/interfaces/common.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist<NotificationState>(
    (set) => ({
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "notification-store",
    }
  )
);
