"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/modules/shared";
import { useValidateCoupon } from "../hooks/use-billing";

export interface CouponInputProps {
  planId: number;
  onApply: (code: string, discountAmount: number) => void;
  onRemove: () => void;
  appliedCode?: string;
}

/**
 * Rule 5.1: non-stackable, one coupon per invoice, checked against
 * expires_at and max_uses server-side. This component shows live
 * validation but the server remains authoritative at checkout.
 */
export function CouponInput({
  planId,
  onApply,
  onRemove,
  appliedCode,
}: CouponInputProps) {
  const [code, setCode] = React.useState("");
  const [shouldValidate, setShouldValidate] = React.useState(false);

  const { data, isFetching } = useValidateCoupon(code, planId, shouldValidate);

  React.useEffect(() => {
    if (!shouldValidate || !data) return;
    if (data.valid && data.discount_amount !== undefined) {
      onApply(data.code, data.discount_amount);
    }
    setShouldValidate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (appliedCode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2"
      >
        <span className="flex items-center gap-2 text-sm text-secondary-800">
          <CheckCircle2 className="h-4 w-4" />
          {appliedCode} applied
        </span>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onRemove}>
          Remove
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={cn(
            data && !data.valid && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!code || isFetching}
          onClick={() => setShouldValidate(true)}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      <AnimatePresence>
        {data && data.valid === false && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <XCircle className="h-3.5 w-3.5" />
            {data.reason ?? "This coupon isn't valid"}
          </motion.p>
        )}
        {data?.valid && data.discount_amount !== undefined && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-secondary-700"
          >
            Saves {formatCurrency(data.discount_amount)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
