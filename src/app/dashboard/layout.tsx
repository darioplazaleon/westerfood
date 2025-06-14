'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navbar } from '@/components/landing/navbar'
import { Toaster } from '@/components/ui/sonner'
// import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({
                                 children,
                               }: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      {/*<DashboardLayout>*/}
      {children}
      {/*</DashboardLayout>*/}
      <Toaster richColors/>
    </ProtectedRoute>
  )
}