'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParentStore } from '@/store/parentStore';
//@ts-ignore
import { useChildAcademicDataCombined } from '@/hooks/useParentQueries';

export default function ClassesPage() {
  const [filters, setFilters] = useState({
    paidPrograms: 'all',
    course: 'all',
    teacher: 'all'
  });
  
  const { selectedChild } = useParentStore();
  const {
    academicData,
    isReportsLoading: isLoading,
    reportsError
  } = useChildAcademicDataCombined();

  const selectedReport = useParentStore(state => state.selectedReport);

  // Extract courses from the selected report for filters
  const courses = selectedReport?.courses?.map(course => course.course_name) || [];
  const teachers = selectedReport?.courses?.map(course => course.teacher).filter(Boolean) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading academic data...</div>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="min-h-screen p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Academic Data</h3>
            <p className="text-muted-foreground mb-4">
              {reportsError}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0V10a3 3 0 10-6 0v2.803" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
            <p className="text-muted-foreground mb-4">
              Please select a student from the dashboard to view academic progress
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Classes & Academic Progress</h1>
          <p className="text-muted-foreground">
            Detailed view of academic progress, scores, attendance, and assignments for {selectedChild.first_name}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="col-span-full lg:col-span-2">
                <label className="text-sm font-medium">Student</label>
                <h1 className="text-3xl font-bold">{selectedChild.first_name} {selectedChild.last_name}</h1>
                {/* @ts-ignore */}
                <p className="text-sm text-muted-foreground">{selectedChild.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Course</label>
                <Select
                  value={filters.course}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, course: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {teachers.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Teacher</label>
                  <Select
                    value={filters.teacher}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, teacher: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Teacher"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Test scores, quiz results, and exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div key={selectedReport.id} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{selectedReport.name}</h3>
                      {selectedReport.class && (
                        <Badge variant="secondary">Class: {selectedReport.class}</Badge>
                      )}
                    </div>

                    {selectedReport.courses.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Tests (30%)</TableHead>
                            <TableHead>Quizzes (10%)</TableHead>
                            <TableHead>Exam (60%)</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Average</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReport.courses.map((course, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{course.course_name}</TableCell>
                              <TableCell>{course.teacher || 'Not assigned'}</TableCell>
                              <TableCell>{Math.max(...course.testScores)}/30</TableCell>
                              <TableCell>{Math.max(...course.quizScores)}/10</TableCell>
                              <TableCell>{course.examScore}/60</TableCell>
                              <TableCell className="font-semibold">
                                {Math.max(...course.testScores) + Math.max(...course.quizScores) + course.examScore}/100
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  {((Math.max(...course.testScores) + Math.max(...course.quizScores) + course.examScore) / 100 * 100).toFixed(1)}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No course data available for {selectedReport.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No academic data available for {selectedChild.first_name}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>Class attendance and participation</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div key={selectedReport.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedReport.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedReport.courses.map((course, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{course.course_name}</span>
                              <Badge>{course.attendance}%</Badge>
                            </div>
                            <Progress value={course.attendance} className="h-2" />
                            <div className="text-sm text-muted-foreground mt-2">
                              Teacher: {course.teacher || 'Not assigned'}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance data available for {selectedChild.first_name}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignments History</CardTitle>
                <CardDescription>Homework, projects, and submitted work</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div key={selectedReport.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedReport.name}</h3>
                    {selectedReport.courses.length > 0 ? (
                      <div className="space-y-3">
                        {selectedReport.courses.flatMap((course, subjectIndex) =>
                          course.assignments.map((assignment, assignmentIndex) => (
                            <Card key={`${subjectIndex}-${assignmentIndex}`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{assignment.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {course.course_name} • Due: {assignment.dueDate}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant={assignment.status === 'submitted' ? 'default' : 'secondary'}>
                                      {assignment.status}
                                    </Badge>
                                    {assignment.score && (
                                      <div className="text-sm font-medium">Score: {assignment.score}</div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No assignments available for {selectedReport.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No assignment data available for {selectedChild.first_name}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Courses & Teachers</CardTitle>
                <CardDescription>Classes, groups, and teaching staff</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div key={selectedReport.id} className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{selectedReport.name}</h3>
                      {selectedReport.classTeacher && (
                        <div className="text-right">
                          <div className="font-medium">Class Teacher: {selectedReport.classTeacher}</div>
                        </div>
                      )}
                    </div>

                    {selectedReport.courses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedReport.courses.map((course, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="font-medium text-lg mb-2">{course.course_name}</div>
                              <div className="text-sm text-muted-foreground mb-3">
                                Teacher: {course.teacher || 'Not assigned'}
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Attendance:</span>
                                  <span className="font-medium">{course.attendance}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Best Test Score:</span>
                                  <span className="font-medium">{Math.max(...course.testScores)}/30</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Assignments:</span>
                                  <span className="font-medium">{course.assignments.length}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No courses enrolled for {selectedReport.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No course data available for {selectedChild.first_name}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}