'use client';

import { CourseDashboard } from './components/course-dashboard';
import { useAuthContext } from '@/providers/AuthProvider';

export default function CoursesPage() {
    const { user } = useAuthContext();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
            <CourseDashboard userId={String(user?.id)} />
        </div>
    );
}
