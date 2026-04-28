/**
 * Role names mirror the backend `SystemRoles` constants in OmborPro.Domain.
 * Keep in sync — the strings are checked directly against JWT role claims.
 */
export const ROLES = {
  Owner: 'Owner',
  Admin: 'Admin',
  Manager: 'Manager',
  WarehouseOperator: 'WarehouseOperator',
  Viewer: 'Viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_OPTIONS: Role[] = [
  ROLES.Owner,
  ROLES.Admin,
  ROLES.Manager,
  ROLES.WarehouseOperator,
  ROLES.Viewer,
];

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'success' | 'outline';

const ROLE_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  [ROLES.Owner]: 'destructive',
  [ROLES.Admin]: 'destructive',
  [ROLES.Manager]: 'default',
  [ROLES.WarehouseOperator]: 'secondary',
  [ROLES.Viewer]: 'secondary',
};

/**
 * Returns the shadcn Badge variant to use for a given role label. Centralized so
 * the "Owner is destructive, Manager is default, others are secondary" rule lives
 * in one place rather than being re-implemented in every component that renders a role.
 */
export function getRoleBadgeVariant(role: string | null | undefined): BadgeVariant {
  if (!role) return 'secondary';
  return ROLE_BADGE_VARIANTS[role] ?? 'secondary';
}

export const ADMIN_ROLES: readonly string[] = [ROLES.Owner, ROLES.Admin, ROLES.Manager];

export function isAdminOrManagerRole(role: string | null | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
