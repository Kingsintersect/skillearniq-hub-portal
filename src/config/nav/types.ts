import type { LucideIcon } from "lucide-react";

export interface SidebarNavLeaf {
    title: string;
    url: string;
    /** Route exists but isn't launched yet — hidden from sidebar, but middleware doesn't need this at all since it guards by prefix, not by item. */
    hidden?: boolean;
}

export interface SidebarNavGroup {
    title: string;
    icon: LucideIcon;
    items: SidebarNavLeaf[];
    hidden?: boolean;
}

export interface SidebarNavConfig {
    groups: SidebarNavGroup[];
}