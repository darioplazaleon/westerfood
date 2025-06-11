import { QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './auth-store';

// Create a query client with default options
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error: any) => {
                // Don't retry on authentication errors
                if (error?.status === 401 || error?.status === 403) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            retry: false,
        },
    },
});

// HTTP client with automatic token handling for Spring Boot backend
export const httpClient = async (url: string, options: RequestInit = {}) => {
    const { token, refreshTokens } = useAuthStore.getState();

    // Determine if it's a full URL or relative path
    const apiUrl = url.startsWith('http')
        ? url
        : `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    let response = await fetch(apiUrl, {
        ...options,
        headers,
    });

    // Handle token expiration
    if (response.status === 401 && token) {
        const refreshed = await refreshTokens();
        if (refreshed) {
            const newToken = useAuthStore.getState().token;
            response = await fetch(apiUrl, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });
        }
    }

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};