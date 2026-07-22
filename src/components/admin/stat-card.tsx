"use client";

import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
    label: string;
    value: number;
    // icon: LucideIcon;
    icon: React.ReactNode;
    suffix?: string;
    accent?: "primary" | "accent" | "emerald";
    delay?: number;
}

const ACCENT_MAP = {
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-400/15 dark:text-primary-300",
    accent: "bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
};

export function StatCard({ label, value, icon: Icon, suffix = "", accent = "primary", delay = 0 }: StatCardProps) {
    const ref = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            if (ref.current) ref.current.textContent = String(value);
            return;
        }
        const counter = { value: 0 };
        const tween = gsap.to(counter, {
            value,
            duration: 1.1,
            delay,
            ease: "power3.out",
            onUpdate: () => {
                if (ref.current) ref.current.textContent = String(Math.round(counter.value));
            },
        });
        return () => {
            tween.kill();
        };
    }, [value, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
            <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-xl", ACCENT_MAP[accent])}>
                {/* <Icon className="h-4 w-4" /> */}
                {Icon}
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
                <span ref={ref}>0</span>
                {suffix}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </motion.div>
    );
}