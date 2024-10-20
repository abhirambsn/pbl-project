export interface AuthState {
    userDetails: UserDetails | null;
    isAuthenticated: boolean;
    token: string;

    setUserDetails: (userDetails: UserDetails) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setToken: (token: string) => void;
}