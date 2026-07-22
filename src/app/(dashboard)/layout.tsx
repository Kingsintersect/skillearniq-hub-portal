import { DashboardLayoutShell } from "@/components/admin/dashboard-layout-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
