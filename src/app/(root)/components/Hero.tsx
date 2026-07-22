"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    BrainCircuit,
    ChevronLeft,
    ChevronRight,
    Flame,
    MonitorPlay,
    Target,
    Trophy,
} from "lucide-react";
import { ROUTES } from "@/config";

const HERO_CHIPS = [
    { icon: MonitorPlay, label: "CBT exam practice" },
    { icon: BrainCircuit, label: "AI study assistant" },
    { icon: Trophy, label: "XP, badges & streaks" },
];

const SLIDES = [
    {
        eyebrow: "Nigeria's smart exam-success ecosystem",
        titleLead: "Pass WAEC, JAMB & NECO",
        titleAccent: "with confidence.",
        description:
            "Smart lessons, real CBT practice and live classes — wrapped in XP, badges and streaks that keep you learning all the way to exam day.",
        mainImg: { src: "/slides/h1.jpg", alt: "Students studying together" },
        subImg: { src: "/slides/h2.jpg", alt: "Student solving maths on a whiteboard" },
    },
    {
        eyebrow: "Never get stuck again",
        titleLead: "Your AI study buddy,",
        titleAccent: "available 24/7.",
        description:
            "Ask anything and get it explained simply — with WAEC and JAMB examples. Like having a lesson teacher in your pocket, day or night.",
        mainImg: { src: "/slides/h3.jpg", alt: "Student solving maths on a whiteboard" },
        subImg: { src: "/slides/h9.jpg", alt: "Student reading in the library" },
    },
    {
        eyebrow: "Learning that feels like play",
        titleLead: "Turn studying into",
        titleAccent: "a game you win.",
        description:
            "Earn XP for every lesson and quiz, keep your daily streak alive, unlock badges and climb the leaderboard with friends.",
        mainImg: { src: "/slides/h5.jpg", alt: "Student reading in the library" },
        subImg: { src: "/slides/h6.jpg", alt: "Graduates celebrating success" },
    },
    {
        eyebrow: "Built for real results",
        titleLead: "From first lesson to",
        titleAccent: "graduation day.",
        description:
            "Track your readiness score as it climbs, see exactly what to revise next, and walk into your exams genuinely prepared.",
        mainImg: { src: "/slides/h7.jpg", alt: "Graduates celebrating success" },
        subImg: { src: "/slides/h8.jpg", alt: "Students studying together" },
    },
];

const AUTOPLAY_MS = 6000;

export const Hero = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback((i: number) => setActive((i + SLIDES.length) % SLIDES.length), []);
    const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);
    const prev = useCallback(() => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length), []);

    useEffect(() => {
        if (paused) return;
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(next, AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [paused, active, next]);

    const slide = SLIDES[active];

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-secondary-50 dark:bg-gray-950 pt-32 pb-20 px-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="SkillearnIQ highlights"
        >
            {/* Soft solid shapes (no gradients) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-accent/10" />
                <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-primary/10" />
            </div>

            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Copy — re-keyed per slide so it animates in */}
                <div className="text-center lg:text-left">
                    <div key={active} className="animate-slide-up">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 text-accent px-4 py-1.5 text-sm font-semibold mb-6">
                            {slide.eyebrow}
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.05] mb-5">
                            {slide.titleLead}
                            <span className="text-primary"> {slide.titleAccent}</span>
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
                            {slide.description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                        <Link
                            href={ROUTES.register ?? "/auth/signin"}
                            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-600 text-accent-foreground font-semibold px-7 py-3.5 rounded-full text-lg transition-colors shadow-sm"
                        >
                            Start learning free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary font-semibold px-7 py-3.5 rounded-full text-lg transition-colors"
                        >
                            See how it works
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {HERO_CHIPS.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                <Icon className="h-4 w-4 text-primary" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Image carousel + persistent gamified HUD */}
                <div className="relative mx-auto w-full max-w-lg">
                    <div className="relative h-[460px] sm:h-[520px]">
                        {SLIDES.map((s, i) => (
                            <div
                                key={s.mainImg.src + i}
                                aria-hidden={i !== active}
                                className={`absolute inset-0 grid grid-cols-5 grid-rows-6 gap-4 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                            >
                                <div className="col-span-3 row-span-6 relative rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5">
                                    <Image
                                        src={s.mainImg.src}
                                        alt={s.mainImg.alt}
                                        fill
                                        sizes="(max-width: 1024px) 60vw, 300px"
                                        className="object-cover"
                                        priority={i === 0}
                                    />
                                </div>
                                <div className="col-span-2 row-span-6 relative rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5">
                                    <Image
                                        src={s.subImg.src}
                                        alt={s.subImg.alt}
                                        fill
                                        sizes="(max-width: 1024px) 40vw, 200px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Floating icon cards (persist across slides) */}
                        {/* <div className="absolute -top-4 left-4 z-10 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
                            <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent/15 text-accent">
                                <Flame className="h-5 w-5" />
                            </span>
                            <div className="text-left leading-tight">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Study streak</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">12 days</p>
                            </div>
                        </div> */}

                        <div className="absolute -bottom-5 right-2 z-10 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 px-4 py-3 w-52">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary/15 text-primary">
                                    <Target className="h-4 w-4" />
                                </span>
                                <div className="text-left leading-tight">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">JAMB readiness</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">78% ready</p>
                                </div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <div className="h-full rounded-full bg-accent" style={{ width: "78%" }} />
                            </div>
                        </div>
                    </div>

                    {/* Carousel controls */}
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            onClick={prev}
                            aria-label="Previous slide"
                            className="grid place-items-center h-9 w-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {SLIDES.map((s, i) => (
                                <button
                                    key={s.titleAccent}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    aria-current={i === active}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-accent" : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            aria-label="Next slide"
                            className="grid place-items-center h-9 w-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
