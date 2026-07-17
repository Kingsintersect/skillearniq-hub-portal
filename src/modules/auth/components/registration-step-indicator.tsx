"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/modules/shared";
import type { RegistrationStep } from "../hooks/use-registration-store";

const STEPS: { key: RegistrationStep; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "credentials", label: "Account" },
  { key: "otp", label: "Verify" },
  { key: "profile", label: "Profile" },
];

export function RegistrationStepIndicator({
  currentStep,
}: {
  currentStep: RegistrationStep;
}) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <ol className="mb-8 flex items-center justify-between" aria-label="Registration progress">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex || currentStep === "done";
        const isCurrent = step.key === currentStep;

        return (
          <li key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  isComplete
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="relative mx-1.5 h-px flex-1 bg-border">
                <motion.div
                  className="absolute inset-0 bg-primary"
                  initial={false}
                  animate={{ scaleX: isComplete ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
