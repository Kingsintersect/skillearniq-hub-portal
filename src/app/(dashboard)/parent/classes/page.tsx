'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParentStore } from '@/store/parentStore';
import { useChildAcademicData } from '../hooks/useChildAcademicData';

export default function ClassesPage() {
  const [filters, setFilters] = useState({
    paidPrograms: 'all',
    course: 'all',
    teacher: 'all'
  });
  const { selectedChild } = useParentStore();
  const {
    // allReports,
    selectedReport,
    isReportsLoading: isLoading,
  } = useChildAcademicData();
  const academicData = selectedReport;

  const paidPrograms = ['Sciences', 'Art Studies'];
  const courses = ['Mathematics', 'English', 'Science', 'Social Studies'];
  const teachers = ['Mr. Smith', 'Mrs. Johnson', 'Mr. Brown', 'Mrs. Davis', 'Mr. Wilson', 'Mrs. Parker'];

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading academic data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Classes & Academic Progress</h1>
          <p className="text-muted-foreground">
            Detailed view of academic progress, scores, attendance, and assignments
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="col-span-full lg:col-span-2">
                <label className="text-sm font-medium">Student</label>
                <h1 className="text-3xl font-bold">{selectedChild?.first_name}</h1>
              </div>
              <div>
                <label className="text-sm font-medium">Paid Programs</label>
                <Select
                  value={filters.paidPrograms}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, paidPrograms: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Paid Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Paid Programs</SelectItem>
                    {paidPrograms.map(program => (
                      <SelectItem key={program} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Courses</label>
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
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="courses">Courses & Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Test scores, quiz results, and exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div key={academicData?.id} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{academicData?.name} - {academicData?.class}</h3>
                    <Badge variant="secondary">Class Teacher: {academicData?.classTeacher}</Badge>
                  </div>

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
                      {selectedReport?.courses.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{course.course_name}</TableCell>
                          <TableCell>{course.teacher}</TableCell>
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
                </div>
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
                <div key={selectedReport?.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">{selectedReport?.name} - {selectedReport?.class}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReport?.courses.map((course, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{course.course_name}</span>
                            <Badge>{course.attendance}%</Badge>
                          </div>
                          <Progress value={course.attendance} className="h-2" />
                          <div className="text-sm text-muted-foreground mt-2">
                            Teacher: {course.teacher}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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
                <div key={selectedReport?.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">{selectedReport?.name} - {selectedReport?.class}</h3>
                  <div className="space-y-3">
                    {selectedReport?.courses.flatMap((course, subjectIndex) =>
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
                </div>
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
                <div key={selectedReport?.id} className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{selectedReport?.name} - {selectedReport?.class}</h3>
                    <div className="text-right">
                      <div className="font-medium">Class Teacher: {selectedReport?.classTeacher}</div>
                      {/* <div className="text-sm text-muted-foreground">Groups: {selectedReport?.groups.join(', ')}</div> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedReport?.courses.map((course, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="font-medium text-lg mb-2">{course.course_name}</div>
                          <div className="text-sm text-muted-foreground mb-3">Teacher: {course.teacher}</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Attendance:</span>
                              <span className="font-medium">{course.attendance}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Best Test Score:</span>
                              <span className="font-medium">{Math.max(...course.testScores)}/30</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}