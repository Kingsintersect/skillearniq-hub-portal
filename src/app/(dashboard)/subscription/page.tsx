"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupDashboard, PlanSelector, useMyGroup } from "@/modules/subscription";
import type { Plan } from "@/modules/subscription";
import { FullPageLoader } from "@/modules/shared";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: group, isLoading } = useMyGroup();
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);

  if (isLoading) return <FullPageLoader label="Loading your subscription…" />;
  const userId = session?.user?.id ?? -1;

  if (group?.id) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Subscription</h1>
        <GroupDashboard currentUserId={+userId} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pick your squad plan 🎓
        </h1>
        <p className="text-sm text-slate-500 dark:text-white/50">
          Go solo or team up with friends — you can invite members right after subscribing.
        </p>
      </motion.div>

      <PlanSelector selectedPlanId={selectedPlan?.id} onSelect={setSelectedPlan} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="sticky bottom-4 flex justify-end"
      >
        <Button
          size="lg"
          disabled={!selectedPlan}
          onClick={() =>
            selectedPlan && router.push(`/subscription/checkout?planId=${selectedPlan.id}`)
          }
          className="gap-2 bg-[#FB6801] text-white hover:bg-[#E0570A] disabled:opacity-40"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}

