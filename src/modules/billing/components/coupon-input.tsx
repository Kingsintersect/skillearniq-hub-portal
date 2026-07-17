"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/modules/shared";
import { useValidateCoupon } from "../hooks/use-billing";

export interface CouponInputProps {
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
  onApply,
  onRemove,
  appliedCode,
}: CouponInputProps) {
  const [code, setCode] = React.useState("");
  const [shouldValidate, setShouldValidate] = React.useState(false);

  const { data, isFetching } = useValidateCoupon(code, shouldValidate);

  React.useEffect(() => {
    if (!shouldValidate || !data) return;
    if (data.coupon.is_valid) {
      onApply(data.coupon.code, data.coupon.value);
    }
    setShouldValidate(false);
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
            data && !data.coupon.is_valid && "border-destructive focus-visible:ring-destructive"
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
        {data && data.coupon.is_valid === false && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <XCircle className="h-3.5 w-3.5" />
            This coupon isn&apos;t valid
          </motion.p>
        )}
        {data?.coupon.is_valid && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-secondary-700"
          >
            {data.coupon.type === "percentage"
              ? `${data.coupon.value}% off`
              : `Saves ${formatCurrency(data.coupon.value)}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
