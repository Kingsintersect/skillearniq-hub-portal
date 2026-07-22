import Image from "next/image";
import { Flame, Medal, Star, Users } from "lucide-react";

const TESTIMONIALS = [
    {
        quote: "The CBT practice felt exactly like the real JAMB. By exam day I wasn't nervous at all — I'd already done it a hundred times. Scored 289!",
        name: "Chidinma, JAMB 2024",
        role: "Student",
        avatar: "/girl.png",
        badgeIcon: Medal,
        badge: "CBT Warrior",
    },
    {
        quote: "My daughter used to dread Maths. Now she races to keep her streak alive, and the weekly reports tell me exactly how she's doing.",
        name: "Mrs. Adeyemi",
        role: "Parent",
        avatar: "/avatars/avatar-woman.jpg",
        badgeIcon: Users,
        badge: "Parent account",
    },
    {
        quote: "Whenever I got stuck on Physics, I just asked the AI tutor to explain it simply with WAEC examples. It's like having a lesson teacher 24/7.",
        name: "Emeka, WAEC 2024",
        role: "Student",
        avatar: "/boy.png",
        badgeIcon: Flame,
        badge: "45-day streak",
    },
];

export const Testimonials = () => {
    return (
        <section id="stories" className="py-20 px-6 bg-secondary-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        Loved by learners
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Don&apos;t take our word for it
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Thousands of learners (and their parents) are levelling up every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <figure
                            key={t.name}
                            className="flex flex-col rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm"
                        >
                            <div className="flex gap-0.5 mb-4 text-secondary-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-secondary-400 text-secondary-400" />
                                ))}
                            </div>
                            <blockquote className="text-gray-700 dark:text-gray-200 leading-relaxed flex-1">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <span className="relative h-11 w-11 rounded-full overflow-hidden bg-secondary-100 dark:bg-gray-800 shrink-0">
                                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                </span>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white leading-tight">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                                </div>
                                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                    <t.badgeIcon className="h-3.5 w-3.5 text-accent" />
                                    {t.badge}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};
