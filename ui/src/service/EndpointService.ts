import { ApiRequestMetadata, ResponseEntity } from '@/typings';
import axios, { Axios, AxiosResponse } from 'axios';

export class EndpointService {
    hostUrl: string;
    baseUrl: string;
    client: Axios;

    constructor() {
        this.hostUrl = import.meta.env.VITE_API_HOST || '';
        this.baseUrl = `${this.hostUrl}/api/v1`;
        this.client = axios.create({
            baseURL: this.baseUrl,
            withCredentials: false
        })
    }

    private buildEndpoint(endpoint: string, params: Array<{ key: string, value: string }>): string {
        let url = `${this.baseUrl}${endpoint}`;
        if (!params.length) return url;
        const query = new URLSearchParams();
        params.forEach((param) => {
            query.append(param.key, param.value);
        });
        url = `${url}?${query.toString()}`;
        return url;
    }

    async sendRequest<T>(metaData: ApiRequestMetadata): Promise<ResponseEntity<T> | null> {
        const { method } = metaData;
        const headers = metaData.headers || {}
        const params = metaData.params || [];
        const data = metaData.data || {};

        const url = this.buildEndpoint(metaData.endpoint, params);
        let response: AxiosResponse<ResponseEntity<T>>;

        switch (method) {
            case 'GET':
                response = await this.client.get(url, { headers });
                break;
            case 'POST':
                response = await this.client.post(url, data, { headers });
                break;
            case 'PUT':
                response = await this.client.put(url, data, { headers });
                break;
            case 'DELETE':
                response = await this.client.delete(url, { headers });
                break;
            default:
                console.error('DEBUG: invalid method');
                return null;
        }
        console.log('DEBUG: response', response);
        return response.data as ResponseEntity<T>;
    }
}