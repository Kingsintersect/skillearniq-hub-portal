"use client";

import { PaymentHistoryTable, SubscriptionStatusCard } from "@/modules/billing";

export default function BillingPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription status and payment history.
        </p>
      </div>
      <SubscriptionStatusCard />
      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground">
          Payment history
        </h2>
        <PaymentHistoryTable />
      </div>
    </div>
  );
}
