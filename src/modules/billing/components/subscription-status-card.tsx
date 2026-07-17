"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FullPageLoader,
  StatusBadge,
  formatDate,
  statusToTone,
} from "@/modules/shared";
import { useSubscriptionBillingStatus } from "../hooks/use-billing";
import { DunningBanner } from "./dunning-banner";

export function SubscriptionStatusCard() {
  const { data: status, isLoading } = useSubscriptionBillingStatus();

  if (isLoading) return <FullPageLoader label="Loading subscription status…" />;
  if (!status) return null;

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Subscription status
            </p>
            <p className="text-xs text-muted-foreground">
              Renews/ends {formatDate(status.ends_at)}
            </p>
          </div>
          <StatusBadge label={status.status} tone={statusToTone(status.status)} />
        </CardContent>
      </Card>
      <DunningBanner />
    </div>
  );
}
