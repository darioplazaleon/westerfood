import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NavItem, UserRole } from '@/types/dashboard'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const allowedRoles = ["admin", "rrhh", "employee"]

export function getRelevantRoles(roles: string[] = []) {
  return roles.filter(role =>
    allowedRoles.includes(role) ||
    allowedRoles.some(base => role === `${base}_client_role`)
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getNavigationItems(role?: UserRole): NavItem[] {
  const navItems: NavItem[] = []

  if (role === 'admin_client_role') {
    navItems.push(
      {
        label: 'Elementos del menu', href: '/dashboard/elementos-menu',
        hasSubmenu: true, submenuItems: [
          { label: 'Platos Principales', href: '/dashboard/elementos-menu/platos-principales' },
          { label: 'Postres', href: '/dashboard/elementos-menu/postres' },
        ],
      },
      { label: 'Menus Semanales', href: '/dashboard/menus-semanales' },
      { label: 'Empresas', href: '/dashboard/empresas' },
      { label: 'Pedidos', href: '/dashboard/pedidos' },
      { label: 'Reportes', href: '/dashboard/reportes' },
    )
  } else if (role === 'rrhh_client_role') {
    navItems.push(
      { label: 'Empleados', href: '/dashboard/empleados' },
      { label: 'Pedidos', href: '/dashboard/pedidos' },
      { label: 'Estadisticas', href: '/dashboard/estadisticas' },
    )
  } else if (role === 'employee_client_role') {
    navItems.push(
      { label: 'Pedidos', href: '/dashboard/' },
    )
  }

  return navItems
}

