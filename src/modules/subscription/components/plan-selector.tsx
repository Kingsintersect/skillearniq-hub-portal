"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, formatCurrency, FullPageLoader } from "@/modules/shared";
import { usePlans } from "../hooks/use-subscription";
import type { Plan } from "../types";

export interface PlanSelectorProps {
  selectedPlanId?: number;
  onSelect: (plan: Plan) => void;
}

/**
 * Mirrors the Family Setup Wizard "Screen 1: Choose Plan" wireframe.
 * Plan capacity badge derives from `max_members` (Rule 3.2 allocation:
 * Individual = 1, Group/Family = 5).
 */
export function PlanSelector({ selectedPlanId, onSelect }: PlanSelectorProps) {
  const { data: plans, isLoading } = usePlans();

  if (isLoading) return <FullPageLoader label="Loading plans…" />;
  if (!plans || plans.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {plans.map((plan, index) => {
        const isSelected = selectedPlanId === plan.id;
        const isGroupTier = plan.max_members > 1;

        return (
          <motion.button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary-50 ring-1 ring-primary"
                : "border-border hover:border-primary-300"
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
            <p className="text-sm font-medium text-foreground">{plan.name}</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(plan.price)}
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {isGroupTier
                ? `Up to ${plan.max_members} members`
                : "1 member"}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
