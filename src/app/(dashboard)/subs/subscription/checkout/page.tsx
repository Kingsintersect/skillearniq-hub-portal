"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BankTransferInstructions,
  CheckoutForm,
} from "@/modules/billing";
import type { InitiateCheckoutData } from "@/modules/billing";
import { usePlans } from "@/modules/subscription";
import { FullPageLoader } from "@/modules/shared";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = Number(searchParams.get("planId"));

  const { data: plans, isLoading } = usePlans();
  const [checkout, setCheckout] = React.useState<InitiateCheckoutData | null>(
    null
  );

  const plan = plans?.find((p) => p.id === planId);

  React.useEffect(() => {
    // Card checkouts hand off to the gateway's hosted page immediately.
    if (checkout?.payment_method === "card") {
      window.location.href = checkout.authorization_url;
    }
  }, [checkout]);

  if (isLoading) return <FullPageLoader label="Loading checkout…" />;

  if (!plan) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          We couldn't find that plan. Go back and choose one again.
        </p>
        <button
          className="text-sm font-medium text-primary hover:underline"
          onClick={() => router.push("/subscription")}
        >
          Back to plans
        </button>
      </div>
    );
  }

  if (checkout?.payment_method === "bank_transfer") {
    return (
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-foreground">
          Complete your transfer
        </h1>
        <BankTransferInstructions
          checkout={checkout}
          onSuccess={() => router.push("/subscription")}
          onExpired={() => setCheckout(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
      <CheckoutForm plan={plan} onCheckoutInitiated={setCheckout} />
    </div>
  );
}
