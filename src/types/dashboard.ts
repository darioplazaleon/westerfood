export interface UserRole {
  id: string
  name: string
  permissions: string[]
}

export interface DashboardConfig {
  userRole: string
  companyName: string
  navigationItems: Array<{
    id: string
    label: string
    href?: string
    requiredPermissions?: string[]
  }>
  sections: Array<{
    id: string
    title: string
    actionLabel?: string
    requiredPermissions?: string[]
  }>
}

export const ROLES: Record<string, UserRole> = {
  admin: {
    id: "admin",
    name: "Administrador WesterFood",
    permissions: ["manage_menu", "manage_companies", "view_reports", "manage_orders"],
  },
  company_admin: {
    id: "company_admin",
    name: "Administrador de Empresa",
    permissions: ["manage_menu", "view_orders", "view_reports"],
  },
  employee: {
    id: "employee",
    name: "Empleado",
    permissions: ["view_menu", "place_orders"],
  },
}
