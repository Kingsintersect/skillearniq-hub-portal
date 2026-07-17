"use client";

import * as React from "react";
import gsap from "gsap";
import { Check, Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullPageLoader, formatCurrency } from "@/modules/shared";
import { useReferralSummary } from "../hooks/use-referral";

export function ReferralCodeCard() {
  const { data: summary, isLoading } = useReferralSummary();
  const [copied, setCopied] = React.useState(false);
  const badgeRef = React.useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary.referral_code);
    setCopied(true);

    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          duration: 0.18,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        }
      );
    }

    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <FullPageLoader label="Loading your referral code…" />;
  if (!summary) return null;

  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center gap-3">
          <div
            ref={badgeRef}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent-700"
          >
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Your referral code</p>
            <p className="text-xs text-muted-foreground">
              Share it — rewards credit after their first payment
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3">
          <span className="font-mono text-lg font-semibold tracking-wide text-foreground">
            {summary.referral_code}
          </span>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {summary.total_referred}
            </p>
            <p className="text-xs text-muted-foreground">Referred</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {summary.total_credited}
            </p>
            <p className="text-xs text-muted-foreground">Credited</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary-700">
              {formatCurrency(summary.wallet_balance)}
            </p>
            <p className="text-xs text-muted-foreground">Wallet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
