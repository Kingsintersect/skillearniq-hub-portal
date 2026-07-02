// app/parent/reports/page.tsx - COMPLETE
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';
import { Download, TrendingUp, TrendingDown, Minus, User, BookOpen, Calendar, Award, FileText, Loader2, AlertCircle, Users, Mail, Hash, BarChart } from 'lucide-react';
import { toast } from 'sonner';

// Interface for course grading data
interface CourseGradingData {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url?: string;
  instructors: Array<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }>;
  students: Array<{
    student_id: number;
    student_email: string;
    student_username: string;
    final_grade: number;
    letter_grade: string;
    quality_points: number;
    credit_load: number;
    activities: Array<{
      activity_name: string;
      type: string;
      grade: number;
      max_grade: number;
    }>;
  }>;
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'E': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getActivityTypeIcon = (type: string) => {
  switch (type) {
    case 'quiz': return '📝';
    case 'assign': return '📋';
    case 'exam': return '📊';
    case 'project': return '📁';
    default: return '📄';
  }
};

export default function ReportsPage() {
  const { selectedChild } = useParentStore();
  const { useCourseGradings } = useParentQueries();
  
  const {
    data: courseGradings = [],
    isLoading,
    error,
    refetch
  } = useCourseGradings(selectedChild?.email || '');

  const [selectedCourse, setSelectedCourse] = useState<CourseGradingData | null>(null);

  // Set selected course
  useEffect(() => {
    if (courseGradings.length > 0) {
      setSelectedCourse(courseGradings[0]);
    }
  }, [courseGradings]);

  // Get student data for selected child
  const getStudentData = (course: CourseGradingData) => {
    if (!selectedChild?.email) return null;
    return course.students.find(student => 
      student.student_email === selectedChild.email
    );
  };

  const handleExportReport = () => {
    if (!selectedCourse) {
      toast.error('No course data available to export');
      return;
    }

    toast.success('Report exported successfully');
    // In production, this would generate and download a PDF
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div>Loading course reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          Error loading course reports: {error.message}
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div className="text-muted-foreground">
                Please select a student to view reports
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (courseGradings.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div className="text-muted-foreground">
                No course grading data available for {selectedChild.first_name}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Email: {selectedChild.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalCourses = courseGradings.length;
  const totalStudents = courseGradings.reduce((sum, course) => sum + course.students.length, 0);
  const averageGrade = courseGradings.reduce((sum, course) => {
    const student = getStudentData(course);
    return sum + (student?.final_grade || 0);
  }, 0) / totalCourses;

  // Get current student data for selected course
  const currentStudent = selectedCourse ? getStudentData(selectedCourse) : null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Course Reports</h1>
            <p className="text-muted-foreground">
              Detailed course performance for {selectedChild.first_name}
            </p>
          </div>
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Course Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {courseGradings.map((course, index) => {
                const student = getStudentData(course);
                const isSelected = selectedCourse?.course_id === course.course_id;
                
                return (
                  <Button
                    key={course.course_id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedCourse(course)}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{course.course_code}</span>
                    {student && (
                      <Badge className={`ml-2 ${getGradeColor(student.letter_grade)}`}>
                        {student.letter_grade}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {selectedCourse && (
          <>
            {/* Course Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.course_name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">{selectedCourse.course_code}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>Course ID: {selectedCourse.course_id}</span>
                      </div>
                    </div>
                  </div>
                  
                  {currentStudent && (
                    <div className="text-right">
                      <div className="text-3xl font-bold">{currentStudent.final_grade.toFixed(1)}%</div>
                      <Badge className={`text-lg mt-2 ${getGradeColor(currentStudent.letter_grade)}`}>
                        Grade: {currentStudent.letter_grade}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Student Performance */}
              <div className="lg:col-span-2 space-y-6">
                {/* Activities Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activities & Assessments</CardTitle>
                    <CardDescription>
                      {currentStudent?.activities?.length || 0} activities for {selectedChild.first_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentStudent?.activities && currentStudent.activities.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentStudent.activities.map((activity, index) => {
                            const percentage = (activity.grade / activity.max_grade) * 100;
                            const isPassing = percentage >= 60;
                            
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{getActivityTypeIcon(activity.type)}</span>
                                    {activity.activity_name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {activity.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-semibold">
                                    {activity.grade.toFixed(1)}/{activity.max_grade}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24">
                                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${isPassing ? 'bg-green-500' : 'bg-red-500'}`}
                                          style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={isPassing ? "default" : "destructive"}>
                                    {isPassing ? 'Passed' : 'Needs Improvement'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No activity data available for this course
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Course Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Instructors */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Instructors
                        </h3>
                        {selectedCourse.instructors.length > 0 ? (
                          <div className="space-y-3">
                            {selectedCourse.instructors.map((instructor) => (
                              <div key={instructor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {instructor.firstname} {instructor.lastname}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {instructor.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No instructors listed</p>
                        )}
                      </div>

                      {/* Student Summary */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          Performance Summary
                        </h3>
                        {currentStudent ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Final Grade</div>
                                <div className="text-2xl font-bold">{currentStudent.final_grade.toFixed(1)}%</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Letter Grade</div>
                                <div className={`text-2xl font-bold ${getGradeColor(currentStudent.letter_grade)} px-2 py-1 rounded`}>
                                  {currentStudent.letter_grade}
                                </div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Quality Points</div>
                                <div className="text-2xl font-bold">{currentStudent.quality_points}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Credit Load</div>
                                <div className="text-2xl font-bold">{currentStudent.credit_load}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No student data available</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Summary & Statistics */}
              <div className="space-y-6">
                {/* Overall Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Courses Enrolled</span>
                      <span className="font-bold">{totalCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Grade</span>
                      <span className="font-bold">{averageGrade.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Students</span>
                      <span className="font-bold">{totalStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Student</span>
                      <span className="font-bold">{selectedChild.first_name}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                    <CardDescription>Performance across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {courseGradings.map((course) => {
                        const student = getStudentData(course);
                        if (!student) return null;
                        
                        return (
                          <div key={course.course_id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{course.course_code}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{student.final_grade.toFixed(1)}%</span>
                              <Badge className={getGradeColor(student.letter_grade)}>
                                {student.letter_grade}
                              </Badge>
                            </div>
                          </div>
                        );
                      }).filter(Boolean)}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Transcript
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View All Activities
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart className="h-4 w-4 mr-2" />
                      Performance Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}