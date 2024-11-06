import { KnowledgeBaseService } from "./service/KnowledgeBaseService";
import { QueueService } from "./service/QueueService";

type ApiRequestMetadata = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  params?: Record<string, string | number>;
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
};

type MyNotification = {
  id: string;
  title: string;
  description: string;
  type: string;
};