'use client';

import {useAuthStore} from '@/lib/auth-store';
import {useRouter} from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
    fallback?: React.ReactNode;
}

export function ProtectedRoute({children, roles, fallback}: ProtectedRouteProps) {
    const {isAuthenticated, hasAnyRole} = useAuthStore();

    const router = useRouter();

    if (!isAuthenticated) {
        router.push('/');
    }

    if (roles && roles.length > 0 && !hasAnyRole(roles)) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                        <p className="text-gray-600">You don&#39;t have permission to access this resource.</p>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
}