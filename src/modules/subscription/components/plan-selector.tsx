"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, User, Users2 } from "lucide-react";
import { cn, formatCurrency, FullPageLoader } from "@/modules/shared";
import { usePlans } from "../hooks/use-subscription";
import type { Plan } from "../types";

export interface PlanSelectorProps {
  selectedPlanId?: number;
  onSelect: (plan: Plan) => void;
}

export function PlanSelector({ selectedPlanId, onSelect }: PlanSelectorProps) {
  const { data: plans, isLoading } = usePlans();
  const reduceMotion = useReducedMotion();

  if (isLoading) return <FullPageLoader label="Loading plans…" />;
  if (!plans || plans.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((plan, index) => {
        const isSelected = selectedPlanId === plan.id;
        const isGroupTier = plan.max_members > 1;
        const isFeatured = plans.length > 1 && index === 1;

        return (
          <motion.button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan)}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : index * 0.08,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className={cn(
              "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-colors",
              "bg-white dark:bg-[#141833]",
              isSelected
                ? "border-[#FB6801] shadow-[0_0_0_3px_rgba(251,104,1,0.15)]"
                : "border-slate-200 hover:border-[#293073]/40 dark:border-white/10 dark:hover:border-[#FB6801]/40"
            )}
          >
            {/* top accent bar */}
            <span
              className={cn(
                "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#293073] to-[#FB6801] transition-opacity",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
              )}
            />

            {isFeatured && (
              <span className="absolute right-3 top-4 inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[10px] font-semibold text-[#E0570A] dark:bg-[#FB6801]/15 dark:text-[#FD8A3D]">
                <Sparkles className="h-3 w-3" /> Best for squads
              </span>
            )}

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#FB6801] text-white shadow-sm"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.div>
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#293073]/10 text-[#293073] dark:bg-white/10 dark:text-[#8E9BDB]">
              {isGroupTier ? <Users2 className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white">{plan.name}</p>

            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(plan.price)}
              <span className="text-sm font-normal text-slate-500 dark:text-white/50">/month</span>
            </p>

            <p className="text-xs text-slate-500 dark:text-white/50">
              {isGroupTier ? `Squad up with up to ${plan.max_members} people` : "Just for you"}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}


