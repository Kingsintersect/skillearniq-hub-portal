"use client";

import { ReferralCodeCard, ReferralLedgerTable } from "@/modules/referral";

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Referrals</h1>
        <p className="text-sm text-muted-foreground">
          Share your code and track your rewards.
        </p>
      </div>
      <ReferralCodeCard />
      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground">
          Referral history
        </h2>
        <ReferralLedgerTable />
      </div>
    </div>
  );
}
