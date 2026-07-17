import { Eye, Lock } from "lucide-react";
import {
  PARENT_ACCESS_SCOPES,
  PARENT_RESTRICTED_AREAS,
} from "../types";

/**
 * Surfaces Rule 2.2 in plain language wherever a parent views a student's
 * data, so the read-only boundary is never a surprise.
 */
export function MonitoringScopeNotice() {
  return (
    <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary-800">
          <Eye className="h-4 w-4" />
          You can view
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {PARENT_ACCESS_SCOPES.map((item) => (
            <li key={item.scope}>{item.label}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lock className="h-4 w-4" />
          Not accessible to parents
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground/80">
          {PARENT_RESTRICTED_AREAS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
