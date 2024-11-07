import { KnowledgeBaseService } from "./service/KnowledgeBaseService";
import { QueueService } from "./service/QueueService";
import { RAGBotService } from "./service/RAGBotService";

type ApiRequestMetadata = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  params?: { key: string; value: string }[];
  headers?: Record<string, string>;
};

type UserDetails = {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  username: string;
};

type ResponseEntity<T> = {
  success: boolean;
  body: T;
  limit?: number;
  offset?: number;
  status?: number;
  message?: string;
};

type KnowledgeBase = {
  createdBy: string;
  files: string[];
  id: string;
  name: string;
  slug: string;
  urls: string[];
};

type KnowledgeBaseList = KnowledgeBase[];

type MainContextType = {
  queueService: QueueService | null;
  knowledgeBaseService: KnowledgeBaseService | null;
  chatService: ChatService | null;
  ragBotService: RAGBotService | null;
  fetchChatMessages: (chat_id: string | undefined) => Promise<MessageList>;
};

type MyNotification = {
  id: string;
  title: string;
  description: string;
  type: string;
};

type ChatMetadata = {
  id: string;
  name: string;
  knowledgeBaseId: string;
};

type Chat = {
  _id: string;
  chat_name: string;
  createdBy: string;
  knowledgeBaseId: string;
  createdOn: Date | null;
  version: number;
}

type ChatList = Chat[];

type Message = {
  _id: string;
  message: string;
  senderType: string;
  createdOn: Date | null;
};

type MessageList = Message[];