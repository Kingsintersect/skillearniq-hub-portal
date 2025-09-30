
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClassesPage() {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026',
    term: '1st',
    child: 'all',
    class: 'all',
    subject: 'all',
    teacher: 'all',
    group: 'all'
  });

  const children = [
    {
      id: 1,
      name: 'Alex Johnson',
      class: 'JSS 2A',
      classTeacher: 'Mr. Smith',
      groups: ['Science Club', 'Math Olympiad'],
      attendance: 95,
      subjects: [
        {
          name: 'Mathematics',
          teacher: 'Mr. Smith',
          testScores: [28, 26, 29],
          quizScores: [9, 8, 9],
          examScore: 55,
          assignments: [
            { title: 'Algebra Homework', dueDate: '2025-02-01', status: 'submitted', score: 95 },
            { title: 'Geometry Project', dueDate: '2025-02-15', status: 'pending' }
          ],
          attendance: 96
        },
        {
          name: 'English',
          teacher: 'Mrs. Johnson',
          testScores: [26, 25, 27],
          quizScores: [8, 8, 9],
          examScore: 54,
          assignments: [
            { title: 'Essay Writing', dueDate: '2025-02-03', status: 'submitted', score: 88 }
          ],
          attendance: 94
        }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      class: 'JSS 1B',
      classTeacher: 'Mrs. Davis',
      groups: ['Art Club', 'Debate Society'],
      attendance: 92,
      subjects: [
        {
          name: 'Mathematics',
          teacher: 'Mr. Brown',
          testScores: [24, 23, 25],
          quizScores: [7, 7, 8],
          examScore: 48,
          assignments: [
            { title: 'Basic Algebra', dueDate: '2025-02-05', status: 'submitted', score: 82 }
          ],
          attendance: 91
        }
      ]
    }
  ];

  const academicYears = ['2024-2025', '2025-2026'];
  const terms = ['1st', '2nd', '3rd'];
  const classes = ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B'];
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies'];
  const teachers = ['Mr. Smith', 'Mrs. Johnson', 'Mr. Brown', 'Mrs. Davis'];
  const groups = ['Science Club', 'Math Olympiad', 'Art Club', 'Debate Society'];

  const filteredChildren = children.filter(child => {
    if (filters.child !== 'all' && child.id.toString() !== filters.child) return false;
    if (filters.class !== 'all' && child.class !== filters.class) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Classes & Academic Progress</h1>
          <p className="text-muted-foreground">Detailed view of your children's classes, scores, attendance, and assignments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={filters.academicYear} onValueChange={(value) => setFilters(prev => ({...prev, academicYear: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Term</label>
                <Select value={filters.term} onValueChange={(value) => setFilters(prev => ({...prev, term: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map(term => (
                      <SelectItem key={term} value={term}>{term} Term</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Child</label>
                <Select value={filters.child} onValueChange={(value) => setFilters(prev => ({...prev, child: value}))}>
                  <SelectTrigger>
                    <SelectValue>Select Child</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Children</SelectItem>
                    {children.map(child => (
                      <SelectItem key={child.id} value={child.id.toString()}>{child.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Class</label>
                <Select value={filters.class} onValueChange={(value) => setFilters(prev => ({...prev, class: value}))}>
                  <SelectTrigger>
                    <SelectValue>Select Class</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select value={filters.subject} onValueChange={(value) => setFilters(prev => ({...prev, subject: value}))}>
                  <SelectTrigger>
                    <SelectValue>Select Subject</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Teacher</label>
                <Select value={filters.teacher} onValueChange={(value) => setFilters(prev => ({...prev, teacher: value}))}>
                  <SelectTrigger>
                    <SelectValue>Select Teacher</SelectValue>
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
            <TabsTrigger value="subjects">Subjects & Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Test scores, quiz results, and exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredChildren.map(child => (
                  <div key={child.id} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{child.name} - {child.class}</h3>
                      <Badge variant="secondary">Class Teacher: {child.classTeacher}</Badge>
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
                        {child.subjects.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>{subject.teacher}</TableCell>
                            <TableCell>{Math.max(...subject.testScores)}/30</TableCell>
                            <TableCell>{Math.max(...subject.quizScores)}/10</TableCell>
                            <TableCell>{subject.examScore}/60</TableCell>
                            <TableCell className="font-semibold">
                              {Math.max(...subject.testScores) + Math.max(...subject.quizScores) + subject.examScore}/100
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {((Math.max(...subject.testScores) + Math.max(...subject.quizScores) + subject.examScore) / 100 * 100).toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
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
                {filteredChildren.map(child => (
                  <div key={child.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{child.name} - {child.class}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.subjects.map((subject, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{subject.name}</span>
                              <Badge>{subject.attendance}%</Badge>
                            </div>
                            <Progress value={subject.attendance} className="h-2" />
                            <div className="text-sm text-muted-foreground mt-2">
                              Teacher: {subject.teacher}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
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
                {filteredChildren.map(child => (
                  <div key={child.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{child.name} - {child.class}</h3>
                    <div className="space-y-3">
                      {child.subjects.flatMap((subject, subjectIndex) =>
                        subject.assignments.map((assignment, assignmentIndex) => (
                          <Card key={`${subjectIndex}-${assignmentIndex}`}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{assignment.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {subject.name} • Due: {assignment.dueDate}
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
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subjects & Teachers</CardTitle>
                <CardDescription>Classes, groups, and teaching staff</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredChildren.map(child => (
                  <div key={child.id} className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{child.name} - {child.class}</h3>
                      <div className="text-right">
                        <div className="font-medium">Class Teacher: {child.classTeacher}</div>
                        <div className="text-sm text-muted-foreground">Groups: {child.groups.join(', ')}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {child.subjects.map((subject, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="font-medium text-lg mb-2">{subject.name}</div>
                            <div className="text-sm text-muted-foreground mb-3">Teacher: {subject.teacher}</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Attendance:</span>
                                <span className="font-medium">{subject.attendance}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Best Test Score:</span>
                                <span className="font-medium">{Math.max(...subject.testScores)}/30</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}