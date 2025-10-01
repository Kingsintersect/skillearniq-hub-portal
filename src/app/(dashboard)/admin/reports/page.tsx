
'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026',
    term: '1st',
    class: 'all',
    student: 'all'
  });

  const reports = [
    {
      student: 'Alex Johnson',
      studentId: 'STU2025001',
      class: 'JSS 2A',
      subjects: [
        { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, grade: 'A' },
        { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, grade: 'B+' },
        { name: 'Science', test: 25, quiz: 8, exam: 52, total: 85, average: 85, grade: 'B' },
        { name: 'Social Studies', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+' }
      ],
      overallAverage: 88.5,
      position: 5,
      attendance: 95
    },
    {
      student: 'Sarah Johnson',
      studentId: 'STU2025002',
      class: 'JSS 1B',
      subjects: [
        { name: 'Mathematics', test: 24, quiz: 7, exam: 48, total: 79, average: 79, grade: 'C+' },
        { name: 'English', test: 22, quiz: 6, exam: 50, total: 78, average: 78, grade: 'C+' },
        { name: 'Science', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+' },
        { name: 'Social Studies', test: 25, quiz: 8, exam: 51, total: 84, average: 84, grade: 'B' }
      ],
      overallAverage: 80.0,
      position: 12,
      attendance: 92
    },
    {
      student: 'Michael Brown',
      studentId: 'STU2025003',
      class: 'JSS 2A',
      subjects: [
        { name: 'Mathematics', test: 30, quiz: 10, exam: 58, total: 98, average: 98, grade: 'A+' },
        { name: 'English', test: 28, quiz: 9, exam: 56, total: 93, average: 93, grade: 'A' },
        { name: 'Science', test: 29, quiz: 10, exam: 57, total: 96, average: 96, grade: 'A' },
        { name: 'Social Studies', test: 27, quiz: 9, exam: 55, total: 91, average: 91, grade: 'A' }
      ],
      overallAverage: 94.5,
      position: 1,
      attendance: 98
    },
    {
      student: 'Emma Wilson',
      studentId: 'STU2025004',
      class: 'JSS 1B',
      subjects: [
        { name: 'Mathematics', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B' },
        { name: 'English', test: 24, quiz: 7, exam: 51, total: 82, average: 82, grade: 'B' },
        { name: 'Science', test: 25, quiz: 8, exam: 50, total: 83, average: 83, grade: 'B' },
        { name: 'Social Studies', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+' }
      ],
      overallAverage: 82.5,
      position: 8,
      attendance: 94
    }
  ];

  // Get unique classes and students for filter options
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(reports.map(report => report.class))];
    return uniqueClasses;
  }, []);

  const students = useMemo(() => {
    return reports.map(report => report.student);
  }, []);

  // Filter reports based on selected filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesClass = filters.class === 'all' || report.class === filters.class;
      const matchesStudent = filters.student === 'all' || report.student === filters.student;
      return matchesClass && matchesStudent;
    });
  }, [filters, reports]);

  const handleExportReport = (student: string) => {
    toast.success(`Exporting PDF report for ${student}`);
  };

  const handleExportAll = () => {
    toast.success(`Exporting PDF reports for ${filteredReports.length} students`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Reports</h1>
          <p className="text-muted-foreground">View and export comprehensive student reports</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Select 
                  value={filters.academicYear} 
                  onValueChange={(value) => setFilters(prev => ({...prev, academicYear: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Term</label>
                <Select 
                  value={filters.term} 
                  onValueChange={(value) => setFilters(prev => ({...prev, term: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Term</SelectItem>
                    <SelectItem value="2nd">2nd Term</SelectItem>
                    <SelectItem value="3rd">3rd Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Class</label>
                <Select 
                  value={filters.class} 
                  onValueChange={(value) => setFilters(prev => ({...prev, class: value}))}
                >
                  <SelectTrigger>
                    <SelectValue>All Classes</SelectValue>
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
                <label className="text-sm font-medium">Student</label>
                <Select 
                  value={filters.student} 
                  onValueChange={(value) => setFilters(prev => ({...prev, student: value}))}
                >
                  <SelectTrigger>
                    <SelectValue>All Students</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {students.map(student => (
                      <SelectItem key={student} value={student}>{student}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleExportAll} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredReports.length} student reports found
              </div>
              {filteredReports.length > 0 && (
                <div className="text-sm">
                  Showing: {filters.class === 'all' ? 'All classes' : filters.class} • {filters.student === 'all' ? 'All students' : filters.student}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No student reports found matching the current filters.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{report.student}</CardTitle>
                      <CardDescription>
                        {report.class} • Student ID: {report.studentId} • Overall Average: {report.overallAverage}%
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleExportReport(report.student)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{report.overallAverage}%</div>
                      <div className="text-sm text-muted-foreground">Overall Average</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">#{report.position}</div>
                      <div className="text-sm text-muted-foreground">Class Position</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{report.attendance}%</div>
                      <div className="text-sm text-muted-foreground">Attendance</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {getOverallGrade(report.overallAverage)}
                      </div>
                      <div className="text-sm text-muted-foreground">Final Grade</div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Test (30%)</TableHead>
                        <TableHead>Quiz (10%)</TableHead>
                        <TableHead>Exam (60%)</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Average</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.subjects.map((subject, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>{subject.test}/30</TableCell>
                          <TableCell>{subject.quiz}/10</TableCell>
                          <TableCell>{subject.exam}/60</TableCell>
                          <TableCell className="font-semibold">{subject.total}/100</TableCell>
                          <TableCell>{subject.average}%</TableCell>
                          <TableCell>
                            <Badge variant={
                              subject.grade.includes('A') ? 'default' :
                              subject.grade.includes('B') ? 'secondary' : 'outline'
                            }>
                              {subject.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>#{getRandomPosition()}/35</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Teacher Comments */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-3">Teacher Comments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-sm">Mathematics - Mr. Smith</div>
                        <div className="text-sm text-muted-foreground">
                          "Excellent problem-solving skills. Shows great potential in advanced mathematics."
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">English - Mrs. Johnson</div>
                        <div className="text-sm text-muted-foreground">
                          "Strong writing abilities. Should focus on expanding vocabulary for even better results."
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get overall grade
const getOverallGrade = (average: number): string => {
  if (average >= 90) return 'A+';
  if (average >= 85) return 'A';
  if (average >= 80) return 'A-';
  if (average >= 75) return 'B+';
  if (average >= 70) return 'B';
  if (average >= 65) return 'B-';
  if (average >= 60) return 'C+';
  if (average >= 55) return 'C';
  if (average >= 50) return 'C-';
  return 'F';
};

// Helper function to generate random position for demonstration
const getRandomPosition = (): number => {
  return Math.floor(Math.random() * 35) + 1;
};