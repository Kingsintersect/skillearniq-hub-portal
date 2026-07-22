"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { UserRole } from "@/config";

export interface DashboardShellProps {
    role: UserRole;
    userName: string;
    children: React.ReactNode;
}

export function DashboardShell({ role, userName, children }: DashboardShellProps) {
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-muted/30 dark:bg-background">
            <motion.aside
                animate={{ width: collapsed ? 76 : 260 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden shrink-0 lg:block"
            >
                <Sidebar role={role} userName={userName} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
            </motion.aside>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-72 border-none p-0">
                    <Sidebar role={role} userName={userName} onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar role={role} userName={userName} onOpenMobileNav={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}