import { UserRole } from "@/config";
import type { SidebarNavConfig } from "./types";
import { AdminNavMain } from "./admin";
import { StudentNavMain } from "./student";
import { TeacherNavMain } from "./teacher";
import { ParentNavMain } from "./parent";
import { ManagerNavMain } from "./manager";
import { SuperAdminNavMain } from "./super-admin";

export const NAV_CONFIG: Record<UserRole, SidebarNavConfig> = {
    [UserRole.ADMIN]: AdminNavMain,
    [UserRole.STUDENT]: StudentNavMain,
    [UserRole.TEACHER]: TeacherNavMain,
    [UserRole.PARENT]: ParentNavMain,
    [UserRole.MANAGER]: ManagerNavMain,
    [UserRole.SUPER_ADMIN]: SuperAdminNavMain,
};

export function getNavForRole(role: UserRole): SidebarNavConfig {
    const config = NAV_CONFIG[role];
    return {
        groups: config.groups
            .filter((g) => !g.hidden)
            .map((g) => ({ ...g, items: g.items.filter((i) => !i.hidden) })),
    };
}

export { AdminNavMain, StudentNavMain, TeacherNavMain, ParentNavMain, ManagerNavMain, SuperAdminNavMain };