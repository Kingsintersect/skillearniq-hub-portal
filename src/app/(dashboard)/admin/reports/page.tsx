// app/(admin)/grade-reports/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import FilterSection from './components/FilterSection';
import ChartsSection from './components/ChartsSection';
import GradeTable from './components/GradeTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import NoResultsState from './components/NoResultsState'; // We'll create this
import { useGradeStore } from '@/store/gradeStore';

function DashboardContent() {
  const {
    courseInfo,
    gradeData,
    isLoading,
    error,
    selectedCourse,
    selectedCategory,
    courses,
    fetchCategories
  } = useGradeStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    // When grade data exists
    if (gradeData.length > 0) {
      return (
        <>
          <ChartsSection />
          <GradeTable />
        </>
      );
    }

    // When a course is selected but no grade data - FIXED THIS
    if (selectedCourse) {
      return <NoResultsState />;
    }

    // When category is selected but no course yet
    if (selectedCategory && courses.length === 0) {
      return (
        <EmptyState 
          title="No Courses Available"
          message="There are no courses in this category."
        />
      );
    }

    // When category is selected but no course selected yet
    if (selectedCategory && !selectedCourse) {
      return (
        <EmptyState 
          title="Select a Course"
          message="Please select a course from the dropdown to view grade reports."
        />
      );
    }

    // Default empty state - nothing selected yet
    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Grade Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze student performance across different courses
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <FilterSection />
        </Suspense>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}