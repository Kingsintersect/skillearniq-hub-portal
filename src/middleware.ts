import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/config";
import { ROUTES } from "@/config";
import { ROLE_HOME } from "@/lib/rbac";

const ROLE_PREFIXES: [string, UserRole[]][] = [
    ["/admin", [UserRole.ADMIN, UserRole.SUPER_ADMIN]],
    ["/student", [UserRole.STUDENT]],
    ["/teacher", [UserRole.TEACHER]],
    ["/manager", [UserRole.MANAGER]],
    ["/parent", [UserRole.PARENT]],
    // Shared across roles — student/parent subscribe, others may manage billing on behalf of a family.
    ["/subscription", [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]],
];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const match = ROLE_PREFIXES.find(([prefix]) => pathname.startsWith(prefix));
    if (!match) return NextResponse.next();

    const [, allowedRoles] = match;
    const role = req.auth?.user?.role;

    if (!role) {
        const loginUrl = new URL(ROUTES.login, req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(ROLE_HOME[role], req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/student/:path*", "/teacher/:path*", "/manager/:path*", "/parent/:path*", "/subscription/:path*"],
};






// export { auth as middleware } from "@/auth"