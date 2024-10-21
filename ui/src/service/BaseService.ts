import { EndpointService } from "./EndpointService";

export class BaseService {
    protected endpointService: EndpointService;
    protected tokenValue: string;

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
}