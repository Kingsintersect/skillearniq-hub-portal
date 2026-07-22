"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Loader2, PackageX } from "lucide-react";
import type { SubscriptionInitializeData } from "@/modules/auth/types";
import { CheckoutForm, usePlans } from "@/modules/billing";
import { EmptyState, FullPageLoader } from "@/modules/shared";
import { formatLocalizedPrice } from "@/lib/pricing";
import { useUserCountry } from "@/lib/user-country";
import { BankTransferInstructions } from "@/modules/billing/components/bank-transfer-instructions";

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
  const [checkout, setCheckout] = React.useState<SubscriptionInitializeData | null>(null);
  const country = useUserCountry();

  const plan = plans?.data?.find((p) => p.id === planId);

  React.useEffect(() => {
    if (!checkout || checkout.payment_method !== "card") return;

    const credoUrl = (checkout as CardData).checkout_url;
    const url = new URL(credoUrl);
    url.searchParams.set("callbackUrl", `${window.location.origin}/subscription/verify-payment`);

    const timer = setTimeout(() => {
      window.location.href = url.toString();
    }, 600);
    return () => clearTimeout(timer);
  }, [checkout]);

  if (isLoading) return <FullPageLoader label="Loading checkout…" />;

  if (!plan) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={<PackageX className="h-6 w-6" />}
          title="We couldn't find that plan"
          description="It may have changed. Head back and choose one again."
          action={
            <button
              type="button"
              onClick={() => router.push("/subscription")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to plans
            </button>
          }
        />
      </div>
    );
  }

  // Card payments redirect out — show a calm "redirecting" state instead of
  // letting the form flash back up while the effect above fires.
  if (checkout?.payment_method === "card") {
    return (
      <div className="mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-400/15 dark:text-primary-300"
          >
            <CreditCard className="h-6 w-6" />
          </motion.div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Taking you to secure payment…</p>
            <p className="text-xs text-muted-foreground">Hang tight, this only takes a second.</p>
          </div>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-10">
      <motion.button
        type="button"
        onClick={() => router.push("/subscription")}
        whileHover={{ x: -2 }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to plans
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-primary-foreground"
      >
        <p className="text-xs uppercase tracking-wide text-primary-foreground/60">You're subscribing to</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-lg font-bold">{plan.name}</p>
          <p className="text-lg font-bold">
            {formatLocalizedPrice(plan.price, country.currency)}
            <span className="text-xs font-normal text-primary-foreground/60">/mo</span>
          </p>
        </div>
      </motion.div>

      {checkout?.payment_method === "bank_transfer" ? (
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-foreground">Complete your transfer</h1>
          <BankTransferInstructions
            checkout={checkout as BankData}
            onSuccess={() => router.push("/subscription")}
            onExpired={() => setCheckout(null)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
          <CheckoutForm plan={plan} onCheckoutInitiated={setCheckout} />
        </div>
      )}
    </div>
  );
}