import { ChatState } from "@/interfaces/common.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist<ChatState>(
    (set) => ({
      chats: [],
      currentChat: null,
      setCurrentChat: (chat) =>
        set((state) => ({ ...state, currentChat: chat })),
      setChats: (chats) => set((state) => ({ ...state, chats })),
      clearState: () => set({ chats: [], currentChat: null }),
    }),
    { name: "chat-store" }
  )
);
