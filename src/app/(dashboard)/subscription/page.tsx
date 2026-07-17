"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

  // ✅ Check if group exists as an object with data
  if (group?.id) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Subscription</h1>
        <GroupDashboard currentUserId={+userId} />
      </div>
    );
  }

  // Show loading or empty state if no group
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Subscription</h1>
      <p className="text-muted-foreground">No active subscription found.</p>
      {/* Maybe show a button to subscribe */}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Choose a plan
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick the plan that fits — you can invite members after subscribing.
        </p>
      </div>

      <PlanSelector
        selectedPlanId={selectedPlan?.id}
        onSelect={setSelectedPlan}
      />

      <Button
        size="lg"
        disabled={!selectedPlan}
        onClick={() =>
          selectedPlan &&
          router.push(`/subscription/checkout?planId=${selectedPlan.id}`)
        }
      >
        Continue
      </Button>
    </div>
  );
}
