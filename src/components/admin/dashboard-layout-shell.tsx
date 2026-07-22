import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/config";
import { DashboardShell } from "./dashboard-shell";

export async function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) redirect(ROUTES.login);

    return (
        <DashboardShell role={session.user.role} userName={`${session.user.first_name} ${session.user.last_name}`}>
            {children}
        </DashboardShell>
    );
}