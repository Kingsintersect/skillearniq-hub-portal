"use client";

import { motion } from "framer-motion";
import { Building2, CreditCard } from "lucide-react";
import { cn } from "@/modules/shared";
import type { PaymentMethod } from "../types";

export interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: { method: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  {
    method: "card",
    label: "Card",
    description: "Auto-renews each cycle",
    icon: CreditCard,
  },
  {
    method: "bank_transfer",
    label: "Bank transfer",
    description: "One-time, expires in 30 minutes",
    icon: Building2,
  },
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
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary-50"
                : "border-border hover:border-primary-300"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
