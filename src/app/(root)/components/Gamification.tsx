import { Flame, Medal, Trophy, Zap } from "lucide-react";

const PERKS = [
    { icon: Zap, title: "Earn XP for everything", desc: "Every lesson, quiz and CBT attempt adds points and moves your readiness score up." },
    { icon: Flame, title: "Keep your streak alive", desc: "Study a little each day and build the consistency that actually passes exams." },
    { icon: Medal, title: "Collect achievement badges", desc: "Unlock badges like CBT Warrior, Math Master and the 30-Day Consistency badge." },
];

const LEADERBOARD = [
    { rank: 1, name: "Amara O.", xp: "4,980", initials: "AO", me: false },
    { rank: 2, name: "You", xp: "4,610", initials: "You", me: true },
    { rank: 3, name: "Diego R.", xp: "4,205", initials: "DR", me: false },
    { rank: 4, name: "Mei L.", xp: "3,870", initials: "ML", me: false },
];

const rankStyle = (rank: number) =>
    rank === 1
        ? "bg-secondary-400 text-secondary-950"
        : rank === 2
            ? "bg-gray-300 text-gray-800"
            : rank === 3
                ? "bg-accent-300 text-accent-950"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300";

export const Gamification = () => {
    return (
        <section id="rewards" className="py-20 px-6 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                {/* Copy + perks */}
                <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        Rewards & progress
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Learning that feels like winning
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        We turned progress into a game you'll actually want to play. Points, streaks,
                        badges and leaderboards keep motivation high — so learning sticks.
                    </p>

                    <ul className="space-y-4">
                        {PERKS.map((p) => {
                            const Icon = p.icon;
                            return (
                                <li key={p.title} className="flex items-start gap-4">
                                    <span className="grid place-items-center h-11 w-11 shrink-0 rounded-2xl bg-primary/10 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{p.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{p.desc}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Leaderboard card */}
                <div className="rounded-3xl bg-secondary-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-accent" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Weekly leaderboard</h3>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                            <Flame className="h-4 w-4" /> Resets in 3d
                        </span>
                    </div>

                    <ul className="space-y-3">
                        {LEADERBOARD.map((row) => (
                            <li
                                key={row.rank}
                                className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${row.me
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-white dark:bg-gray-900"
                                    }`}
                            >
                                <span className={`grid place-items-center h-8 w-8 rounded-full text-sm font-bold ${rankStyle(row.rank)}`}>
                                    {row.rank}
                                </span>
                                <span className={`grid place-items-center h-9 w-9 rounded-full text-xs font-bold ${row.me ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                                    {row.initials}
                                </span>
                                <span className={`flex-1 font-semibold ${row.me ? "text-white" : "text-gray-900 dark:text-white"}`}>
                                    {row.name}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-sm font-bold ${row.me ? "text-white" : "text-accent"}`}>
                                    <Medal className="h-4 w-4" /> {row.xp} XP
                                </span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        You&apos;re <span className="font-bold text-gray-900 dark:text-white">370 XP</span> away from 1st place — keep going.
                    </p>
                </div>
            </div>
        </section>
    );
};
