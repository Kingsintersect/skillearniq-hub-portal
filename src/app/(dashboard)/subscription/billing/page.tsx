"use client";

import { motion } from "framer-motion";
import { PaymentHistoryTable, SubscriptionStatusCard } from "@/modules/billing";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">Your subscription status and payment history.</p>
      </motion.div>
      <SubscriptionStatusCard />
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Payment history</h2>
        <PaymentHistoryTable />
      </div>
    </div>
  );
}