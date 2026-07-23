'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CoursesGridView } from './components/courses/CoursesGridView';
import { CoursesTableView } from './components/courses/CoursesTableView';
import { useCategories } from './hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3x3, List, BookOpen, Plus, Search, Filter, Users, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { teacherService } from '@/lib/services/teacherService';

export default function CoursesPage() {
  const { view, setView, courses } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch total students across all courses
  useEffect(() => {
    const fetchTotalStudents = async () => {
      if (courses.length === 0) return;

      setIsLoadingStats(true);
      try {
        let total = 0;
        for (const course of courses) {
          try {
            const response = await teacherService.getStudentsPerCourse(course.id);
            if (response.data && Array.isArray(response.data)) {
              total += response.data.length;
            }
          } catch (error) {
            console.error(`Failed to fetch students for course ${course.id}:`, error);
          }
        }
        setTotalStudents(total);
      } catch (error) {
        console.error('Failed to fetch total students:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchTotalStudents();
  }, [courses]);

  const filteredCourses = courses.filter((course: any) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-blue-500/10 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Course Management</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Assigned Subjects</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse and manage your assigned courses. View course details, track progress, and access teaching materials.
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            Create Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Subjects</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{courses.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Assigned to you</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {isLoadingStats ? '...' : totalStudents}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                <Users size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Enrolled across all courses</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Subjects</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{courses.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Currently running</p>
          </div>
        </div>
      </motion.section>

      {/* Subjects Section */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-card-foreground">Available Subjects</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredCourses.length > 0
                ? `${filteredCourses.length} courses assigned`
                : 'No courses assigned'
              }
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="h-9 w-full rounded-xl border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
              />
            </div>

            <div className="hidden sm:block">
              <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
                <TabsList className="bg-muted/50">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                  >
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="pt-6">
          {view === 'grid' ? (
            <CoursesGridView searchTerm={searchTerm} />
          ) : (
            <CoursesTableView searchTerm={searchTerm} />
          )}
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {view === 'grid' ? (
            <List className="h-5 w-5" />
          ) : (
            <Grid3x3 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}