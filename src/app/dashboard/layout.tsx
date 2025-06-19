import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navbar } from '@/components/landing/navbar'
import { Toaster } from '@/components/ui/sonner'

export default function Layout({
                                 children,
                               }: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      {/*<DashboardLayout>*/}
      <main className="w-full flex justify-center">
        {children}
      </main>
      {/*</DashboardLayout>*/}
      <Toaster richColors />
    </ProtectedRoute>
  )
}