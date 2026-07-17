"use client";

import { motion } from "framer-motion";
import { cn } from "@/modules/shared";

interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

const RULES: PasswordRule[] = [
  { label: "8+ characters", test: (v) => v.length >= 8 },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Number", test: (v) => /[0-9]/.test(v) },
  { label: "Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function PasswordStrengthMeter({ password }: { password: string }) {
  const passedCount = RULES.filter((rule) => rule.test(password)).length;
  const strength = passedCount / RULES.length;

  const barColor =
    strength === 1
      ? "bg-secondary-600"
      : strength >= 0.6
        ? "bg-accent-500"
        : "bg-destructive";

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {RULES.map((rule) => {
          const passed = password.length > 0 && rule.test(password);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors",
                passed ? "text-secondary-700" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  passed ? "bg-secondary-600" : "bg-muted-foreground/40"
                )}
              />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
