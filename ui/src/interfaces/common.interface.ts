import {
  AppNotification,
  ChatMetadata,
  KnowledgeBaseList,
  UserDetails,
} from "@/typings";
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
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
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

export interface ChatState {
  chats: ChatMetadata[];
  currentChat: ChatMetadata | null;
  setCurrentChat: (chat: ChatMetadata) => void;
  setChats: (chats: ChatMetadata[]) => void;
  clearState: () => void;
}

export interface KnowledgeBaseState {
  knowledgeBaseList: KnowledgeBaseList;
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  setKnowledgeBaseList: (knowledgeBaseList: KnowledgeBaseList) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
  setEntriesPerPage: (entriesPerPage: number) => void;
  clearState: () => void;
}
