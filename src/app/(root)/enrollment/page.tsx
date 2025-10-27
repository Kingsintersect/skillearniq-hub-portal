// app/courses/page.tsx
'use client';

import { CourseDashboard } from './components/course-dashboard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RefreshCw, User, Database } from 'lucide-react';
import { useState } from 'react';
import { useCourseStore } from './stores/course-store';

export default function CoursesPage() {
    const [userId, setUserId] = useState('user-123');
    const [showEmptyState, setShowEmptyState] = useState(false);
    const { resetSelection } = useCourseStore();

    const toggleEmptyState = () => {
        setShowEmptyState(!showEmptyState);
        // Store the empty state preference in localStorage for the service to read
        localStorage.setItem('testEmptyState', (!showEmptyState).toString());
        resetSelection();
        // Force reload to show the new state
        setTimeout(() => window.location.reload(), 100);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Demo Controls */}
            {/* <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm border-b border-gray-200"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Demo User</span>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Using Merged API + Mock Data
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={toggleEmptyState}
                                className="text-xs"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                {showEmptyState ? 'Show With Courses' : 'Show Empty State'}
                            </Button>
                            <div className="text-xs text-gray-500">
                                {showEmptyState ? 'Testing: No enrolled courses' : 'Testing: With enrolled courses'}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div> */}

            <CourseDashboard userId={userId} />
        </div>
    );
}
