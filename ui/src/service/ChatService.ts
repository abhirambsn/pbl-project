import { BaseService } from "./BaseService";

export class ChatService extends BaseService {
    async getMessagesOfChat(chat_id: string) {
        const metaData: ApiRequestMetadata = {
            method: 'GET',
            endpoint: '/chat',
            params: [{ key: 'chatId', value: chat_id }]
        }

        try {
            const response = await this.endpointService.sendRequest(metaData);
            if (!response) {
                console.error('DEBUG: no response from server');
                return;
            }
            return response.body;
        } catch (err) {
            console.error('DEBUG: error getting chats', err);
        }
    }

    async createChat(kb_id: string, user_id: string, name: string) {
        const body = {
            knowledgeBaseId: kb_id,
            createdBy: user_id,
            name
        }

        const metaData: ApiRequestMetadata = {
            method: 'PUT',
            endpoint: '/chat',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: body
        }

        try {
            const response = await this.endpointService.sendRequest(metaData);
            if (!response) {
                console.error('DEBUG: no response from server');
                return;
            }
            return response.body;
        } catch (err) {
            console.error('DEBUG: error creating chat', err);
        }
    }

    async createMessage(chat_id: string, message: string) {
        const body = {
            senderType: "user",
            message
        }

        const metaData: ApiRequestMetadata = {
            method: 'PUT',
            endpoint: `/chat/${chat_id}/message`,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: body
        }

        try {
            const response = await this.endpointService.sendRequest(metaData);
            if (!response) {
                console.error('DEBUG: no response from server');
                return;
            }
            return response.body;
        } catch (err) {
            console.error('DEBUG: error creating message', err);
        }
    }
}