"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

    const initials = React.useMemo(
        () =>
            userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U",
        [userName]
    );

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
            {/* Header: brand + collapse toggle */}
            <div className="shrink-0 border-b border-white/10 p-3">
                <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-2.5")}>
                    <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="SkillearnIQ home">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                            <Image
                                src="/logo/logo.jpg"
                                alt="SkillearnIQ Hub"
                                width={72}
                                height={72}
                                className="h-8 w-8 object-contain"
                            />
                        </span>
                        {!collapsed && (
                            <span className="truncate text-lg font-extrabold tracking-tight">
                                Skillearn<span className="text-accent-300">IQ</span>
                            </span>
                        )}
                    </Link>
                    {onToggleCollapse && (
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            className={cn(
                                "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white",
                                !collapsed && "ml-auto"
                            )}
                        >
                            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation (scrollbar hidden) */}
            <nav className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {sections.map((section) => (
                    <div key={section.title}>
                        {!collapsed && (
                            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = item.href === activeHref;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                                            collapsed && "justify-center",
                                            isActive ? "text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="sidebar-active-pill"
                                                className="absolute inset-0 rounded-xl bg-accent shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
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

            {/* Footer: user + sign out (with confirmation) */}
            <div className="shrink-0 font-outfit border-t border-white/10 p-3">
                {!collapsed && (
                    <div className="mb-2 font-outfit flex items-center gap-2.5 px-1">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{userName}</p>
                            <RoleBadge role={role} />
                        </div>
                    </div>
                )}

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            type="button"
                            title={collapsed ? "Sign out" : undefined}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/15 hover:text-red-300",
                                collapsed && "justify-center"
                            )}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>Sign out</span>}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="font-outfit">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sign out of SkillearnIQ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You&apos;ll be signed out of this device and need to sign in again to
                                get back to your dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                                className="bg-destructive text-white hover:bg-destructive/90"
                            >
                                Sign out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
