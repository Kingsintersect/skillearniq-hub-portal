// app/(teacher)/grade-reports/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import TeacherFilterSection from './components/TeacherFilterSection';
import ChartsSection from './components/ChartsSection';
import GradeTable from './components/GradeTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import NoResultsState from './components/NoResultsState';
import { useTeacherGradeStore } from '@/store/teacher-grade-store';

function TeacherDashboardContent() {
  const {
    courseInfo,
    gradeData,
    isLoading,
    error,
    selectedCourse,
    courses,
    fetchCourses
  } = useTeacherGradeStore();

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
          <ChartsSection />
          <GradeTable />
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
          <h1 className="text-3xl font-bold text-foreground">Grade Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze student performance in your assigned courses
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <TeacherFilterSection />
        </Suspense>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default function TeacherGradeReportsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TeacherDashboardContent />
    </Suspense>
  );
}