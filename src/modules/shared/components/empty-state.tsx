"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-14 text-center dark:border-white/15 dark:bg-white/5",
        className
      )}
    >
      {icon && (
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#293073]/10 text-[#293073] dark:bg-[#FB6801]/15 dark:text-[#FD8A3D]"
        >
          {icon}
        </motion.div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        {description && <p className="text-sm text-slate-500 dark:text-white/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}
