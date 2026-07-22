"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, GraduationCap, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNavForRole } from "@/config/nav-config";
import { UserRole } from "@/config";
import { RoleBadge } from "./role-badge";

export interface SidebarProps {
    role: UserRole;
    userName: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onNavigate?: () => void;
}

export function Sidebar({ role, userName, collapsed = false, onToggleCollapse, onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const sections = React.useMemo(() => getNavForRole(role), [role]);

    // Find the single longest-matching href across ALL items, not per-item —
    // prevents "/subscription" and "/subscription/billing" both lighting up
    // when the current route is "/subscription/billing".
    const activeHref = React.useMemo(() => {
        const allItems = sections.flatMap((s) => s.items);
        const matches = allItems.filter(
            (item) => pathname === item.href || pathname?.startsWith(item.href + "/")
        );
        if (matches.length === 0) return null;
        return matches.reduce((longest, item) => (item.href.length > longest.href.length ? item : longest)).href;
    }, [pathname, sections]);

    return (
        <div className="flex h-full flex-col bg-[#1B2151] text-white">
            {/* ...header unchanged... */}

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {sections.map((section) => (
                    <div key={section.title}>
                        {!collapsed && (
                            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = item.href === activeHref; // was: pathname === item.href || pathname?.startsWith(item.href + "/")
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                                            isActive ? "text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="sidebar-active-pill"
                                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                            />
                                        )}
                                        <item.icon
                                            className={cn(
                                                "relative z-10 h-4 w-4 shrink-0 transition-transform",
                                                isActive ? "scale-100" : "scale-95 group-hover:scale-100"
                                            )}
                                        />
                                        {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
                                        {isActive && !collapsed && (
                                            <motion.span layout className="relative z-10 ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ...footer unchanged... */}
        </div>
    );
}