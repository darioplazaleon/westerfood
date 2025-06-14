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
    const { token, refreshTokens, isAuthenticated } = useAuthStore.getState();

    // Check if user is authenticated
    if (!isAuthenticated || !token) {
        throw new Error('User not authenticated');
    }

    // Determine if it's a full URL or relative path
    const apiUrl = url.startsWith('http')
        ? url
        : `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    let response = await fetch(apiUrl, {
        ...options,
        headers,
    });

    // Handle token expiration
    if (response.status === 401 && token) {
        console.log('Token expired during request, attempting refresh...');
        const refreshed = await refreshTokens();
        
        if (refreshed) {
            const newToken = useAuthStore.getState().token;
            console.log('Token refreshed, retrying request...');
            
            response = await fetch(apiUrl, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                },
            });
        } else {
            throw new Error('Authentication failed - please login again');
        }
    }

    if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};