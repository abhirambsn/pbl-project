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