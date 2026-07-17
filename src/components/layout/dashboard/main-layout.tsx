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
            // console.log("MainLayout: isAuthenticated", isAuthenticated, "user", user, "pathname", pathname);
            if (requireAuth && !isAuthenticated) {
                router.push(ROUTES.login);
                // alert("MainLayout: User is not authenticated. Redirecting to login page.");
            } else if (!requireAuth && isAuthenticated && pathname === ROUTES.login) {
                if (user?.role === "STUDENT") router.push(`/enrollment`)
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
        <div>
            {children}
        </div>
    );
}

