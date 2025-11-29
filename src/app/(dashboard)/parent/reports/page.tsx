'use client';

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportFormat, useParentStore } from '@/store/parentStore';
import { Download, TrendingUp, TrendingDown, Minus, User, BookOpen, Calendar, Award, FileText, Sheet, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { useGradeReports } from '../hooks/useGradeReports';
import { useExportReports } from '../hooks/useExportReports';

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

const getImprovementIcon = (improvement: string) => {
  switch (improvement) {
    case 'improved': return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'declined': return <TrendingDown className="h-4 w-4 text-red-600" />;
    default: return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

export default function GradeReportsPage() {
  const { selectedChild } = useParentStore();
  const { exportToPDF, exportToCSV, exportToExcel } = useExportReports();
  const handleExportReport = (format: ExportFormat) => {
    if (!selectedGradeReport || selectedGradeReport.terms.length === 0) {
      toast.error('No grade report available to export');
      return;
    }

    try {
      const currentTerm = selectedGradeReport.terms[selectedTermIndex];
      const filename = `grade_report_${selectedGradeReport.studentName.replace(/\s+/g, '_')}_${currentTerm.term}_Term`;

      switch (format) {
        case 'pdf':
          exportToPDF(selectedGradeReport, currentTerm, filename);
          toast.success(`Exported ${currentTerm.term} Term report as PDF`);
          break;
        case 'csv':
          exportToCSV(selectedGradeReport, currentTerm, filename);
          toast.success(`Exported ${currentTerm.term} Term report as CSV`);
          break;
        case 'excel':
          exportToExcel(selectedGradeReport, currentTerm, filename);
          toast.success(`Exported ${currentTerm.term} Term report as Excel`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export grade report. Please try again.');
      console.error('Export error:', error);
    }
  };

  const {
    selectedGradeReport,
    gradeSummary,
    isGradeReportsLoading,
    gradeReportsError,
    selectedStudentId
  } = useGradeReports();

  const [selectedTermIndex, setSelectedTermIndex] = useState(0);

  // const handleExportReport = () => {
  //   if (!selectedGradeReport) {
  //     toast.error('No grade report available to export');
  //     return;
  //   }

  //   toast.success('Grade report exported successfully');
  //   // In a real app, this would generate and download a PDF
  // };

  if (isGradeReportsLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">Loading grade reports...</div>
      </div>
    );
  }

  if (gradeReportsError) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center text-red-600">Error loading grade reports: {gradeReportsError}</div>
      </div>
    );
  }

  if (!selectedStudentId || !selectedChild) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                Please select a student to view grade reports
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedGradeReport) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                No grade reports available for {selectedChild.first_name}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentTerm = selectedGradeReport.terms[selectedTermIndex];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Grade Reports</h1>
            <p className="text-muted-foreground">
              Academic performance for {selectedChild.first_name}
            </p>
          </div>
          {/* <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button> */}
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleExportReport('pdf')}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportReport('csv')}
                className="flex items-center space-x-2"
              >
                <Sheet className="h-4 w-4" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExportReport('excel')}
                className="flex items-center space-x-2"
              >
                <FileDown className="h-4 w-4" />
                <span>Export as Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Summary Cards */}
        {gradeSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Average</p>
                    <p className="text-2xl font-bold">{gradeSummary.currentAverage.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Class Position</p>
                    <p className="text-2xl font-bold">
                      {gradeSummary.currentPosition}<span className="text-sm font-normal text-muted-foreground">/{gradeSummary.classSize}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Grade</p>
                    <Badge className={`text-lg px-3 py-1 ${getGradeColor(gradeSummary.currentGrade)}`}>
                      {gradeSummary.currentGrade}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Performance Trend</p>
                    <div className="flex items-center gap-2">
                      {getImprovementIcon(gradeSummary.improvement)}
                      <span className="text-lg font-bold">
                        {gradeSummary.trend > 0 ? '+' : ''}{gradeSummary.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Academic Report</CardTitle>
                <CardDescription>
                  {selectedGradeReport.class} {selectedGradeReport.classArm} • Class Teacher: {selectedGradeReport.classTeacher}
                </CardDescription>
              </div>

              {/* Term Selector */}
              {selectedGradeReport.terms.length > 1 && (
                <Tabs value={selectedTermIndex.toString()} onValueChange={(value) => setSelectedTermIndex(parseInt(value))}>
                  <TabsList className="grid w-full grid-cols-3">
                    {selectedGradeReport.terms.map((term, index) => (
                      <TabsTrigger key={term.term} value={index.toString()}>
                        {term.term} Term
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="subjects" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="remarks">Remarks</TabsTrigger>
              </TabsList>

              <TabsContent value="subjects">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">CA1</TableHead>
                        <TableHead className="text-center">CA2</TableHead>
                        <TableHead className="text-center">Exam</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-center">Position</TableHead>
                        <TableHead>Remark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTerm.subjects.map((subject, index) => (
                        <TableRow key={subject.code}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{subject.subject}</div>
                              <div className="text-xs text-muted-foreground">{subject.code}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{subject.ca1}</TableCell>
                          <TableCell className="text-center">{subject.ca2}</TableCell>
                          <TableCell className="text-center">{subject.exam}</TableCell>
                          <TableCell className="text-center font-semibold">{subject.total}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.position}<span className="text-xs text-muted-foreground">/{currentTerm.summary.classSize}</span>
                          </TableCell>
                          <TableCell>{subject.remark}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="attendance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Attendance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Days Present:</span>
                          <span className="font-semibold">{currentTerm.attendance.present}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Days:</span>
                          <span className="font-semibold">{currentTerm.attendance.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attendance Rate:</span>
                          <span className="font-semibold text-green-600">{currentTerm.attendance.percentage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Term Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Score:</span>
                          <span className="font-semibold">{currentTerm.summary.totalScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average:</span>
                          <span className="font-semibold">{currentTerm.summary.average.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Position:</span>
                          <span className="font-semibold">
                            {currentTerm.summary.position}<span className="text-sm font-normal text-muted-foreground">/{currentTerm.summary.classSize}</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Grade:</span>
                          <Badge className={getGradeColor(currentTerm.summary.grade)}>
                            {currentTerm.summary.grade}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="remarks">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Class Teacher's Remark</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentTerm.remarks.classTeacher}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Principal's Remark</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentTerm.remarks.principal}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
