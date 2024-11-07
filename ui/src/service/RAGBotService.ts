import { ApiRequestMetadata } from "@/typings";
import { BaseService } from "./BaseService";

export class RAGBotService extends BaseService {
    async queryRAGBot(chat_id: string, kb_id: string, query: string) {
        const body = {
            chat_id,
            query
        }

        const metaData: ApiRequestMetadata = {
            method: 'POST',
            endpoint: `/rag/${kb_id}/query`,
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
            console.error('DEBUG: error querying RAGBot', err);
        }
    }

    async triggerStore(chat_id: string, kb_id: string) {
        const metaData: ApiRequestMetadata = {
            method: 'POST',
            endpoint: `/rag/${kb_id}/store`,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                chat_id
            }
        }

        try {
            const response = await this.endpointService.sendRequest<{message: string;}>(metaData);
            if (!response) {
                console.error('DEBUG: no response from server');
                return;
            }
            return response.body;
        } catch (err) {
            console.error('DEBUG: error storing RAGBot', err);
        }
    }
}