import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

