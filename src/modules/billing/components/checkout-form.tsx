"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, getErrorMessage } from "@/modules/shared";
import { useInitiateCheckout } from "../hooks/use-billing";
import { PaymentMethodSelect } from "./payment-method-select";
import { CouponInput } from "./coupon-input";
import type { PaymentMethod } from "../types";
import type {
  SubscriptionInitializeData,
  SubscriptionInitializePayload,
} from "@/modules/auth/types";
import type { PlanData } from "@/modules/auth/types";

export interface CheckoutFormProps {
  plan: PlanData;
  onCheckoutInitiated: (data: SubscriptionInitializeData) => void;
}

export function CheckoutForm({ plan, onCheckoutInitiated }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");
  const [couponCode, setCouponCode] = React.useState<string | undefined>();
  const [estimatedDiscount, setEstimatedDiscount] = React.useState(0);

  const checkoutMutation = useInitiateCheckout();

  const estimatedTotal = Math.max(plan.price - estimatedDiscount, 0);

  const handleSubmit = () => {
    const payload: SubscriptionInitializePayload = {
      plan_id: plan.id,
      gateway: "paystack",           // your default gateway
      payment_method: paymentMethod,
      coupon_code: couponCode,
    };

    checkoutMutation.mutate(payload, {
      onSuccess: (response) => onCheckoutInitiated(response.data),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-sm font-medium text-foreground">Payment method</h3>
        <div className="mt-2">
          <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">Coupon</h3>
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

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{plan.name}</span>
          <span className="text-foreground">{formatCurrency(plan.price)}</span>
        </div>
        {estimatedDiscount > 0 && (
          <div className="flex justify-between text-sm text-secondary-700">
            <span>Coupon discount</span>
            <span>-{formatCurrency(estimatedDiscount)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-base font-semibold text-foreground">
          <span>Estimated total</span>
          <span>{formatCurrency(estimatedTotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Final amount is confirmed by the server at checkout.
        </p>
      </div>

      {Boolean(checkoutMutation.error) && (
        <p className="text-sm text-destructive">
          {getErrorMessage(checkoutMutation.error)}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={checkoutMutation.isPending}
      >
        {checkoutMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {paymentMethod === "card"
          ? "Continue to payment"
          : "Generate transfer details"}
      </Button>
    </motion.div>
  );
}