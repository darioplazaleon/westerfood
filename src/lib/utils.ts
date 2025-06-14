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

