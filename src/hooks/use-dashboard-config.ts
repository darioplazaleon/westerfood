"use client"

import { useMemo } from "react"
import { type DashboardConfig, ROLES } from "@/types/dashboard"

export function useDashboardConfig(userRoleId: string, companyName: string): DashboardConfig {
  return useMemo(() => {
    const role = ROLES[userRoleId]

    const allNavigationItems = [
      { id: "menu-elements", label: "Elementos del Menú", requiredPermissions: ["manage_menu"] },
      { id: "weekly-menus", label: "Menús Semanales", requiredPermissions: ["manage_menu", "view_menu"] },
      { id: "companies", label: "Empresas", requiredPermissions: ["manage_companies"] },
      { id: "orders", label: "Pedidos", requiredPermissions: ["manage_orders", "view_orders", "place_orders"] },
      { id: "reports", label: "Reportes", requiredPermissions: ["view_reports"] },
    ]

    const allSections = [
      {
        id: "menu-management",
        title: "Gestión de Elementos del Menú",
        actionLabel: "Añadir Elemento",
        requiredPermissions: ["manage_menu"],
      },
    ]

    const navigationItems = allNavigationItems.filter((item) =>
      item.requiredPermissions?.some((permission) => role?.permissions.includes(permission)),
    )

    const sections = allSections.filter((section) =>
      section.requiredPermissions?.some((permission) => role?.permissions.includes(permission)),
    )

    return {
      userRole: role?.name || "Usuario",
      companyName,
      navigationItems,
      sections,
    }
  }, [userRoleId, companyName])
}
