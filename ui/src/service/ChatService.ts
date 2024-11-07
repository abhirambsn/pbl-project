import {
  ApiRequestMetadata,
  Chat,
  ChatList,
  ChatMetadata,
  MessageList,
} from "@/typings";
import { BaseService } from "./BaseService";

export class ChatService extends BaseService {
  async getMessagesOfChat(chat_id: string) {
    const metaData: ApiRequestMetadata = {
      method: "GET",
      endpoint: "/chat",
      params: [{ key: "chatId", value: chat_id }],
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    try {
      const response = await this.endpointService.sendRequest<MessageList>(
        metaData
      );
      if (!response) {
        console.error("DEBUG: no response from server");
        return;
      }
      return response.body;
    } catch (err) {
      console.error("DEBUG: error getting chats", err);
    }
  }

  async createChat(kb_id: string, user_id: string, name: string) {
    const body = {
      knowledgeBaseId: kb_id,
      createdBy: user_id,
      name,
    };

    const metaData: ApiRequestMetadata = {
      method: "PUT",
      endpoint: "/chat",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      data: body,
    };

    try {
      const response = await this.endpointService.sendRequest(metaData);
      if (!response) {
        console.error("DEBUG: no response from server");
        return;
      }
      return response.body;
    } catch (err) {
      console.error("DEBUG: error creating chat", err);
    }
  }

  async createMessage(chat_id: string, message: string, isBot: boolean = false) {
    const body = {
      senderType: !isBot ? "user" : "system",
      message,
    };

    const metaData: ApiRequestMetadata = {
      method: "PUT",
      endpoint: `/chat/${chat_id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      data: body,
    };

    try {
      const response = await this.endpointService.sendRequest(metaData);
      if (!response) {
        console.error("DEBUG: no response from server");
        return;
      }
      return response.body;
    } catch (err) {
      console.error("DEBUG: error creating message", err);
    }
  }

  async getAllChats(user_id: string) {
    const metaData: ApiRequestMetadata = {
      method: "GET",
      endpoint: `/chat/${user_id}/chats`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    try {
      const response = await this.endpointService.sendRequest<ChatList>(
        metaData
      );
      if (!response) {
        console.error("DEBUG: no response from server");
        return;
      }
      const chatMetadata = [] as ChatMetadata[];
      response?.body.forEach((chat: Chat) => {
        chatMetadata.push({
          id: chat._id,
          name: chat.chat_name,
          knowledgeBaseId: chat.knowledgeBaseId,
        });
      });
      return chatMetadata;
    } catch (err) {
      console.error("DEBUG: error getting all chats", err);
    }
  }
}
