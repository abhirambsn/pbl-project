import { AuthState } from "@interfaces/common.interface";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension'

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                isAuthenticated: false,
                token: '',
                userDetails: null,
            
                setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
                setToken: (token: string) => set({ token }),
                setUserDetails: (userDetails: any) => set({ userDetails })
            }),
            { name: 'auth-store' }
        ),
        { anonymousActionType: 'auth-store-action' }
    )
);