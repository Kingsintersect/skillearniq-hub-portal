"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import { cn } from "@/modules/shared";
import type { RegistrableRole } from "../types";

export interface RoleOption {
  role: RegistrableRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "student",
    title: "Student",
    description: "Take courses, sit CBT exams, and track your progress",
    icon: GraduationCap,
  },
  {
    role: "parent",
    title: "Parent",
    description: "Monitor your children's progress, reports, and billing",
    icon: Users,
  },
];

export interface RoleSelectStepProps {
  onSelect: (role: RegistrableRole) => void;
  selected?: RegistrableRole | null;
}

/**
 * Business rule 2.1: role assigned here is structurally permanent — it
 * cannot be changed later via any user-facing API. The copy reflects that.
 */
export function RoleSelectStep({ onSelect, selected }: RoleSelectStepProps) {
  return (
    <div className="space-y-3">
      {ROLE_OPTIONS.map((option, index) => {
        const Icon = option.icon;
        const isSelected = selected === option.role;
        return (
          <motion.button
            key={option.role}
            type="button"
            onClick={() => onSelect(option.role)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary-50"
                : "border-border hover:border-primary-300 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                {option.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </motion.button>
        );
      })}
      <p className="pt-1 text-center text-xs text-muted-foreground">
        Your role can't be changed once your account is created.
      </p>
    </div>
  );
}
