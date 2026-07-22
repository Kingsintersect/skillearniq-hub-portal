import { cn } from "../lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

export interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  success: "bg-secondary-100 text-secondary-800 border-secondary-300",
  warning: "bg-accent-50 text-accent-800 border-accent-300",
  danger: "bg-destructive/10 text-destructive border-destructive/30",
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-primary-50 text-primary-700 border-primary-200",
};

export function statusToTone(status: string): StatusTone {
  const normalized = status.toLowerCase();
  if (["active", "successful", "accepted", "verified", "credited"].includes(normalized)) return "success";
  if (["pending", "pending_payment", "past_due"].includes(normalized)) return "warning";
  if (["cancelled", "failed", "expired", "locked", "blocked"].includes(normalized)) return "danger";
  return "neutral";
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClasses[tone],
        className
      )}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}