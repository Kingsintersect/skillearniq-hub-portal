"use client";

import { useEffect, useState } from "react";
import { SidebarProvider as OriginalSidebarProvider } from "@/components/ui/sidebar";

export function SafeSidebarProvider({
    children,
    ...props
}: React.ComponentProps<typeof OriginalSidebarProvider>) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render sidebar provider until client-side to avoid hydration issues
    if (!isMounted) {
        return (
            <div
                data-slot="sidebar-wrapper"
                style={{
                    "--sidebar-width": "16rem",
                    "--sidebar-width-icon": "3rem",
                } as React.CSSProperties}
                className="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
            >
                {/* Simple skeleton that matches your sidebar structure */}
                <div className="bg-sidebar text-sidebar-foreground hidden h-svh w-16 flex-col md:flex">
                    <div className="p-2">
                        <div className="h-8 w-8 rounded-md bg-sidebar-accent animate-pulse"></div>
                    </div>
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <OriginalSidebarProvider {...props}>
            {children}
        </OriginalSidebarProvider>
    );
}