import { UserCog, Settings2 } from "lucide-react";
import { AdminNavMain } from "./admin";
import type { SidebarNavConfig } from "./types";

export const SuperAdminNavMain: SidebarNavConfig = {
    groups: [
        ...AdminNavMain.groups,
        {
            title: "Platform",
            icon: UserCog,
            items: [
                { title: "Users & Roles", url: "/admin/platform/users" },
                { title: "Audit Logs", url: "/admin/platform/audit" },
            ],
        },
        { title: "Settings", icon: Settings2, items: [{ title: "Application Settings", url: "/admin/settings" }] },
    ],
};