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
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">Loading courses...</span>
            </div>
        );
    }

    if (mergedCategoriesQuery.error || enrollmentsQuery.error) {
        return (
            <div className="pt-[100px] text-center text-red-600 p-8">
                Error loading course data. Please try again.
                <br />
                <button
                    onClick={() => {
                        mergedCategoriesQuery.refetch();
                        enrollmentsQuery.refetch();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    const CurrentView = VIEW_COMPONENTS[view];

    return (
        <div className="pt-[60px] min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 py-8  dark:text-white">
            <div className="container mx-auto px-4 max-w-6xl">
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
                            <LoadingSpinner size="lg" />
                            <span className="text-gray-700">Processing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
