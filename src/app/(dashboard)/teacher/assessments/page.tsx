'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTeacherQueries } from '@/hooks/useTeacherQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';
import {
  FileText,
  Download,
  Plus,
  Clock,
  Award,
  BarChart3,
  Edit,
  Trash2,
  Sheet,
  Loader2,
  AlertCircle,
  Calendar,
  BookOpen,
  Users,
  Sparkles,
  ShieldAlert,
  FolderOpen,
  FileQuestion,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

import type { Course, Assessment, AssessmentsData } from '@/lib/services/teacherService';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function DashboardCard({ title, subtitle, icon, action, children, className = '' }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {children}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export const AssessmentsPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'upcoming' | 'completed' | 'drafts'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const getCurrentTeacherId = (): number => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || 22;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    return 22;
  };

  const currentTeacherId = getCurrentTeacherId();

  const { useClasses, useAssessments } = useTeacherQueries();
  
  const {
    data: coursesData = [],
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useClasses(currentTeacherId);

  const {
    data: assessmentsData,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments
  } = useAssessments(currentTeacherId, {
    classId: selectedCourseId
  });

  useEffect(() => {
    console.log('Courses data:', coursesData);
    console.log('Number of courses:', coursesData?.length || 0);
  }, [coursesData]);

  useEffect(() => {
    console.log('Assessments data:', assessmentsData);
  }, [assessmentsData]);

  const handleCourseSelect = (courseId: string) => {
    const id = courseId ? parseInt(courseId) : undefined;
    setSelectedCourseId(id);
    
    if (coursesData && id) {
      const selected = coursesData.find((course: Course) => course.id === id);
      setSelectedCourse(selected || null);
    } else {
      setSelectedCourse(null);
    }
  };

  const getCurrentViewData = (): Assessment[] => {
    if (!assessmentsData?.assessments) return [];
    
    const assessments = assessmentsData.assessments;
    switch (view) {
      case 'upcoming': return assessments.upcoming || [];
      case 'completed': return assessments.completed || [];
      case 'drafts': return assessments.drafts || [];
      default: return [];
    }
  };

  const calculateStats = () => {
    if (!assessmentsData?.assessments) {
      return {
        totalAssessments: 0,
        pendingGrading: 0,
        avgScore: 0,
        submissionRate: 0
      };
    }

    const assessments = assessmentsData.assessments;
    const allAssessments = [
      ...(assessments.upcoming || []),
      ...(assessments.completed || []),
      ...(assessments.drafts || [])
    ];

    const totalAssessments = allAssessments.length;
    const pendingGrading = (assessments.upcoming || []).filter((a: Assessment) => 
      a.status === 'scheduled' || a.status === 'in-progress'
    ).length;
    const completedWithScores = (assessments.completed || []).filter((a: Assessment) => a.averageScore);
    const avgScore = completedWithScores.length > 0 
      ? completedWithScores.reduce((sum: number, a: Assessment) => sum + (a.averageScore || 0), 0) / completedWithScores.length
      : 0;
    const totalSubmissions = allAssessments.reduce((sum: number, a: Assessment) => sum + (a.submissions || 0), 0);
    const totalStudents = allAssessments.reduce((sum: number, a: Assessment) => sum + (a.totalStudents || 0), 0);
    const submissionRate = totalStudents > 0 ? (totalSubmissions / totalStudents) * 100 : 0;

    return {
      totalAssessments,
      pendingGrading,
      avgScore: parseFloat(avgScore.toFixed(1)),
      submissionRate: parseFloat(submissionRate.toFixed(1))
    };
  };

  const handleExportToCSV = (assessments: Assessment[]) => {
    if (!assessments.length) {
      toast.error('No assessments to export');
      return;
    }

    const headers = ['ID', 'Title', 'Class', 'Type', 'Due Date', 'Max Score', 'Submissions', 'Total Students', 'Average Score', 'Status'];
    const csvContent = [
      headers.join(','),
      ...assessments.map(assessment => [
        assessment.id,
        `"${assessment.title?.replace(/"/g, '""') || ''}"`,
        `"${assessment.class || ''}"`,
        assessment.type || '',
        `"${assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : ''}"`,
        assessment.maxScore || '',
        assessment.submissions || 0,
        assessment.totalStudents || 0,
        assessment.averageScore || 'N/A',
        assessment.status || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const selectedCourseName = selectedCourse?.shortName || selectedCourse?.name || 'assessments';
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedCourseName}_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${assessments.length} assessments as CSV`);
  };

  const handleExportResults = (assessment: Assessment) => {
    if (!assessment.results || assessment.results.length === 0) {
      toast.error('No results available for this assessment');
      return;
    }

    const headers = ['Student ID', 'Student Name', 'Score', 'Grade', 'Percentage'];
    const csvContent = [
      headers.join(','),
      ...assessment.results.map((result: any) => [
        result.studentId,
        `"${result.studentName}"`,
        result.score,
        result.grade,
        `${((result.score / assessment.maxScore) * 100).toFixed(1)}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${assessment.title?.replace(/[^a-z0-9]/gi, '_') || 'assessment'}_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success(`Exported results for ${assessment.title || 'assessment'}`);
  };

  const handleCreateAssessment = () => {
    toast.success('New assessment created successfully!');
  };

  const currentViewData = getCurrentViewData();
  const stats = calculateStats();

  const filteredData = searchTerm 
    ? currentViewData.filter((assessment: Assessment) =>
        assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.class?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentViewData;

  const getTabCounts = () => {
    if (!assessmentsData?.assessments) {
      return { upcoming: 0, completed: 0, drafts: 0 };
    }
    
    const assessments = assessmentsData.assessments;
    return {
      upcoming: assessments.upcoming?.length || 0,
      completed: assessments.completed?.length || 0,
      drafts: assessments.drafts?.length || 0
    };
  };

  const tabCounts = getTabCounts();

  const totalAssessments = (assessmentsData?.assessments) 
    ? (assessmentsData.assessments.upcoming?.length || 0) + 
      (assessmentsData.assessments.completed?.length || 0) + 
      (assessmentsData.assessments.drafts?.length || 0)
    : 0;

  if (coursesLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Courses</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't load your courses. Please check your connection and try again.
            </p>
            <Button onClick={() => refetchCourses()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Assessment Management</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Assessments</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create and manage student assessments. Track submissions, grade performance, and monitor progress across your courses.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Assessment
              </Button>
            </DialogTrigger>
            <CreateAssessmentDialog 
              onCreate={handleCreateAssessment} 
              classes={coursesData || []} 
              selectedCourseId={selectedCourseId}
            />
          </Dialog>
        </div>
      </motion.section>

      {/* Course Selector */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-1/3">
            <Label htmlFor="course" className="text-sm font-semibold text-foreground">Select Course</Label>
            <Select
              value={selectedCourseId?.toString() || ''}
              onValueChange={handleCourseSelect}
              disabled={coursesLoading || !coursesData || coursesData.length === 0}
            >
              <SelectTrigger className="rounded-xl mt-1.5">
                <SelectValue placeholder={
                  coursesLoading ? "Loading courses..." : 
                  !coursesData || coursesData.length === 0 ? "No courses assigned" : 
                  "Select a course"
                } />
              </SelectTrigger>
              {coursesData && coursesData.length > 0 && (
                <SelectContent>
                  {coursesData.map((course: Course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.shortName || course.code || course.name} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
            
            {(!coursesData || coursesData.length === 0) && !coursesLoading && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">No courses found</p>
                    <p className="text-xs mt-0.5">You may not be assigned to any courses yet.</p>
                  </div>
                </div>
              </div>
            )}
            
            {coursesData && coursesData.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {coursesData.length} course{coursesData.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          {/* Selected Course Info */}
          {selectedCourse && (
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Selected Course</div>
              <div className="font-medium text-foreground">
                {selectedCourse.name} ({selectedCourse.shortName || selectedCourse.code || 'No Code'})
                {selectedCourse.studentCount !== undefined && (
                  <span className="ml-4 text-sm font-normal text-muted-foreground">
                    {selectedCourse.studentCount} student{selectedCourse.studentCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={filteredData.length === 0} className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleExportToCSV(filteredData)}
                  className="flex items-center space-x-2"
                  disabled={filteredData.length === 0}
                >
                  <Sheet className="h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {selectedCourseId && assessmentsData && !assessmentsLoading && !assessmentsError && totalAssessments > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <DashboardCard
            title="Total Assessments"
            subtitle="All assessments"
            icon={<FileText size={18} />}
          >
            <p className="text-2xl font-bold text-foreground">{stats.totalAssessments}</p>
          </DashboardCard>

          <DashboardCard
            title="Pending Grading"
            subtitle="Awaiting review"
            icon={<Clock size={18} />}
          >
            <p className="text-2xl font-bold text-foreground">{stats.pendingGrading}</p>
          </DashboardCard>

          <DashboardCard
            title="Average Score"
            subtitle="Class average"
            icon={<Award size={18} />}
          >
            <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
          </DashboardCard>

          <DashboardCard
            title="Submission Rate"
            subtitle="Overall rate"
            icon={<TrendingUp size={18} />}
          >
            <p className="text-2xl font-bold text-foreground">{stats.submissionRate}%</p>
          </DashboardCard>
        </div>
      )}

      {/* Loading for assessments */}
      {selectedCourseId && assessmentsLoading && (
        <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assessments for {selectedCourse?.name}...</p>
        </div>
      )}

      {/* Error message for assessments */}
      {selectedCourseId && assessmentsError && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mx-auto mb-4">
            <FileQuestion className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Assessment Data</h3>
          <p className="text-muted-foreground mb-4">
            The assessments data is not currently available for this course.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Create New Assessment
                </Button>
              </DialogTrigger>
              <CreateAssessmentDialog 
                onCreate={handleCreateAssessment} 
                classes={coursesData || []} 
                selectedCourseId={selectedCourseId}
              />
            </Dialog>
            <Button variant="outline" onClick={() => refetchAssessments()}>
              <Loader2 className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </div>
        </div>
      )}

      {/* Show when no course is selected */}
      {!selectedCourseId && coursesData && coursesData.length > 0 && (
        <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Select a Course to Begin</h3>
          <p className="text-muted-foreground mb-4">
            Choose a course from the dropdown to view and manage its assessments
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{coursesData.length} course{coursesData.length !== 1 ? 's' : ''} available</span>
          </div>
        </div>
      )}

      {/* Show when course has no assessments */}
      {selectedCourseId && assessmentsData && 
       !assessmentsLoading && 
       !assessmentsError &&
       totalAssessments === 0 && (
        <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mx-auto mb-4">
            <FolderOpen className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Assessments Yet</h3>
          <p className="text-muted-foreground mb-4">
            There are no assessments created for <span className="font-semibold text-foreground">{selectedCourse?.name}</span> yet.
            Create your first assessment to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Create First Assessment
                </Button>
              </DialogTrigger>
              <CreateAssessmentDialog 
                onCreate={handleCreateAssessment} 
                classes={coursesData || []} 
                selectedCourseId={selectedCourseId}
              />
            </Dialog>
            <Button variant="outline" onClick={() => refetchAssessments()}>
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Search and Tabs */}
      {selectedCourseId && assessmentsData && !assessmentsLoading && !assessmentsError && totalAssessments > 0 && (
        <>
          {/* Search */}
          <div className="rounded-3xl border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search assessments by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl pl-4"
                />
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')} className="rounded-xl">
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
            <TabsList className="bg-card/50 border border-border/70">
              <TabsTrigger value="upcoming" className="gap-2">
                <Clock size={14} />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle size={14} />
                Completed ({tabCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="gap-2">
                <FileText size={14} />
                Drafts ({tabCounts.drafts})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <AssessmentsListView
                data={filteredData}
                type="upcoming"
                onExportResults={handleExportResults}
              />
            </TabsContent>

            <TabsContent value="completed">
              <AssessmentsListView
                data={filteredData}
                type="completed"
                onExportResults={handleExportResults}
              />
            </TabsContent>

            <TabsContent value="drafts">
              <AssessmentsListView
                data={filteredData}
                type="drafts"
                onExportResults={handleExportResults}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Assessments List View Component
const AssessmentsListView: React.FC<{
  data: Assessment[];
  type: string;
  onExportResults: (assessment: Assessment) => void;
}> = ({ data, type, onExportResults }) => {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mx-auto mb-4">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {type === 'upcoming' ? 'No Upcoming Assessments' :
            type === 'completed' ? 'No Completed Assessments' : 'No Draft Assessments'}
        </h3>
        <p className="text-muted-foreground">
          {type === 'upcoming' ? 'No assessments are scheduled for this course yet.' :
            type === 'completed' ? 'No assessments have been completed for this course yet.' : 
            'No assessment drafts have been saved for this course yet.'}
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/95 overflow-hidden shadow-sm backdrop-blur-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-foreground font-semibold">Assessment Title</TableHead>
              <TableHead className="text-foreground font-semibold hidden sm:table-cell">Class</TableHead>
              <TableHead className="text-foreground font-semibold">Type</TableHead>
              <TableHead className="text-foreground font-semibold hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-foreground font-semibold">Max Score</TableHead>
              <TableHead className="text-foreground font-semibold hidden lg:table-cell">Submissions</TableHead>
              {type === 'completed' && <TableHead className="text-foreground font-semibold">Avg Score</TableHead>}
              <TableHead className="text-foreground font-semibold hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((assessment: Assessment, index: number) => (
              <motion.tr
                key={assessment.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {assessment.title}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="border-border/50">
                    {assessment.class}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    assessment.type === 'quiz' ? 'secondary' :
                    assessment.type === 'assignment' ? 'default' :
                    assessment.type === 'exam' ? 'destructive' : 'outline'
                  }>
                    {assessment.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(assessment.dueDate)}
                </TableCell>
                <TableCell>{assessment.maxScore}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={assessment.totalStudents > 0 ? (assessment.submissions / assessment.totalStudents) * 100 : 0}
                      className="h-1.5 w-16"
                    />
                    <span className="text-sm text-muted-foreground">{assessment.submissions}/{assessment.totalStudents}</span>
                  </div>
                </TableCell>
                {type === 'completed' && (
                  <TableCell>
                    <Badge variant={assessment.averageScore && assessment.averageScore >= 80 ? 'default' : 'destructive'}>
                      {assessment.averageScore || 'N/A'}%
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={
                    assessment.status === 'scheduled' ? 'secondary' :
                    assessment.status === 'in-progress' ? 'default' :
                    assessment.status === 'completed' ? 'outline' :
                    assessment.status === 'graded' ? 'default' : 'secondary'
                  }>
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {type === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExportResults(assessment)}
                        title="Export Results"
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" title="Edit" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Create Assessment Dialog Component
interface CreateAssessmentDialogProps {
  onCreate: () => void;
  classes: Course[];
  selectedCourseId?: number;
}

const CreateAssessmentDialog: React.FC<CreateAssessmentDialogProps> = ({ onCreate, classes, selectedCourseId }) => {
  const [formData, setFormData] = useState({
    title: '',
    classId: selectedCourseId?.toString() || '',
    type: 'assignment',
    dueDate: '',
    maxScore: '',
    description: ''
  });

  useEffect(() => {
    if (selectedCourseId) {
      setFormData(prev => ({ ...prev, classId: selectedCourseId.toString() }));
    }
  }, [selectedCourseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <DialogContent className="max-w-2xl rounded-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Create New Assessment</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new assessment for your students.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter assessment title"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={formData.classId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls: Course) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.shortName || cls.code} - {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Assessment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxScore">Maximum Score</Label>
          <Input
            id="maxScore"
            type="number"
            value={formData.maxScore}
            onChange={(e) => setFormData(prev => ({ ...prev, maxScore: e.target.value }))}
            placeholder="Enter maximum score"
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter assessment description"
            className="rounded-xl"
            required          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" className="rounded-xl">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl">
            Create Assessment
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AssessmentsPage;