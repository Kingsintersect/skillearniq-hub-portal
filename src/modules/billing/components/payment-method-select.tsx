"use client";

import { motion } from "framer-motion";
import { Building2, Check, CreditCard } from "lucide-react";
import { cn } from "@/modules/shared";
import type { PaymentMethod } from "../types";

export interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: { method: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  { method: "card", label: "Card", description: "Auto-renews each cycle", icon: CreditCard },
  { method: "bank_transfer", label: "Bank transfer", description: "One-time, expires in 30 minutes", icon: Building2 },
];

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.method;
        return (
          <motion.button
            key={option.method}
            type="button"
            onClick={() => onChange(option.method)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl border-2 p-3.5 text-left transition-colors",
              isSelected
                ? "border-accent-500 bg-accent-50 dark:bg-accent-400/10"
                : "border-border bg-card hover:border-primary-300 dark:hover:border-primary-400/40"
            )}
          >
            {/* top accent bar — same selection language as the plan cards */}
            <span
              className={cn(
                "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 to-accent-500 transition-opacity",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )}
            />

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-white shadow-sm"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </motion.div>
            )}

            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                isSelected
                  ? "bg-accent-500 text-white"
                  : "bg-primary-100 text-primary-600 dark:bg-white/10 dark:text-primary-200"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}