import Image from 'next/image';
import Link from 'next/link';
import { Flame, GraduationCap, MonitorPlay, ShieldCheck, Trophy } from 'lucide-react';

const TRUST = [
    { icon: GraduationCap, label: '12K+ students' },
    { icon: MonitorPlay, label: 'Real CBT practice' },
    { icon: Trophy, label: 'XP, badges & streaks' },
];

export default function AuthSidebar() {
    return (
        <div className="relative font-outfit flex h-full w-full min-h-[600px] flex-col justify-between overflow-hidden bg-[#1B2151] p-8 text-white md:p-12 lg:p-14">
            {/* Soft solid shapes (no gradients) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5" />
                <div className="absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-white/5" />
            </div>

            {/* Brand */}
            <div className="relative">
                <Link href="/" className="inline-flex items-center" aria-label="SkillearnIQ Hub home">
                    <span className="inline-flex items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
                        <Image
                            src="/logo/logo.jpg"
                            alt="SkillearnIQ Hub"
                            width={160}
                            height={160}
                            className="h-16 w-16 object-contain"
                            priority
                        />
                    </span>
                </Link>
            </div>

            {/* Middle */}
            <div className="relative my-10 space-y-8">
                <div>
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                        {/* <Sparkles className="h-4 w-4 text-accent-300" /> */}
                        Nigeria&apos;s smart exam-success ecosystem
                    </span>
                    <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
                        Learn smarter.
                        <br />
                        <span className="text-accent-300">Pass with confidence.</span>
                    </h1>
                    <p className="mt-3 max-w-md text-white/75">
                        Smart lessons, real CBT practice and an AI study buddy — wrapped in XP,
                        badges and streaks that keep you going all the way to exam day.
                    </p>
                </div>

                {/* Image + floating gamified card (echoes the homepage hero) */}
                <div className="relative max-w-md">
                    <div className="relative h-56 overflow-hidden rounded-3xl ring-1 ring-white/10">
                        <Image
                            src="/slides/h1.jpg"
                            alt="Students learning on SkillearnIQ"
                            fill
                            sizes="(max-width: 1024px) 0px, 480px"
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-gray-900 shadow-lg">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
                            <Flame className="h-5 w-5" />
                        </span>
                        <div className="leading-tight">
                            <p className="text-xs text-gray-500">Study streak</p>
                            <p className="text-sm font-bold">12 days</p>
                        </div>
                    </div>
                </div>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2">
                    {TRUST.map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90"
                        >
                            <Icon className="h-4 w-4 text-accent-300" />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Bottom support callout */}
            <div className="relative max-w-md rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-accent-300">
                    <ShieldCheck className="h-4 w-4" />
                    Need a hand?
                </div>
                <p className="text-xs leading-relaxed text-white/70">
                    Trouble signing in or setting up your account? Reach the{' '}
                    <span className="font-medium text-white">SkillearnIQ support team</span> and
                    we&apos;ll get you back to learning.
                </p>
            </div>
        </div>
    );
}
