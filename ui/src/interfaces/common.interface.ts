import { MyNotification, UserDetails } from "@/typings";
import React from "react";

export interface AuthState {
  userDetails: UserDetails | null;
  isAuthenticated: boolean;
  token: string;
  expiresAt: number;

  setUserDetails: (userDetails: UserDetails) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => void;
  setExpiresAt: (expiresAt: number) => void;
  clear: () => void;
}

export interface NotificationState {
  notifications: MyNotification[];
  setNotifications: (notifications: MyNotification[]) => void;
  addNotification: (notification: MyNotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface ModalFormState {
  isOpen: boolean;
  CustomFormComponent: React.FC;
  title: string;
  subtitle: string;
  onOpen: () => void;
  onClose: () => void;
  setCustomFormComponent: (component: React.FC) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
}
