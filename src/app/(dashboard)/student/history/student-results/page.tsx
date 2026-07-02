// app/(student)/grade-reports/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import StudentFilterSection from './components/StudentFilterSection';
import StudentChartsSection from './components/StudentChartsSection';
import StudentGradeTable from './components/StudentGradeTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import NoResultsState from './components/NoResultsState';
import { useStudentGradeStore } from '@/store/student-grade-store';

function StudentDashboardContent() {
  const {
    courseInfo,
    gradeData,
    isLoading,
    error,
    selectedCourse,
    courses,
    fetchCourses
  } = useStudentGradeStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    if (gradeData.length > 0) {
      return (
        <>
          <StudentChartsSection />
          <StudentGradeTable />
        </>
      );
    }

    if (selectedCourse) {
      return <NoResultsState />;
    }

    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Grade Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and track your performance in enrolled courses
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <StudentFilterSection />
        </Suspense>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default function StudentGradeReportsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudentDashboardContent />
    </Suspense>
  );
}