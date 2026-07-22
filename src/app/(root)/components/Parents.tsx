import Link from "next/link";
import { ArrowRight, BellRing, CalendarCheck, FileBarChart, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/config";

const PARENT_PERKS = [
    { icon: FileBarChart, title: "Weekly progress reports", desc: "See exactly how your child is doing — subjects, scores and study time." },
    { icon: BellRing, title: "Weak-subject alerts", desc: "Get notified early when a topic needs attention, via SMS, WhatsApp or email." },
    { icon: CalendarCheck, title: "Attendance & consistency", desc: "Track live-class attendance and daily study streaks at a glance." },
    { icon: ShieldCheck, title: "Exam-readiness score", desc: "A simple, honest measure of how prepared your child is for the real exam." },
];

export const Parents = () => {
    return (
        <section id="parents" className="py-20 px-6 bg-primary">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                    <span className="text-sm font-semibold uppercase tracking-wider text-secondary-300 mb-3 block">
                        For parents
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Know your child is progressing — confidently and safely
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-xl">
                        SkillearnIQ keeps you in the loop without the guesswork. Real reports, real
                        alerts, real readiness — so you always know where your child stands.
                    </p>
                    <Link
                        href={ROUTES.register ?? "/auth/signin"}
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-accent-foreground font-semibold px-7 py-3.5 rounded-full text-lg transition-colors"
                    >
                        Create a parent account
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {PARENT_PERKS.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6"
                        >
                            <span className="grid place-items-center h-11 w-11 rounded-xl bg-white/15 text-white mb-4">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="font-bold text-white mb-1">{title}</h3>
                            <p className="text-sm text-white/75 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
