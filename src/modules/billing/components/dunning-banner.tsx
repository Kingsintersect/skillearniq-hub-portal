"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/modules/shared";
import { useRetryPayment, useSubscriptionBillingStatus } from "../hooks/use-billing";

/**
 * Mirrors Rule 4.3 dunning timeline:
 * Day 0 fail -> past_due, 7-day grace period; retries on Day 2 & 5;
 * Day 7 exhausted -> cancelled (access lock).
 */
export function DunningBanner() {
  const { data: status } = useSubscriptionBillingStatus();
  const retryMutation = useRetryPayment();

  if (!status || status.status === "current") return null;

  if (status.status === "cancelled") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
      >
        <XCircle className="h-5 w-5 shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">
            Your subscription was cancelled
          </p>
          <p className="text-xs text-destructive/80">
            Payment retries were exhausted. Subscribe again to restore access.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-lg border border-accent-300 bg-accent-50 p-4"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-accent-700" />
      <div className="flex-1">
        <p className="text-sm font-medium text-accent-900">
          Your last payment failed
        </p>
        <p className="text-xs text-accent-800">
          {status.grace_period_ends_at
            ? `Access continues until ${formatDate(status.grace_period_ends_at)}. We'll retry automatically.`
            : "We'll retry your card automatically."}
          {status.next_retry_at &&
            ` Next retry: ${formatDate(status.next_retry_at)}.`}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => retryMutation.mutate()}
        disabled={retryMutation.isPending}
      >
        {retryMutation.isPending && (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        )}
        Retry now
      </Button>
    </motion.div>
  );
}
