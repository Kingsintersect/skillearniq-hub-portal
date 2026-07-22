import { BookOpenCheck, ClipboardCheck, GraduationCap, PenLine, ScrollText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Exam = { abbr: string; full: string; icon: LucideIcon };

const EXAMS: Exam[] = [
    { abbr: "WAEC", full: "West African Exams Council", icon: GraduationCap },
    { abbr: "JAMB", full: "Joint Admissions & Matriculation Board", icon: ClipboardCheck },
    { abbr: "NECO", full: "National Examinations Council", icon: ScrollText },
    { abbr: "GCE", full: "General Certificate of Education", icon: BookOpenCheck },
    { abbr: "BECE", full: "Basic Education Certificate Exam", icon: PenLine },
];

// Repeat the small set so one marquee half is wider than the viewport, then the
// two halves loop seamlessly.
const HALF = [...EXAMS, ...EXAMS, ...EXAMS, ...EXAMS];

const ExamCard = ({ exam }: { exam: Exam }) => {
    const Icon = exam.icon;
    return (
        <div className="mx-2 inline-flex shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
                <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                    {exam.abbr}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {exam.full}
                </span>
            </span>
        </div>
    );
};

export const ExamStrip = () => {
    return (
        <section className="bg-white dark:bg-gray-950 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                    Exam-focused
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                    Built for Nigeria&apos;s biggest exams
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Full syllabus coverage, real past questions and CBT practice for every one.
                </p>
            </div>

            {/* Marquee: two identical halves; the track scrolls -50% and loops seamlessly.
                Fades at both edges, and pauses when hovered. */}
            <div className="group relative w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                    {[...HALF, ...HALF].map((exam, i) => (
                        <ExamCard key={`${exam.abbr}-${i}`} exam={exam} />
                    ))}
                </div>
            </div>
        </section>
    );
};
