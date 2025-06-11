'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { initialize, isInitialized, isLoading } = useAuthStore();
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !isInitialized && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            initialize();
        }
    }, [initialize, isInitialized]);

    if (isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-600">Initializing authentication...</p>
                </div>
            </div>
        );
    }

    return children;
}