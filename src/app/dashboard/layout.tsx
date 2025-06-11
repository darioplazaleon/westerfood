'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import {Navbar} from "@/components/landing/navbar";
// import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <Navbar/>
            {/*<DashboardLayout>*/}
                {children}
            {/*</DashboardLayout>*/}
        </ProtectedRoute>
    );
}