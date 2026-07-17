"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Copy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, useCountdown } from "@/modules/shared";
import { useCheckoutStatusPolling } from "../hooks/use-billing";
import type { BankTransferCheckoutData } from "../types";

export interface BankTransferInstructionsProps {
  checkout: BankTransferCheckoutData;
  onSuccess: () => void;
  onExpired: () => void;
}

/**
 * Rule 4.4: virtual account numbers remain active for exactly 30 minutes.
 * On expiry, the unpaid reference is dropped and the user must generate a
 * new one — this component enforces that by disabling actions at zero.
 */
export function BankTransferInstructions({
  checkout,
  onSuccess,
  onExpired,
}: BankTransferInstructionsProps) {
  const secondsUntilExpiry = Math.max(
    Math.floor((new Date(checkout.expires_at).getTime() - Date.now()) / 1000),
    0
  );
  const { formatted, isExpired } = useCountdown(secondsUntilExpiry);
  const [copied, setCopied] = React.useState(false);

  const status = useCheckoutStatusPolling(checkout.reference, !isExpired);
  const hasFiredRef = React.useRef(false);

  React.useEffect(() => {
    if (hasFiredRef.current) return;
    if (status.data === "successful") {
      hasFiredRef.current = true;
      onSuccess();
    } else if (status.data === "expired" || isExpired) {
      hasFiredRef.current = true;
      onExpired();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.data, isExpired]);

  const handleCopy = () => {
    navigator.clipboard.writeText(checkout.virtual_account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Bank transfer
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                isExpired ? "text-destructive" : "text-foreground"
              }`}
            >
              {isExpired ? "Expired" : formatted}
            </span>
          </div>

          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Account number</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-medium text-foreground">
                  {checkout.virtual_account_number}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copy account number"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-secondary-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Bank</span>
              <span className="text-sm text-foreground">{checkout.bank_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Account name</span>
              <span className="text-sm text-foreground">
                {checkout.account_name}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Amount</span>
              <span className="text-base font-semibold text-foreground">
                {formatCurrency(checkout.summary.total_due)}
              </span>
            </div>
          </div>

          {isExpired ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4 shrink-0" />
              This account has expired. Start checkout again to generate a
              new one.
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              We'll confirm automatically once your transfer is received.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
