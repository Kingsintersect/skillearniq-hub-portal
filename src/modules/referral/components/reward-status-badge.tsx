"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge, statusToTone } from "@/modules/shared";
import {
  REWARD_BLOCKED_EXPLANATION,
  REWARD_PENDING_EXPLANATION,
  type RewardStatus,
} from "../types";

export function RewardStatusBadge({ status }: { status: RewardStatus }) {
  const explanation =
    status === "pending"
      ? REWARD_PENDING_EXPLANATION
      : status === "blocked"
        ? REWARD_BLOCKED_EXPLANATION
        : null;

  const badge = <StatusBadge label={status} tone={statusToTone(status)} />;

  if (!explanation) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{badge}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        {explanation}
      </TooltipContent>
    </Tooltip>
  );
}
