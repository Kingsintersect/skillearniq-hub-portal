"use client";

import * as React from "react";
import gsap from "gsap";

export interface CapacityMeterGroup {
  active_members: unknown[];
  available_slots: number;
}

export interface CapacityMeterProps {
  group: CapacityMeterGroup;
}

export function CapacityMeter({ group }: CapacityMeterProps) {
  const filled = group.active_members.length;
  const total = filled + group.available_slots;
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  const barRef = React.useRef<HTMLDivElement>(null);
  const countRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(barRef.current, { width: `${percent}%` });
        if (countRef.current) countRef.current.textContent = String(filled);
        return;
      }
      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        { width: `${percent}%`, duration: 1, ease: "power3.out" }
      );
      const counter = { value: 0 };
      gsap.to(counter, {
        value: filled,
        duration: 1,
        ease: "power3.out",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.value));
        },
      });
    });

    return () => ctx.revert();
  }, [filled, percent]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">
          Squad capacity
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          <span ref={countRef}>0</span>
          <span className="text-slate-400 dark:text-white/40"> / {total} seats filled</span>
        </p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-[#293073] to-[#FB6801]"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}

