"use client";

import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Copy, Radio, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, useCountdown } from "@/modules/shared";
import { useCheckoutStatusPolling } from "../hooks/use-billing";
import type { BankTransferInstructions, SubscriptionInitializeData } from "@/modules/auth/types";

type BankTransferData = SubscriptionInitializeData & {
  payment_method: "bank_transfer";
  instructions: BankTransferInstructions;
};

export interface BankTransferInstructionsProps {
  checkout: BankTransferData;
  onSuccess: () => void;
  onExpired: () => void;
}

const RING_RADIUS = 20;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function BankTransferInstructions({ checkout, onSuccess, onExpired }: BankTransferInstructionsProps) {
  const secondsUntilExpiry = checkout.instructions.expires_in_minutes * 60;
  const { formatted, isExpired } = useCountdown(secondsUntilExpiry);
  const [copied, setCopied] = React.useState(false);
  const hasFiredRef = React.useRef(false);
  const ringRef = React.useRef<SVGCircleElement>(null);

  const { data: status } = useCheckoutStatusPolling(checkout.group_id, !isExpired);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !ringRef.current) return;
    gsap.fromTo(
      ringRef.current,
      { strokeDashoffset: 0 },
      { strokeDashoffset: RING_CIRCUMFERENCE, duration: secondsUntilExpiry, ease: "none" }
    );
  }, [secondsUntilExpiry]);

  React.useEffect(() => {
    if (hasFiredRef.current) return;
    if (status === "active") {
      hasFiredRef.current = true;
      onSuccess();
    } else if (status === "cancelled" || isExpired) {
      hasFiredRef.current = true;
      onExpired();
    }
  }, [status, isExpired, onSuccess, onExpired]);

  const handleCopy = () => {
    navigator.clipboard.writeText(checkout.instructions.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="flex items-center justify-between bg-gradient-to-br from-primary-600 to-primary-800 px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Bank transfer</span>
          </div>

          <div className="flex items-center gap-2">
            {!isExpired && (
              <span className="relative h-11 w-11 shrink-0">
                <svg viewBox="0 0 48 48" className="h-11 w-11 -rotate-90">
                  <circle cx="24" cy="24" r={RING_RADIUS} className="fill-none stroke-white/20" strokeWidth="3" />
                  <circle
                    ref={ringRef}
                    cx="24"
                    cy="24"
                    r={RING_RADIUS}
                    className="fill-none stroke-accent-400"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={0}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums">
                  {formatted}
                </span>
              </span>
            )}
            {isExpired && (
              <span className="rounded-full bg-destructive/20 px-2.5 py-1 text-xs font-semibold text-white">Expired</span>
            )}
          </div>
        </div>

        <CardContent className="space-y-5 p-5">
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Account number</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {checkout.instructions.account_number}
                </span>
                <motion.button
                  type="button"
                  onClick={handleCopy}
                  whileTap={{ scale: 0.85 }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copy account number"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </motion.button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Bank</span>
              <span className="text-sm text-foreground">{checkout.instructions.bank_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Reference</span>
              <span className="font-mono text-xs text-muted-foreground">{checkout.instructions.reference}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Amount</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(checkout.instructions.amount_to_pay)}</span>
            </div>
          </div>

          {isExpired ? (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4 shrink-0" />
              This account has expired. Start checkout again to generate a new one.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-4 w-4 items-center justify-center"
              >
                <Radio className="h-3.5 w-3.5 text-accent-500" />
              </motion.span>
              We&apos;ll confirm automatically once your transfer is received.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}