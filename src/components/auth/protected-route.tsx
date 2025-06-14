'use client';

import {useAuthStore} from '@/lib/auth-store';
import {useRouter} from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
    fallback?: React.ReactNode;
}

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const {isAuthenticated} = useAuthStore();

    const router = useRouter();

    if (!isAuthenticated) {
        router.push('/');
    }

    return <>{children}</>;
}