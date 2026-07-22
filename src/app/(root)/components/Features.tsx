import { BarChart3, BrainCircuit, MonitorPlay, PlayCircle, Trophy, Users } from "lucide-react";

const FEATURES = [
    {
        icon: MonitorPlay,
        title: "Real CBT exam engine",
        description: "Practice, timed and challenge modes that simulate the real thing. Auto-grading, instant analytics and past-question banks for WAEC, JAMB, NECO & more.",
        tint: "bg-primary/10 text-primary",
    },
    {
        icon: BrainCircuit,
        title: "AI study assistant",
        description: "Stuck on a topic? Ask your AI tutor to explain it simply, summarise a lesson, or generate WAEC-style examples — 24/7.",
        tint: "bg-accent/15 text-accent",
    },
    {
        icon: PlayCircle,
        title: "Smart video lessons",
        description: "Bite-sized video lessons with downloadable notes, practice quizzes and offline access — built to work on low-data Android phones.",
        tint: "bg-secondary-200 text-secondary-800",
    },
    {
        icon: Users,
        title: "Live classes with tutors",
        description: "Join expert-led live sessions, ask questions, take part in polls, and rewatch recordings whenever you need them.",
        tint: "bg-primary/10 text-primary",
    },
    {
        icon: Trophy,
        title: "Gamified motivation",
        description: "Earn XP, unlock badges like CBT Warrior and Math Master, keep your daily streak and climb the leaderboard.",
        tint: "bg-accent/15 text-accent",
    },
    {
        icon: BarChart3,
        title: "Performance analytics",
        description: "Track subject mastery, spot weak topics early, and watch your exam-readiness score climb week after week.",
        tint: "bg-secondary-200 text-secondary-800",
    },
];

export const Features = () => {
    return (
        <section id="features" className="py-20 px-6 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        The complete ecosystem
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Everything you need to ace your exams
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Not just another learning portal — an intelligent system that teaches, tests,
                        motivates and keeps you on track until exam day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map(({ icon: Icon, title, description, tint }) => (
                        <div
                            key={title}
                            className="group rounded-3xl bg-secondary-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className={`grid place-items-center h-14 w-14 rounded-2xl mb-5 ${tint}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
