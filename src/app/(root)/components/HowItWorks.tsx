import { BookOpenText, ClipboardCheck, Target, Trophy } from "lucide-react";

const STEPS = [
    {
        icon: Target,
        step: "01",
        title: "Choose your exam",
        description: "Tell us your exam — WAEC, JAMB, NECO, GCE or BECE — and your subjects. We build a personalised study plan around your goals.",
    },
    {
        icon: BookOpenText,
        step: "02",
        title: "Learn with lessons + AI",
        description: "Watch smart video lessons, read notes and ask your AI tutor anything, anytime. Learn at your own pace, even offline.",
    },
    {
        icon: ClipboardCheck,
        step: "03",
        title: "Practise real CBT",
        description: "Sharpen up with timed CBT mock exams and past questions. Get instant scores and see exactly which topics to revise.",
    },
    {
        icon: Trophy,
        step: "04",
        title: "Track & climb",
        description: "Earn XP, keep your streak, watch your readiness score rise and climb the leaderboard all the way to exam day.",
    },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 px-6 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        How it works
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Four steps to exam-ready
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Getting started takes minutes. No stuffy lectures — just a clear path from
                        &ldquo;I&apos;m not sure&rdquo; to &ldquo;I&apos;ve got this.&rdquo;
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STEPS.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.step}
                                className="group relative rounded-3xl bg-secondary-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 transition-transform duration-300 hover:-translate-y-1"
                            >
                                <span className="absolute top-5 right-6 text-4xl font-extrabold text-gray-200 dark:text-gray-700">
                                    {s.step}
                                </span>
                                <div className="grid place-items-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-5">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{s.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
