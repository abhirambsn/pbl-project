type ApiRequestMetadata = {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
    headers?: any;
}

type UserDetails = {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    username: string;
}

type ResponseEntity<T> = {
    success: boolean;
    body: T;
    limit?: number;
    offset?: number;
    status?: number;
    message?: string;
}

type KnowledgeBase = {
    createdBy: string;
    files: string[];
    id: string;
    name: string;
    slug: string;
    urls: string[];
}

type KnowledgeBaseList = KnowledgeBase[]