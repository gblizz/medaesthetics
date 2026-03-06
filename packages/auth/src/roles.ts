export type UserRole =
  | "PLATFORM_ADMIN"
  | "PRACTICE_OWNER"
  | "PROVIDER"
  | "FRONT_DESK"
  | "CLIENT";

export interface SessionUser {
  clerkUserId: string;
  role: UserRole;
  practiceId: string | null;
  email: string;
  firstName?: string;
  lastName?: string;
}

export const ROLE_PERMISSIONS = {
  PLATFORM_ADMIN: [
    "manage:platform",
    "manage:practices",
    "view:all",
  ],
  PRACTICE_OWNER: [
    "manage:practice",
    "manage:providers",
    "manage:staff",
    "manage:services",
    "manage:billing",
    "view:reports",
    "manage:clients",
    "manage:appointments",
    "manage:inventory",
    "manage:campaigns",
    "view:clinical",
    "write:clinical",
  ],
  PROVIDER: [
    "view:own_appointments",
    "manage:own_appointments",
    "view:clinical",
    "write:clinical",
    "manage:clients",
    "view:clients",
  ],
  FRONT_DESK: [
    "manage:appointments",
    "view:appointments",
    "manage:clients",
    "view:clients",
    "manage:intake_forms",
    "manage:invoices",
    "view:billing",
  ],
  CLIENT: [
    "view:own_record",
    "manage:own_appointments",
    "view:own_invoices",
    "sign:forms",
  ],
} as const;

export type Permission =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function canAccessClinical(role: UserRole): boolean {
  return role === "PLATFORM_ADMIN" ||
    role === "PRACTICE_OWNER" ||
    role === "PROVIDER";
}

export function canManageBilling(role: UserRole): boolean {
  return role === "PLATFORM_ADMIN" ||
    role === "PRACTICE_OWNER" ||
    role === "FRONT_DESK";
}
