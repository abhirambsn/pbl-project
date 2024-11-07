import { ApiRequestMetadata, KnowledgeBaseList } from "@/typings";
import { BaseService } from "./BaseService";
export class KnowledgeBaseService extends BaseService {

    async getKnowledgeBasesOfCurrentUser() {
        const metaData: ApiRequestMetadata = {
            method: 'GET',
            endpoint: '/rag/',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }

        try {
            const response = await this.endpointService.sendRequest<KnowledgeBaseList>(metaData);
            if (!response) {
                console.error('DEBUG: no response from server');
                return;
            }
            return response.body;
        } catch (err) {
            console.error('DEBUG: error getting knowledge bases', err);
        }
    }

    async createKnowledgeBase(name: string, urls: Array<string>, createdBy: string) {
        const body = {
            name,
            urls,
            files: [],
            createdBy
        }

        const metaData: ApiRequestMetadata = {
            method: 'POST',
            endpoint: '/rag/',
            headers: {
                'Authorization': `Bearer ${this.token}`
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
            console.error('DEBUG: error creating knowledge base', err);
        }
    }
}