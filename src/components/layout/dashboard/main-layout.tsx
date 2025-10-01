"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/config";
import { useAuthContext } from "@/providers/AuthProvider";
import { useProgress } from '@bprogress/next';
interface MainLayoutProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    revealHeader?: boolean;
}

export function MainLayout({ children, requireAuth = false }: MainLayoutProps) {
    const { isAuthenticated, isLoading, user } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const { start, stop } = useProgress();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.push(ROUTES.login);
                // } else if (!requireAuth && isAuthenticated && pathname === ROUTES.login) {
            } else if (!requireAuth && isAuthenticated && pathname === ROUTES.login) {
                if (user?.role === "STUDENT") router.push(`/course-overview`)
                else router.push(`/${user?.role.toLocaleLowerCase() + ROUTES.dashboard}`);
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, router, pathname, user]);

    if (isLoading) start()
    else stop()

    // Don't render children if auth check fails
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return (
        <div suppressHydrationWarning>
            {children}
        </div>
    );
}

