"use client";

import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { ThemeToggle } from "./theme-toggle";
// import { UserRole } from "@/config";
import type { UserRole } from "@/config";

export interface TopbarProps {
    role: UserRole;
    userName: string;
    onOpenMobileNav: () => void;
}

export function Topbar({ role, userName, onOpenMobileNav }: TopbarProps) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">Welcome back, {userName.split(" ")[0]} 👋</p>
                    <RoleBadge role={role} className="mt-0.5" />
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle />
            </div>
        </header>
    );
}