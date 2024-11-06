import { AuthState } from "@/interfaces/common.interface";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { UserDetails } from "@/typings";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        token: "",
        userDetails: null,
        expiresAt: 0,

        setIsAuthenticated: (isAuthenticated: boolean) =>
          set({ isAuthenticated }),
        setToken: (token: string) => set({ token }),
        setUserDetails: (userDetails: UserDetails) => set({ userDetails }),
        setExpiresAt: (expiresAt: number) => set({ expiresAt }),
        clear: () => set({ isAuthenticated: false, token: "", userDetails: null, expiresAt: -1 }),
      }),
      { name: "auth-store" }
    ),
    { anonymousActionType: "auth-store-action" }
  )
);
