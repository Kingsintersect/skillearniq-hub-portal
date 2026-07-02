// app/parent/classes/page.tsx - COMPLETE
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';
import { Loader2, AlertCircle, Book, FileText, BarChart, Users, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClassesPage() {
  const [filters, setFilters] = useState({
    course: 'all',
  });
  
  const { selectedChild } = useParentStore();
  const { useChildAcademicData } = useParentQueries();
  
  const {
    data: academicDataList = [],
    isLoading,
    error,
    refetch
  } = useChildAcademicData(selectedChild?.id);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Set selected report
  useEffect(() => {
    if (academicDataList.length > 0) {
      const report = selectedChild 
        ? academicDataList.find(r => r.id.toString() === selectedChild.id.toString())
        : academicDataList[0];
      setSelectedReport(report);
    }
  }, [academicDataList, selectedChild]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading academic data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Please select a student first from the dashboard</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedReport || !selectedReport.courses || selectedReport.courses.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>{selectedChild.first_name} {selectedChild.last_name}</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No Course Data Available</h3>
              <p className="text-muted-foreground">
                {selectedReport?.moodle?.found === false 
                  ? 'Moodle integration not available'
                  : 'No courses enrolled'
                }
              </p>
              {selectedReport?.moodle && (
                <div className="mt-4">
                  <Badge variant={selectedReport.moodle.found ? "default" : "secondary"}>
                    Moodle: {selectedReport.moodle.found ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCourses = selectedReport.courses.length;
  const coursesWithGrades = selectedReport.courses.filter((c: any) => c.finalgrade !== null).length;
  const averageGrade = selectedReport.courses.reduce((sum: number, course: any) => 
    sum + (course.finalgrade || 0), 0
  ) / totalCourses;

  // Helper function to get grade color
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    if (grade >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to get grade letter
  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Academic Progress</h1>
          <p className="text-muted-foreground">
            Viewing courses and performance for {selectedChild.first_name} {selectedChild.last_name}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{totalCourses}</p>
                </div>
                <Book className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <p className="text-2xl font-bold">{Math.round(averageGrade)}%</p>
                  <div className="mt-2">
                    <Badge className={getGradeColor(averageGrade)}>
                      {getGradeLetter(averageGrade)}
                    </Badge>
                  </div>
                </div>
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Graded Courses</p>
                  <p className="text-2xl font-bold">{coursesWithGrades}/{totalCourses}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

       

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>
              {totalCourses} enrolled course{totalCourses !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Final Grade</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Activities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedReport.courses.map((course: any, index: number) => {
                  const grade = course.finalgrade || 0;
                  const gradeLetter = getGradeLetter(grade);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Book className="h-4 w-4 mr-2 text-gray-500" />
                          {course.course_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {course.course_code || 'N/A'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={grade} className="h-2 w-20 mr-3" />
                          <span className="font-semibold">{grade}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(grade)}>
                          {gradeLetter}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.activities?.length || 0} activities
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed View */}
        <Tabs defaultValue="courses" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>Detailed information about each course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedReport.courses.map((course: any, index: number) => {
                    const grade = course.finalgrade || 0;
                    
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{course.course_name}</h4>
                              <p className="text-sm text-muted-foreground">{course.course_code || 'No code'}</p>
                            </div>
                            <Badge className={getGradeColor(grade)}>
                              {grade}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Teacher:</span>
                              <span>{course.teacher || 'Not assigned'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Attendance:</span>
                              <span>{course.attendance || 0}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Assignments:</span>
                              <span>{course.assignments?.length || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Activities:</span>
                              <span>{course.activities?.length || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Grades and progress across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedReport.courses.map((course: any, index: number) => {
                    const grade = course.finalgrade || 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{course.course_name}</span>
                          <Badge className={getGradeColor(grade)}>
                            {grade}% ({getGradeLetter(grade)})
                          </Badge>
                        </div>
                        <Progress value={grade} className="h-2" />
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-muted-foreground">Test Scores</div>
                            <div className="font-semibold">
                              {course.testScores?.reduce((a: number, b: number) => a + b, 0) || 0}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground">Quiz Scores</div>
                            <div className="font-semibold">
                              {course.quizScores?.reduce((a: number, b: number) => a + b, 0) || 0}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground">Exam Score</div>
                            <div className="font-semibold">{course.examScore || 0}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Course Activities</CardTitle>
                <CardDescription>Activities and assignments for each course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedReport.courses.map((course: any, courseIndex: number) => (
                    <div key={courseIndex} className="space-y-3">
                      <h4 className="font-semibold text-lg">{course.course_name}</h4>
                      
                      {/* Assignments */}
                      {course.assignments && course.assignments.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm text-muted-foreground">Assignments</h5>
                          {course.assignments.map((assignment: any, assignmentIndex: number) => (
                            <div key={assignmentIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{assignment.title}</div>
                                <div className="text-sm text-muted-foreground">Due: {assignment.dueDate}</div>
                              </div>
                              <div className="text-right">
                                <Badge variant={assignment.status === 'submitted' ? 'default' : 'secondary'}>
                                  {assignment.status}
                                </Badge>
                                {assignment.score && (
                                  <div className="text-sm font-semibold">{assignment.score}%</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Moodle Activities */}
                      {course.activities && course.activities.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm text-muted-foreground">Moodle Activities</h5>
                          {course.activities.map((activity: any, activityIndex: number) => (
                            <div key={activityIndex} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                              <div>
                                <div className="font-medium">{activity.activity_name}</div>
                                <div className="text-sm text-muted-foreground">{activity.activity_type}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {activity.grade || 0}/{activity.max_grade || 100}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}