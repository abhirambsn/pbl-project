import { EndpointService } from "./EndpointService";

export class KnowledgeBaseService {
    endpointService: EndpointService;
    tokenValue: string;

    constructor() {
        this.endpointService = new EndpointService();
        this.tokenValue = '';
    }

    set token(token: string) {
        this.tokenValue = token;
    }

    get token() {
        return this.tokenValue;
    }

    async getKnowledgeBasesOfCurrentUser() {
        const metaData: ApiRequestMetadata = {
            method: 'GET',
            endpoint: '/rag/',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }

        try {
            const response = await this.endpointService.sendRequest(metaData);
            return response?.data;
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
            return response?.data;
        } catch (err) {
            console.error('DEBUG: error creating knowledge base', err);
        }
    }
}