"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Ticket, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/modules/shared";
import { useValidateCoupon } from "../hooks/use-billing";

export interface CouponInputProps {
  onApply: (code: string, discountAmount: number) => void;
  onRemove: () => void;
  appliedCode?: string;
}

export function CouponInput({ onApply, onRemove, appliedCode }: CouponInputProps) {
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="success-bounce flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 dark:border-emerald-400/30 dark:bg-emerald-400/10"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {appliedCode} applied
        </span>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400" onClick={onRemove}>
          Remove
        </Button>
      </motion.div>
    );
  }

  const isInvalid = data && data.coupon.is_valid === false;

  return (
    <div className="space-y-2">
      <div className={cn("flex gap-2", isInvalid && "error-shake")}>
        <div className="relative flex-1">
          <Ticket className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className={cn("pl-8", isInvalid && "border-destructive focus-visible:ring-destructive")}
          />
        </div>
        <Button type="button" variant="outline" disabled={!code || isFetching} onClick={() => setShouldValidate(true)}>
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      <AnimatePresence>
        {isInvalid && (
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
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.coupon.type === "percentage" ? `${data.coupon.value}% off` : `Saves ${formatCurrency(data.coupon.value)}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}