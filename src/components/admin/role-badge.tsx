import { UserRole } from "@/config";
import { ROLE_LABEL, ROLE_COLOR } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", ROLE_COLOR[role], className)}>
            {ROLE_LABEL[role]}
        </span>
    );
}