'use client'
import React, { useState, useEffect } from 'react';
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
  FileQuestion
} from 'lucide-react';

import type { Course, Assessment, AssessmentsData } from '@/lib/services/teacherService';

export const AssessmentsPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'upcoming' | 'completed' | 'drafts'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current teacher ID from auth
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

  // Use the teacher queries hook
  const { useClasses, useAssessments } = useTeacherQueries();
  
  // Fetch all courses assigned to teacher
  const {
    data: coursesData = [],
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useClasses(currentTeacherId);

  // Fetch assessments for selected course
  const {
    data: assessmentsData,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments
  } = useAssessments(currentTeacherId, {
    classId: selectedCourseId
  });

  // Log data for debugging
  useEffect(() => {
    console.log('Courses data:', coursesData);
    console.log('Number of courses:', coursesData?.length || 0);
  }, [coursesData]);

  useEffect(() => {
    console.log('Assessments data:', assessmentsData);
    if (assessmentsData) {
      console.log('Assessments structure:', assessmentsData);
      console.log('Upcoming count:', assessmentsData.assessments?.upcoming?.length || 0);
      console.log('Completed count:', assessmentsData.assessments?.completed?.length || 0);
      console.log('Drafts count:', assessmentsData.assessments?.drafts?.length || 0);
    }
  }, [assessmentsData]);

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    const id = courseId ? parseInt(courseId) : undefined;
    setSelectedCourseId(id);
    
    // Find and set the selected course details
    if (coursesData && id) {
      const selected = coursesData.find((course: Course) => course.id === id);
      setSelectedCourse(selected || null);
      console.log('Selected course:', selected);
    } else {
      setSelectedCourse(null);
    }
  };

  // Get current view data from assessments
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

  // Calculate stats from assessments data
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

  // Get current data and stats
  const currentViewData = getCurrentViewData();
  const stats = calculateStats();

  // Filter by search term
  const filteredData = searchTerm 
    ? currentViewData.filter((assessment: Assessment) =>
        assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.class?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentViewData;

  // Get counts for each tab
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

  // Calculate total assessments for display
  const totalAssessments = (assessmentsData?.assessments) 
    ? (assessmentsData.assessments.upcoming?.length || 0) + 
      (assessmentsData.assessments.completed?.length || 0) + 
      (assessmentsData.assessments.drafts?.length || 0)
    : 0;

  if (coursesLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Courses</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't load your courses. Please check your connection and try again.
          </p>
          <Button onClick={() => refetchCourses()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Assessments</h1>
          <p className="text-muted-foreground text-lg">Create and manage student assessments</p>
        </div>

        {/* Course Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="w-full lg:w-1/3">
                <Label htmlFor="course">Select Course</Label>
                <Select
                  value={selectedCourseId?.toString() || ''}
                  onValueChange={handleCourseSelect}
                  disabled={coursesLoading || !coursesData || coursesData.length === 0}
                >
                  <SelectTrigger>
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
                
                {/* Show messages about courses */}
                {(!coursesData || coursesData.length === 0) && !coursesLoading && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 font-medium">
                      No courses found. You may not be assigned to any courses yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check with your administrator or try refreshing the page.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => refetchCourses()}
                    >
                      <Loader2 className="h-3 w-3 mr-2" />
                      Refresh Courses
                    </Button>
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
                  <div className="text-sm text-muted-foreground">Selected Course</div>
                  <div className="font-medium">
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
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedCourseId}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Assessment
                    </Button>
                  </DialogTrigger>
                  <CreateAssessmentDialog 
                    onCreate={handleCreateAssessment} 
                    classes={coursesData || []} 
                    selectedCourseId={selectedCourseId}
                  />
                </Dialog> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={filteredData.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
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
          </CardContent>
        </Card>

        {/* Show loading for assessments */}
        {selectedCourseId && assessmentsLoading && (
          <Card className="mb-6">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading assessments for {selectedCourse?.name}...</p>
            </CardContent>
          </Card>
        )}

        {/* USER-FRIENDLY ERROR MESSAGE for assessments */}
        {selectedCourseId && assessmentsError && (
          <Card className="mb-6">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Assessment Data</h3>
              <p className="text-muted-foreground mb-4">
                The assessments data is not currently available for this course.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Assessment
                    </Button>
                  </DialogTrigger>
                  <CreateAssessmentDialog 
                    onCreate={handleCreateAssessment} 
                    classes={coursesData || []} 
                    selectedCourseId={selectedCourseId}
                  />
                </Dialog> */}
                <Button variant="outline" onClick={() => refetchAssessments()}>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show stats and assessments only when a course is selected AND has assessments */}
        {selectedCourseId && assessmentsData && !assessmentsLoading && !assessmentsError && totalAssessments > 0 && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalAssessments}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Grading</p>
                      <p className="text-2xl font-bold text-foreground">{stats.pendingGrading}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                      <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Submission Rate</p>
                      <p className="text-2xl font-bold text-foreground">{stats.submissionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search assessments by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">
                  Upcoming ({tabCounts.upcoming})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({tabCounts.completed})
                </TabsTrigger>
                <TabsTrigger value="drafts">
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

        {/* Show message when no course is selected */}
        {!selectedCourseId && coursesData && coursesData.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
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
            </CardContent>
          </Card>
        )}

        {/* USER-FRIENDLY MESSAGE: Show when course has no assessments or feature not available */}
        {selectedCourseId && assessmentsData && 
         !assessmentsLoading && 
         !assessmentsError &&
         totalAssessments === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Assessments Yet</h3>
              
              <div className="max-w-md mx-auto mb-6">
                <p className="text-muted-foreground mb-4">
                  There are no assessments created for <span className="font-semibold text-foreground">{selectedCourse?.name}</span> yet.
                  You can create your first assessment to get started.
                </p>
                
                {selectedCourse && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.studentCount} students enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.term} Term • {selectedCourse.academicYear}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
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
                  Refresh Assessments
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help getting started? Check out our <a href="#" className="text-primary hover:underline font-medium">assessment creation guide</a>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
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
        </CardContent>
      </Card>
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assessment Title</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Max Score</TableHead>
            <TableHead>Submissions</TableHead>
            {type === 'completed' && <TableHead>Average Score</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">{assessment.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{assessment.class}</Badge>
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
              <TableCell>
                {formatDate(assessment.dueDate)}
              </TableCell>
              <TableCell>{assessment.maxScore}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Progress
                    value={assessment.totalStudents > 0 ? (assessment.submissions / assessment.totalStudents) * 100 : 0}
                    className="h-2 w-16"
                  />
                  <span className="text-sm">{assessment.submissions}/{assessment.totalStudents}</span>
                </div>
              </TableCell>
              {type === 'completed' && (
                <TableCell>
                  <Badge variant={assessment.averageScore && assessment.averageScore >= 80 ? 'default' : 'destructive'}>
                    {assessment.averageScore || 'N/A'}%
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <Badge variant={
                  assessment.status === 'scheduled' ? 'secondary' :
                  assessment.status === 'in-progress' ? 'default' :
                  assessment.status === 'completed' ? 'outline' :
                  assessment.status === 'graded' ? 'default' : 'secondary'
                }>
                  {assessment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {type === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onExportResults(assessment)}
                      title="Export Results"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
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

  // Update classId when selectedCourseId changes
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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Assessment</DialogTitle>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={formData.classId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}
            >
              <SelectTrigger>
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
              <SelectTrigger>
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
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Create Assessment
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AssessmentsPage;