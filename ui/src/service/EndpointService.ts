import axios, { Axios } from 'axios';

export class EndpointService {
    hostUrl: string;
    baseUrl: string;
    client: Axios;
    defaultHeaders: any;

    constructor() {
        this.hostUrl = import.meta.env.VITE_API_HOST || '';
        this.baseUrl = `${this.hostUrl}/api/v1`;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        }
        this.client = axios.create({
            baseURL: this.baseUrl,
        })
    }

    private buildEndpoint(endpoint: string, params: any[]) {
        let url = `${this.baseUrl}${endpoint}`;
        const query = new URLSearchParams();
        params.forEach((param) => {
            query.append(param.key, param.value);
        });
        url = `${url}?${query.toString()}`;
        return url;
    }

    async sendRequest(metaData: ApiRequestMetadata) {
        const { method } = metaData;
        const headers = {
            ...this.defaultHeaders,
            ...(metaData.headers || {})
        };
        const params = metaData.params || [];
        const data = metaData.data || {};

        const url = this.buildEndpoint(metaData.endpoint, params);

        switch (method) {
            case 'GET':
                return await this.client.get(url, { headers });
            case 'POST':
                return await this.client.post(url, data, { headers });
            case 'PUT':
                return await this.client.put(url, data, { headers });
            case 'DELETE':
                return await this.client.delete(url, { headers });
            default:
                console.error('DEBUG: invalid method');
                break;
        }
    }
}