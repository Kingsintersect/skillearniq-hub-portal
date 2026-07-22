"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/modules/shared";
import { formatLocalizedPrice } from "@/lib/pricing";
import { useUserCountry } from "@/lib/user-country";
import { AFRICAN_COUNTRIES, getCurrencyLabel } from "@/lib/africa-countries";
import { useInitiateCheckout } from "../hooks/use-billing";
import { PaymentMethodSelect } from "./payment-method-select";
import { CouponInput } from "./coupon-input";
import type { PaymentMethod } from "../types";
import type { SubscriptionInitializeData, SubscriptionInitializePayload, PlanData } from "@/modules/auth/types";

export interface CheckoutFormProps {
  plan: PlanData;
  onCheckoutInitiated: (data: SubscriptionInitializeData) => void;
}

export function CheckoutForm({ plan, onCheckoutInitiated }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");
  const [couponCode, setCouponCode] = React.useState<string | undefined>();
  const [estimatedDiscount, setEstimatedDiscount] = React.useState(0);
  const [chosenCurrency, setChosenCurrency] = React.useState<string | null>(null);

  const country = useUserCountry();
  // Default to the learner's country currency until they pick another.
  const currency = chosenCurrency ?? country.currency;

  // Unique currency options, with the learner's country currency first.
  const currencyOptions = React.useMemo(() => {
    const seen = new Set<string>();
    return [country.currency, "NGN", "USD", ...AFRICAN_COUNTRIES.map((c) => c.currency)]
      .filter((code) => (seen.has(code) ? false : (seen.add(code), true)));
  }, [country.currency]);

  const checkoutMutation = useInitiateCheckout();
  const estimatedTotal = Math.max(plan.price - estimatedDiscount, 0);

  const handleSubmit = () => {
    const payload: SubscriptionInitializePayload = {
      plan_id: plan.id,
      gateway: "paystack",
      payment_method: paymentMethod,
      coupon_code: couponCode ?? "",
      currency,
    };
    checkoutMutation.mutate(payload, {
      onSuccess: (response) => onCheckoutInitiated(response.data),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Payment method</h3>
        <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Pay in currency</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Choose the currency you want to be charged in.
        </p>
        <Select value={currency} onValueChange={setChosenCurrency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {currencyOptions.map((code) => (
              <SelectItem key={code} value={code}>
                {getCurrencyLabel(code)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Have a coupon?</h3>
        <CouponInput
          appliedCode={couponCode}
          onApply={(code, discount) => {
            setCouponCode(code);
            setEstimatedDiscount(discount);
          }}
          onRemove={() => {
            setCouponCode(undefined);
            setEstimatedDiscount(0);
          }}
        />
      </div>

      <motion.div
        layout
        className="space-y-2 rounded-2xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-400/20 dark:bg-accent-400/10"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{plan.name}</span>
          <span className="text-foreground">{formatLocalizedPrice(plan.price, currency)}</span>
        </div>
        {estimatedDiscount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400"
          >
            <span>Coupon discount</span>
            <span>-{formatLocalizedPrice(estimatedDiscount, currency)}</span>
          </motion.div>
        )}
        <Separator className="bg-accent-200 dark:bg-accent-400/20" />
        <div className="flex justify-between text-base font-bold text-foreground">
          <span>Estimated total</span>
          <span>{formatLocalizedPrice(estimatedTotal, currency)}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Final amount is confirmed by the server at checkout.
        </p>
      </motion.div>

      {Boolean(checkoutMutation.error) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {getErrorMessage(checkoutMutation.error)}
        </motion.p>
      )}

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Button
          className="w-full gap-2 bg-accent-500 text-white hover:bg-accent-600"
          size="lg"
          onClick={handleSubmit}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {paymentMethod === "card" ? "Continue to payment" : "Generate transfer details"}
        </Button>
      </motion.div>
    </motion.div>
  );
}