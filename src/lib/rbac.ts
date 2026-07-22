import { UserRole } from "@/config";

export const ROLES = Object.values(UserRole) as UserRole[];

/** Narrows an arbitrary API string into UserRole, or throws — use at every auth boundary. */
export function toRole(value: string): UserRole {
    const upper = value.toUpperCase();
    if ((ROLES as string[]).includes(upper)) return upper as UserRole;
    throw new Error(`Unrecognized role from API: ${value}`);
}

export function canAccess(userRole: UserRole | undefined, allowed: UserRole[]) {
    if (!userRole) return false;
    return allowed.includes(userRole);
}

export const ROLE_LABEL: Record<UserRole, string> = {
    [UserRole.STUDENT]: "Student",
    [UserRole.TEACHER]: "Teacher",
    [UserRole.PARENT]: "Parent",
    [UserRole.MANAGER]: "Manager",
    [UserRole.ADMIN]: "Admin",
    [UserRole.SUPER_ADMIN]: "Super Admin",
};

export const ROLE_COLOR: Record<UserRole, string> = {
    [UserRole.STUDENT]: "bg-primary-100 text-primary-700 dark:bg-primary-400/15 dark:text-primary-300",
    [UserRole.TEACHER]: "bg-secondary-300 text-primary-800 dark:bg-secondary-400/20 dark:text-secondary-300",
    [UserRole.PARENT]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    [UserRole.MANAGER]: "bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300",
    [UserRole.ADMIN]: "bg-accent-200 text-accent-800 dark:bg-accent-500/20 dark:text-accent-200",
    [UserRole.SUPER_ADMIN]: "bg-primary-600 text-primary-foreground",
};

/** Where a user lands right after login, and what middleware redirects a wrong-role visit back to. */
export const ROLE_HOME: Record<UserRole, string> = {
    [UserRole.STUDENT]: "/student/dashboard",
    [UserRole.TEACHER]: "/teacher/dashboard",
    [UserRole.PARENT]: "/parent/dashboard",
    [UserRole.MANAGER]: "/manager/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/admin/dashboard", // super admin shares the admin route tree, see nav/super-admin.ts
};