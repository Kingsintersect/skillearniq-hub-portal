'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import TeacherFilterSection from './components/TeacherFilterSection';
import ChartsSection from './components/ChartsSection';
import GradeTable from './components/GradeTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import NoResultsState from './components/NoResultsState';
import { useTeacherGradeStore } from '@/store/teacher-grade-store';
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react';

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TeacherDashboardContent() {
  const {
    courseInfo,
    gradeData,
    isLoading,
    error,
    selectedCourse,
    courses,
    fetchCourses,
  } = useTeacherGradeStore();

  // Use refs to track if data has been loaded
  const hasFetchedCourses = useRef(false);
  const hasLoadedGrades = useRef(false);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    // Only fetch courses once
    if (!hasFetchedCourses.current && !isLoading) {
      hasFetchedCourses.current = true;
      fetchCourses();
    }
  }, [fetchCourses, isLoading]);

  // Show toast for grades only when they change and we haven't shown it yet
  useEffect(() => {
    if (gradeData.length > 0 && !toastShown && !hasLoadedGrades.current) {
      hasLoadedGrades.current = true;
      setToastShown(true);
    }
  }, [gradeData, toastShown]);

  // Reset grade loaded flag when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      hasLoadedGrades.current = false;
      setToastShown(false);
    }
  }, [selectedCourse]);

  const renderContent = () => {
    if (isLoading && gradeData.length === 0) {
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

  const totalStudents = gradeData.length;
  const averageScore = totalStudents > 0 
    ? Math.round(gradeData.reduce((sum, s) => sum + s.total, 0) / totalStudents) 
    : 0;
  const passingCount = gradeData.filter(s => s.grade !== 'F').length;
  const passingRate = totalStudents > 0 ? Math.round((passingCount / totalStudents) * 100) : 0;

  const showStats = gradeData.length > 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-purple-500/10 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Grade Management</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Grade Reports</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              View and analyze student performance across your assigned courses. Track grades, identify trends, and monitor student progress.
            </p>
          </div>
        </div>

        {/* Stats Cards - Only show when grade data is available */}
        {showStats && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{totalStudents}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Enrolled in course</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{averageScore}%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <TrendingUp size={18} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Class average</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Passing Rate</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{passingRate}%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Award size={18} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{passingCount} students passed</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Course Code</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{courseInfo?.course_code || 'N/A'}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                  <BarChart3 size={18} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{courseInfo?.course_name || 'No course selected'}</p>
            </div>
          </div>
        )}
      </motion.section>

      {/* Filter Section */}
      <Suspense fallback={<LoadingState />}>
        <TeacherFilterSection />
      </Suspense>
      
      {/* Content */}
      {renderContent()}
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