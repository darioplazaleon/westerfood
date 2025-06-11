import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/lib/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Settings, User } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuthStore()

  const getInitials = () => {
    if (!user?.name) return 'U'
    return `${user?.given_name?.[0] || ''}${user?.family_name?.[0] || ''}`.toUpperCase() || 'U'
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/wf-logo-horizontal.svg" alt="WesterFood" width={150} height={45}
                   className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex flex-col items-end text-sm">
                <span className="font-medium text-gray-900">
                  {user.preferred_username || 'Administrador WesterFood'}
                </span>
                <span className="text-gray-500 text-xs">Empresa ABC</span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="bg-gray-600 text-white text-sm">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}