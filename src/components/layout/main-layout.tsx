"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthHeader } from "./AuthHeader";
import { ROUTES } from "@/config";
import { useAuthContext } from "@/app/providers/AuthProvider";
import Image from "next/image";

interface MainLayoutProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    revealHeader?: boolean;
}

export function MainLayout({ children, requireAuth = false, revealHeader = true }: MainLayoutProps) {
    const { isAuthenticated, isLoading, user, } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.push(ROUTES.login);
            } else if (!requireAuth && isAuthenticated && pathname === ROUTES.login) {
                router.push(`/${user?.role.toLocaleLowerCase() + ROUTES.dashboard}`);
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, router, pathname, user]);

    // Show loading screen while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center animate-pulse">
                        <Image
                            src={`/logo/logo.jpg`}
                            alt="LOGO IMAGE"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    // Don't render children if auth check fails
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {(isAuthenticated && revealHeader) && <AuthHeader />}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}