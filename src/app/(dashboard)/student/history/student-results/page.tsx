'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Award, 
  Download, 
  FileText, 
  BarChart3,
  TrendingUp,
  BookOpen,
  Calendar,
  Filter,
  Sheet,
  FileDown
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportResults = () => {
  const exportToCSV = (results: any, filters: any, overallStats: any) => {
    if (!results) return;
    
    const headers = [
      'Subject', 
      'Code', 
      'Teacher', 
      'Test Score', 
      'Quiz Score', 
      'Exam Score', 
      'Total Score', 
      'Max Score',
      'Percentage', 
      'Grade', 
      'Attendance'
    ];
    
    const csvContent = [
      headers.join(','),
      ...results.subjects.map((subject: any) => {
        const testScore = subject.assessments.find((a: any) => a.type === 'test')?.score || 0;
        const quizScore = subject.assessments.find((a: any) => a.type === 'quiz')?.score || 0;
        const examScore = subject.assessments.find((a: any) => a.type === 'exam')?.score || 0;
        
        const testMax = subject.assessments.find((a: any) => a.type === 'test')?.maxScore || 0;
        const quizMax = subject.assessments.find((a: any) => a.type === 'quiz')?.maxScore || 0;
        const examMax = subject.assessments.find((a: any) => a.type === 'exam')?.maxScore || 0;

        const totalScore = testScore + quizScore + examScore;
        const totalMax = testMax + quizMax + examMax;
        const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
        const grade = getGradeFromPercentage(percentage);

        return [
          `"${subject.name}"`,
          subject.code,
          `"${subject.teacher}"`,
          testScore,
          quizScore,
          examScore,
          totalScore,
          totalMax,
          percentage.toFixed(1),
          grade,
          `${subject.attendance}%`
        ].join(',');
      }),
      '', // Empty row for separation
      'Overall Summary',
      `"Average Score","${overallStats?.averagePercentage.toFixed(1)}%"`,
      `"Overall Grade","${overallStats?.overallGrade}"`,
      `"Average Attendance","${overallStats?.averageAttendance.toFixed(1)}%"`,
      `"Total Subjects","${overallStats?.totalSubjects}"`
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student-results-${filters.academicYear}-${filters.term}-term.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (results: any, filters: any, overallStats: any) => {
    if (!results) return;
    
    const headers = [
      'Subject', 
      'Code', 
      'Teacher', 
      'Test Score', 
      'Quiz Score', 
      'Exam Score', 
      'Total Score', 
      'Max Score',
      'Percentage', 
      'Grade', 
      'Attendance'
    ];
    
    const csvContent = [
      headers.join(','),
      ...results.subjects.map((subject: any) => {
        const testScore = subject.assessments.find((a: any) => a.type === 'test')?.score || 0;
        const quizScore = subject.assessments.find((a: any) => a.type === 'quiz')?.score || 0;
        const examScore = subject.assessments.find((a: any) => a.type === 'exam')?.score || 0;
        
        const testMax = subject.assessments.find((a: any) => a.type === 'test')?.maxScore || 0;
        const quizMax = subject.assessments.find((a: any) => a.type === 'quiz')?.maxScore || 0;
        const examMax = subject.assessments.find((a: any) => a.type === 'exam')?.maxScore || 0;

        const totalScore = testScore + quizScore + examScore;
        const totalMax = testMax + quizMax + examMax;
        const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
        const grade = getGradeFromPercentage(percentage);

        return [
          `"${subject.name}"`,
          subject.code,
          `"${subject.teacher}"`,
          testScore,
          quizScore,
          examScore,
          totalScore,
          totalMax,
          percentage.toFixed(1),
          grade,
          `${subject.attendance}%`
        ].join(',');
      }),
      '', // Empty row for separation
      'Overall Summary',
      `"Average Score","${overallStats?.averagePercentage.toFixed(1)}%"`,
      `"Overall Grade","${overallStats?.overallGrade}"`,
      `"Average Attendance","${overallStats?.averageAttendance.toFixed(1)}%"`,
      `"Total Subjects","${overallStats?.totalSubjects}"`
    ].join('\n');

    // Create and download Excel file (using CSV format with .xls extension)
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student-results-${filters.academicYear}-${filters.term}-term.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (results: any, filters: any, overallStats: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow && results) {
      const subjectData = results.subjects.map((subject: any) => {
        const testScore = subject.assessments.find((a: any) => a.type === 'test')?.score || 0;
        const quizScore = subject.assessments.find((a: any) => a.type === 'quiz')?.score || 0;
        const examScore = subject.assessments.find((a: any) => a.type === 'exam')?.score || 0;
        
        const testMax = subject.assessments.find((a: any) => a.type === 'test')?.maxScore || 0;
        const quizMax = subject.assessments.find((a: any) => a.type === 'quiz')?.maxScore || 0;
        const examMax = subject.assessments.find((a: any) => a.type === 'exam')?.maxScore || 0;

        const totalScore = testScore + quizScore + examScore;
        const totalMax = testMax + quizMax + examMax;
        const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
        const grade = getGradeFromPercentage(percentage);

        return `
          <tr>
            <td>${subject.name}</td>
            <td>${subject.code}</td>
            <td>${subject.teacher}</td>
            <td>${testScore}/${testMax}</td>
            <td>${quizScore}/${quizMax}</td>
            <td>${examScore}/${examMax}</td>
            <td>${totalScore}/${totalMax}</td>
            <td>${percentage.toFixed(1)}%</td>
            <td>${grade}</td>
            <td>${subject.attendance}%</td>
          </tr>
        `;
      }).join('');

      const assessmentDetails = results.subjects.map((subject: any) => {
        const assessmentRows = subject.assessments.map((assessment: any) => {
          const percentage = (assessment.score / assessment.maxScore) * 100;
          const grade = getGradeFromPercentage(percentage);
          return `
            <tr>
              <td>${subject.name}</td>
              <td>${assessment.type}</td>
              <td>${assessment.title}</td>
              <td>${assessment.weight}%</td>
              <td>${assessment.score}/${assessment.maxScore}</td>
              <td>${percentage.toFixed(1)}%</td>
              <td>${grade}</td>
            </tr>
          `;
        }).join('');
        return assessmentRows;
      }).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Student Results - ${filters.academicYear} ${filters.term} Term</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.4;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 { 
                margin: 0; 
                color: #1a365d;
                font-size: 24px;
              }
              .header p { 
                margin: 5px 0; 
                color: #666;
              }
              .summary { 
                margin: 20px 0;
                padding: 15px;
                background-color: #f0f9ff;
                border-radius: 5px;
                border-left: 4px solid #007bff;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin: 15px 0;
              }
              .summary-item {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 5px;
                border: 1px solid #e1e5e9;
              }
              .summary-value {
                font-size: 20px;
                font-weight: bold;
                color: #1a365d;
              }
              .summary-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                font-size: 11px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold;
                color: #333;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .section-title {
                background-color: #e9ecef;
                font-weight: bold;
                font-size: 14px;
                padding: 10px;
                margin-top: 25px;
                border-left: 4px solid #007bff;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              .grade-A { background-color: #d4edda; color: #155724; }
              .grade-B { background-color: #d1ecf1; color: #0c5460; }
              .grade-C { background-color: #fff3cd; color: #856404; }
              .grade-D { background-color: #f8d7da; color: #721c24; }
              .grade-F { background-color: #f5c6cb; color: #721c24; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Academic Results</h1>
              <p>${filters.academicYear} - ${filters.term} Term</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Overall Performance Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${overallStats?.averagePercentage.toFixed(1)}%</div>
                  <div class="summary-label">Average Score</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${overallStats?.overallGrade}</div>
                  <div class="summary-label">Overall Grade</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${overallStats?.averageAttendance.toFixed(1)}%</div>
                  <div class="summary-label">Average Attendance</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${overallStats?.totalSubjects}</div>
                  <div class="summary-label">Total Subjects</div>
                </div>
              </div>
            </div>

            <div class="section-title">Subject-wise Results Summary</div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Teacher</th>
                  <th>Test Score</th>
                  <th>Quiz Score</th>
                  <th>Exam Score</th>
                  <th>Total Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                ${subjectData}
              </tbody>
            </table>

            <div class="section-title">Detailed Assessment Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Weight</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${assessmentDetails}
              </tbody>
            </table>

            <div class="footer">
              <p>Official Academic Record - For Student Use Only</p>
              <p>Generated by School Management System • Confidential</p>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Print PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Close
              </button>
            </div>

            <script>
              setTimeout(() => {
                window.print();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
};

export const StudentResultsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st'
  });

  const { useResults } = useStudentQueries();
  const { data: resultsResponse, isLoading, error } = useResults(filters);


  //console.log('Results Response:', resultsResponse);

  const { exportToCSV, exportToExcel, exportToPDF } = useExportResults();

  const academicYears = ['2024-2025', '2023-2024'];
  const terms = ['1st', '2nd', '3rd'];

  // Get filtered results
  const currentResults = useMemo(() => {
    return resultsResponse?.data?.find(r => 
      r.academicYear === filters.academicYear && 
      r.term === filters.term
    );
  }, [resultsResponse, filters]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (!currentResults) return null;

    let totalScore = 0;
    let totalMax = 0;
    let subjectCount = 0;

    currentResults.subjects.forEach((subject: any) => {
      const subjectTotal = subject.assessments.reduce((sum: number, a: any) => sum + a.score, 0);
      const subjectMax = subject.assessments.reduce((sum: number, a: any) => sum + a.maxScore, 0);
      
      totalScore += subjectTotal;
      totalMax += subjectMax;
      subjectCount++;
    });

    const averagePercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    const averageAttendance = currentResults.subjects.reduce((sum: number, s: any) => sum + s.attendance, 0) / subjectCount;

    return {
      averagePercentage,
      averageAttendance,
      totalSubjects: subjectCount,
      overallGrade: getGradeFromPercentage(averagePercentage)
    };
  }, [currentResults]);

  const handleExport = (format: ExportFormat) => {
    if (!currentResults) {
      toast.error('No results available to export');
      return;
    }

    try {
      switch (format) {
        case 'csv':
          exportToCSV(currentResults, filters, overallStats);
          toast.success('Results exported as CSV successfully!');
          break;
        case 'excel':
          exportToExcel(currentResults, filters, overallStats);
          toast.success('Results exported as Excel successfully!');
          break;
        case 'pdf':
          exportToPDF(currentResults, filters, overallStats);
          toast.success('Results exported as PDF successfully!');
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export results. Please try again.');
      console.error('Export error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Results</h3>
            <p className="text-muted-foreground">Failed to load results data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentResults) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground">No results available for the selected academic year and term</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Award className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Academic Results</h1>
          <p className="text-lg text-muted-foreground">View your results and academic performance</p>
        </div>

        {/* Filters and Export */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={filters.term}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>{term} Term</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleExport('csv')}
                      className="flex items-center space-x-2"
                    >
                      <Sheet className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExport('excel')}
                      className="flex items-center space-x-2"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExport('pdf')}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{overallStats.averagePercentage.toFixed(1)}%</div>
                  <div className="text-muted-foreground">Average Score</div>
                  <Progress value={overallStats.averagePercentage} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{overallStats.overallGrade}</div>
                  <div className="text-muted-foreground">Overall Grade</div>
                  <Badge variant="default" className="mt-2">{getGradeDescription(overallStats.overallGrade)}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{overallStats.averageAttendance.toFixed(1)}%</div>
                  <div className="text-muted-foreground">Average Attendance</div>
                  <Progress value={overallStats.averageAttendance} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{overallStats.totalSubjects}</div>
                  <div className="text-muted-foreground">Subjects</div>
                  <div className="text-sm text-muted-foreground mt-2">This term</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results - {filters.academicYear} {filters.term} Term</CardTitle>
            <CardDescription>Breakdown of assessments, quizzes, and exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentResults.subjects.map((subject: any, index: number) => {
                const testScore = subject.assessments.find((a: any) => a.type === 'test')?.score || 0;
                const quizScore = subject.assessments.find((a: any) => a.type === 'quiz')?.score || 0;
                const examScore = subject.assessments.find((a: any) => a.type === 'exam')?.score || 0;
                
                const testMax = subject.assessments.find((a: any) => a.type === 'test')?.maxScore || 0;
                const quizMax = subject.assessments.find((a: any) => a.type === 'quiz')?.maxScore || 0;
                const examMax = subject.assessments.find((a: any) => a.type === 'exam')?.maxScore || 0;

                const totalScore = testScore + quizScore + examScore;
                const totalMax = testMax + quizMax + examMax;
                const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
                const grade = getGradeFromPercentage(percentage);

                return (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                        <p className="text-muted-foreground">{subject.code} • {subject.teacher}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
                        <Badge variant="default">{grade}</Badge>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subject.assessments.map((assessment: any, assIndex: number) => {
                          const assPercentage = (assessment.score / assessment.maxScore) * 100;
                          const assGrade = getGradeFromPercentage(assPercentage);
                          
                          return (
                            <TableRow key={assIndex}>
                              <TableCell>
                                <Badge variant={
                                  assessment.type === 'test' ? 'default' :
                                  assessment.type === 'quiz' ? 'secondary' : 'outline'
                                }>
                                  {assessment.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{assessment.title}</TableCell>
                              <TableCell>{assessment.weight}%</TableCell>
                              <TableCell>{assessment.score}/{assessment.maxScore}</TableCell>
                              <TableCell>{assPercentage.toFixed(1)}%</TableCell>
                              <TableCell>
                                <Badge variant="default">{assGrade}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {/* Total Row */}
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                          <TableCell className="font-semibold">100%</TableCell>
                          <TableCell className="font-semibold">{totalScore}/{totalMax}</TableCell>
                          <TableCell className="font-semibold">{percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant="default">{grade}</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{testScore}/{testMax}</div>
                        <div className="text-sm text-muted-foreground">Tests (30%)</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{quizScore}/{quizMax}</div>
                        <div className="text-sm text-muted-foreground">Quizzes (10%)</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{examScore}/{examMax}</div>
                        <div className="text-sm text-muted-foreground">Exams (60%)</div>
                      </div>
                    </div>

                    {index < currentResults.subjects.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get grade from percentage
const getGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  if (percentage >= 50) return 'E';
  return 'F';
};

// Helper function to get grade description
const getGradeDescription = (grade: string): string => {
  const descriptions: { [key: string]: string } = {
    'A': 'Excellent',
    'B': 'Very Good',
    'C': 'Good',
    'D': 'Satisfactory',
    'E': 'Pass',
    'F': 'Fail'
  };
  return descriptions[grade] || 'Unknown';
};

export default StudentResultsPage;