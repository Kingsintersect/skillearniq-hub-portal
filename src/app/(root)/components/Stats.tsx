'use client';

import React, { RefObject, useEffect, useRef, useState } from 'react';
import { GraduationCap, ClipboardList, Target, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/animations/useScrollAnimation';

type Stat = { icon: LucideIcon; value: number; suffix: string; label: string };

const GAME_STATS: Stat[] = [
    { icon: GraduationCap, value: 12, suffix: 'K+', label: 'Students learning' },
    { icon: ClipboardList, value: 50, suffix: 'K+', label: 'CBT questions' },
    { icon: Target, value: 5, suffix: '', label: 'Exams covered' },
    { icon: TrendingUp, value: 92, suffix: '%', label: 'Feel more exam-ready' },
];

const DURATION = 1600;

/** Eases a number from 0 to `target` once `active` becomes true. */
function useCountUp(target: number, active: boolean) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(target);
            return;
        }
        let raf = 0;
        let start: number | undefined;
        const step = (t: number) => {
            if (start === undefined) start = t;
            const progress = Math.min((t - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setValue(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [active, target]);

    return value;
}

const StatCard = ({ stat, active, delay }: { stat: Stat; active: boolean; delay: number }) => {
    const Icon = stat.icon;
    const count = useCountUp(stat.value, active);

    return (
        <div
            className={`group rounded-2xl bg-white/10 hover:bg-white/[0.16] px-5 py-7 text-center transition-all duration-700 hover:-translate-y-1 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className="grid place-items-center h-12 w-12 mx-auto rounded-xl bg-accent text-white mb-4 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
            </span>
            <span className="text-4xl md:text-5xl font-extrabold text-white block tabular-nums">
                {count}
                <span className="text-accent-300">{stat.suffix}</span>
            </span>
            <span className="text-sm text-white/75 mt-1 block">{stat.label}</span>
        </div>
    );
};

export const Stats: React.FC = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(statsRef as RefObject<HTMLElement>);

    return (
        <section ref={statsRef} className="relative overflow-hidden bg-primary py-16 px-6">
            {/* Subtle background shapes (no gradients) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/5" />
                <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-white/5" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent-300 mb-3 block">
                        The SkillearnIQ effect
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Real momentum, real numbers
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {GAME_STATS.map((stat, index) => (
                        <StatCard key={stat.label} stat={stat} active={isVisible} delay={index * 120} />
                    ))}
                </div>
            </div>
        </section>
    );
};
