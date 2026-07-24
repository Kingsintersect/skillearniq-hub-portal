'use client';

import { useCourseStore } from '../stores/course-store';
import { useCourseQueries } from '../hooks/use-course-queries';
import { DashboardView } from './dashboard-view';
import { CategoriesView } from './categories-view';
import { SubCategoriesView } from './subcategories-view';
import { CoursesView } from './courses-view';
import { PaymentView } from './payment-view';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

const VIEW_COMPONENTS = {
    dashboard: DashboardView,
    categories: CategoriesView,
    subcategories: SubCategoriesView,
    courses: CoursesView,
    payment: PaymentView,
};

export function CourseDashboard({ userId }: { userId: string }) {
    const { view, isLoading } = useCourseStore();
    const { mergedCategoriesQuery, enrollmentsQuery } = useCourseQueries(userId);

    // Show loading state only when initially loading
    if (mergedCategoriesQuery.isPending || enrollmentsQuery.isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-xl" />
                    <LoadingSpinner size="lg" className="relative text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-muted-foreground font-medium">Loading your courses…</span>
            </div>
        );
    }

    if (mergedCategoriesQuery.error || enrollmentsQuery.error) {
        return (
            <div className="pt-[100px] flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground font-outfit">Couldn't load your courses</h2>
                    <p className="text-muted-foreground text-sm mt-1">Something went wrong while fetching your data.</p>
                </div>
                <button
                    onClick={() => {
                        mergedCategoriesQuery.refetch();
                        enrollmentsQuery.refetch();
                    }}
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-primary-600 text-primary-foreground font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try again
                </button>
            </div>
        );
    }

    const CurrentView = VIEW_COMPONENTS[view];

    return (
        <div className="relative pt-[60px] min-h-screen bg-background text-foreground overflow-hidden">
            {/* Ambient theme glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary-100/60 via-accent-50/30 to-transparent dark:from-primary-900/30 dark:via-accent-950/10 dark:to-transparent" />

            <div className="relative container mx-auto px-4 max-w-6xl py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CurrentView userId={userId} />
                    </motion.div>
                </AnimatePresence>

                {isLoading && (
                    <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex items-center space-x-3">
                            <LoadingSpinner size="lg" className="text-accent-500" />
                            <span className="text-foreground font-medium">Processing…</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

