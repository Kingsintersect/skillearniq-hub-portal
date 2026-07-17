"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SubscriptionInitializeData } from "@/modules/auth/types"; // ✅ Import from auth/types
import { CheckoutForm, usePlans } from "@/modules/billing";
import { FullPageLoader } from "@/modules/shared";
import { BankTransferInstructions } from "@/modules/billing/components/bank-transfer-instructions";

// ✅ Define types based on the actual API response
type CardData = SubscriptionInitializeData & {
  payment_method: "card";
  checkout_url: string;
};

type BankData = SubscriptionInitializeData & {
  payment_method: "bank_transfer";
  instructions: {
    amount_to_pay: number;
    bank_name: string;
    account_number: string;
    reference: string;
    expires_in_minutes: number;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = Number(searchParams.get("planId"));

  const { data: plans, isLoading } = usePlans();
  const [checkout, setCheckout] =
    React.useState<SubscriptionInitializeData | null>(null);

  const plan = plans?.data?.find((p) => p.id === planId);

  React.useEffect(() => {
    // if (!checkout || checkout.payment_method !== "card") return;
    // // Card checkout: redirect to gateway immediately
    // window.location.href = (checkout as CardData).checkout_url;
    if (!checkout || checkout.payment_method !== "card") return;

    // Credo checkout URL
    const credoUrl = (checkout as CardData).checkout_url;

    // Add callback URL parameter if not already included
    const url = new URL(credoUrl);
    url.searchParams.set('callbackUrl', `${window.location.origin}/subscription/verify-payment`);

    window.location.href = url.toString();
  }, [checkout]);

  if (isLoading) return <FullPageLoader label="Loading checkout…" />;

  if (!plan) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find that plan. Go back and choose one again.
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
          checkout={checkout as BankData}
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