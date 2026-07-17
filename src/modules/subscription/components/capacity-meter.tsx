"use client";

import { motion } from "framer-motion";
import { cn, clamp } from "@/modules/shared";
import type { MyGroup } from "../types";

export interface CapacityMeterProps {
  group: MyGroup;
}

/**
 * Visualizes Rule 3.2: Active Members + Pending Invitations <= Max Plan Capacity.
 * Filled segments = active members, hatched/lighter segments = reserved
 * (pending invitation) slots, per Rule 3.3 slot locking.
 */
export function CapacityMeter({ group }: CapacityMeterProps) {
  const { max_slots, active_members, pending_invitations } = group;
  const activeCount = active_members.length;
  const pendingCount = pending_invitations.length;
  const usedCount = clamp(activeCount + pendingCount, 0, max_slots);
  const percentUsed = max_slots > 0 ? (usedCount / max_slots) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {group.available_slots} of {max_slots} slots available
        </span>
        <span className="text-muted-foreground">{group.plan_name}</span>
      </div>

      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(activeCount / max_slots) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="h-full bg-accent-300"
          initial={{ width: 0 }}
          animate={{ width: `${(pendingCount / max_slots) * 100}%` }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        />
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {activeCount} active
        </span>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-300" />
            {pendingCount} pending invite{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-xs",
          percentUsed >= 100 ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {percentUsed >= 100
          ? "All slots are reserved or filled."
          : `${group.available_slots} slot${group.available_slots === 1 ? "" : "s"} left to invite.`}
      </p>
    </div>
  );
}
