import type { ReactNode } from "react";
import { canAccess } from "@/lib/rbac";
import { UserRole } from "@/config";

export function RoleGate({
    role,
    allow,
    fallback = null,
    children,
}: {
    role: UserRole;
    allow: UserRole[];
    fallback?: ReactNode;
    children: ReactNode;
}) {
    if (!canAccess(role, allow)) return <>{fallback}</>;
    return <>{children}</>;
}