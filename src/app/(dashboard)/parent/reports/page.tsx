'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Sheet, FileDown } from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type ExportFormat = 'pdf' | 'csv' | 'excel';

// Mock student reports data
const studentReports = [
  {
    id: '1',
    name: 'Alex Johnson',
    studentId: 'STU2025001',
    class: 'JSS 2A',
    term: '1st',
    academicYear: '2025-2026',
    subjects: [
      { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, grade: 'A', position: 5, teacher: 'Mr. Smith' },
      { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, grade: 'B+', position: 8, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 25, quiz: 8, exam: 52, total: 85, average: 85, grade: 'B', position: 12, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+', position: 6, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 29, quiz: 10, exam: 56, total: 95, average: 95, grade: 'A+', position: 2, teacher: 'Mr. Wilson' }
    ],
    overallAverage: 88.5,
    position: 5,
    attendance: 95,
    teacherComments: {
      mathematics: "Excellent problem-solving skills. Shows great potential in advanced mathematics.",
      english: "Strong writing abilities. Should focus on expanding vocabulary for even better results.",
      science: "Very curious and engaged in class. Excellent laboratory skills.",
      socialStudies: "Good understanding of historical concepts. Participates well in class discussions."
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    studentId: 'STU2025002',
    class: 'JSS 1B',
    term: '1st',
    academicYear: '2025-2026',
    subjects: [
      { name: 'Mathematics', test: 24, quiz: 7, exam: 48, total: 79, average: 79, grade: 'C+', position: 18, teacher: 'Mr. Smith' },
      { name: 'English', test: 22, quiz: 6, exam: 50, total: 78, average: 78, grade: 'C+', position: 20, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+', position: 19, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 25, quiz: 8, exam: 51, total: 84, average: 84, grade: 'B', position: 14, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B', position: 12, teacher: 'Mr. Wilson' }
    ],
    overallAverage: 80.0,
    position: 12,
    attendance: 92,
    teacherComments: {
      mathematics: "Needs to practice more problems. Shows improvement but needs consistency.",
      english: "Good reading comprehension. Should work on grammar and sentence structure.",
      science: "Shows interest in experiments. Needs to improve theoretical understanding.",
      socialStudies: "Participates actively in class. Good understanding of basic concepts."
    }
  }
];

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

// Custom hook for export functionality
const useExportReports = () => {
  const exportToPDF = (report: any, filename: string = 'report') => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const subjectRows = report.subjects.map((subject: any) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.name}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.teacher}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.test}/30</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.quiz}/10</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.exam}/60</td>
          <td style="border: 1px solid #ddd; padding: 6px; font-weight: bold;">${subject.total}/100</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.average}%</td>
          <td style="border: 1px solid #ddd; padding: 6px;">
            <span style="padding: 2px 6px; border-radius: 3px; font-size: 10px; 
              ${subject.grade.includes('A') ? 'background: #d4edda; color: #155724;' :
          subject.grade.includes('B') ? 'background: #d1ecf1; color: #0c5460;' :
            subject.grade.includes('C') ? 'background: #fff3cd; color: #856404;' :
              'background: #f8d7da; color: #721c24;'}">
              ${subject.grade}
            </span>
          </td>
          <td style="border: 1px solid #ddd; padding: 6px;">#${subject.position}/35</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Academic Report - ${report.name}</title>
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
                font-size: 18px;
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
                font-size: 10px;
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
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Academic Report</h1>
              <p>${report.academicYear} - ${report.term} Term</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Student Information</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div><strong>Student Name:</strong> ${report.name}</div>
                <div><strong>Student ID:</strong> ${report.studentId}</div>
                <div><strong>Class:</strong> ${report.class}</div>
                <div><strong>Academic Year:</strong> ${report.academicYear}</div>
              </div>
              
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${report.overallAverage}%</div>
                  <div class="summary-label">Overall Average</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">#${report.position}</div>
                  <div class="summary-label">Class Position</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${report.attendance}%</div>
                  <div class="summary-label">Attendance</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${getOverallGrade(report.overallAverage)}</div>
                  <div class="summary-label">Final Grade</div>
                </div>
              </div>
            </div>

            <h3 style="margin: 0 0 10px 0; color: #1a365d;">Subject Performance</h3>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Test (30%)</th>
                  <th>Quiz (10%)</th>
                  <th>Exam (60%)</th>
                  <th>Total</th>
                  <th>Average</th>
                  <th>Grade</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                ${subjectRows}
              </tbody>
            </table>

            <h3 style="margin: 0 0 10px 0; color: #1a365d;">Teacher Comments</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 11px;">
              <div style="margin-bottom: 10px;">
                <strong>Mathematics - ${report.subjects.find((s: any) => s.name === 'Mathematics')?.teacher}:</strong><br>
                ${report.teacherComments?.mathematics || 'No comment provided.'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>English - ${report.subjects.find((s: any) => s.name === 'English')?.teacher}:</strong><br>
                ${report.teacherComments?.english || 'No comment provided.'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>Science - ${report.subjects.find((s: any) => s.name === 'Science')?.teacher}:</strong><br>
                ${report.teacherComments?.science || 'No comment provided.'}
              </div>
              <div>
                <strong>Social Studies - ${report.subjects.find((s: any) => s.name === 'Social Studies')?.teacher}:</strong><br>
                ${report.teacherComments?.socialStudies || 'No comment provided.'}
              </div>
            </div>

            <div class="footer">
              <p>Confidential Academic Report - For Parent/Guardian Use Only</p>
              <p>Generated by School Management System</p>
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

  const exportToCSV = (report: any, filename: string = 'report') => {
    const headers = [
      'Student',
      'Student ID',
      'Class',
      'Academic Year',
      'Term',
      'Overall Average',
      'Position',
      'Attendance',
      'Final Grade',
      'Mathematics Score',
      'Mathematics Grade',
      'Mathematics Position',
      'English Score',
      'English Grade',
      'English Position',
      'Science Score',
      'Science Grade',
      'Science Position',
      'Social Studies Score',
      'Social Studies Grade',
      'Social Studies Position',
      'Computer Science Score',
      'Computer Science Grade',
      'Computer Science Position'
    ];

    const csvContent = [
      headers.join(','),
      [
        `"${report.name.replace(/"/g, '""')}"`,
        report.studentId,
        report.class,
        report.academicYear,
        report.term,
        report.overallAverage,
        report.position,
        `${report.attendance}%`,
        getOverallGrade(report.overallAverage),
        // Mathematics
        report.subjects.find((s: any) => s.name === 'Mathematics')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Mathematics')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Mathematics')?.position || 'N/A',
        // English
        report.subjects.find((s: any) => s.name === 'English')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'English')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'English')?.position || 'N/A',
        // Science
        report.subjects.find((s: any) => s.name === 'Science')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Science')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Science')?.position || 'N/A',
        // Social Studies
        report.subjects.find((s: any) => s.name === 'Social Studies')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Social Studies')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Social Studies')?.position || 'N/A',
        // Computer Science
        report.subjects.find((s: any) => s.name === 'Computer Science')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Computer Science')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Computer Science')?.position || 'N/A'
      ].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (report: any, filename: string = 'report') => {
    const headers = [
      'Student',
      'Student ID',
      'Class',
      'Academic Year',
      'Term',
      'Overall Average',
      'Position',
      'Attendance',
      'Final Grade',
      'Mathematics Score',
      'Mathematics Grade',
      'Mathematics Position',
      'English Score',
      'English Grade',
      'English Position',
      'Science Score',
      'Science Grade',
      'Science Position',
      'Social Studies Score',
      'Social Studies Grade',
      'Social Studies Position',
      'Computer Science Score',
      'Computer Science Grade',
      'Computer Science Position'
    ];

    const csvContent = [
      headers.join(','),
      [
        `"${report.name.replace(/"/g, '""')}"`,
        report.studentId,
        report.class,
        report.academicYear,
        report.term,
        report.overallAverage,
        report.position,
        `${report.attendance}%`,
        getOverallGrade(report.overallAverage),
        // Mathematics
        report.subjects.find((s: any) => s.name === 'Mathematics')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Mathematics')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Mathematics')?.position || 'N/A',
        // English
        report.subjects.find((s: any) => s.name === 'English')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'English')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'English')?.position || 'N/A',
        // Science
        report.subjects.find((s: any) => s.name === 'Science')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Science')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Science')?.position || 'N/A',
        // Social Studies
        report.subjects.find((s: any) => s.name === 'Social Studies')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Social Studies')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Social Studies')?.position || 'N/A',
        // Computer Science
        report.subjects.find((s: any) => s.name === 'Computer Science')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'Computer Science')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'Computer Science')?.position || 'N/A'
      ].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return {
    exportToPDF,
    exportToCSV,
    exportToExcel
  };
};

export default function ReportsPage() {
  const { selectedStudentId, children } = useParentStore();
  const { exportToPDF, exportToCSV, exportToExcel } = useExportReports();

  const selectedStudent = children.find(child => child.id === selectedStudentId);
  const studentReport = studentReports.find(report => report.id === selectedStudentId);

  const handleExportReport = (format: ExportFormat, reportType: string) => {
    if (!studentReport) {
      toast.error('No student report available to export');
      return;
    }

    try {
      const filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${studentReport.name.replace(/\s+/g, '_')}`;

      switch (format) {
        case 'pdf':
          exportToPDF(studentReport, filename);
          toast.success(`Exported ${reportType} as PDF`);
          break;
        case 'csv':
          exportToCSV(studentReport, filename);
          toast.success(`Exported ${reportType} as CSV`);
          break;
        case 'excel':
          exportToExcel(studentReport, filename);
          toast.success(`Exported ${reportType} as Excel`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export report. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleDownloadReport = (reportType: string) => {
    if (!studentReport) {
      toast.error('Please select a student first');
      return;
    }
    handleExportReport('pdf', reportType);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            {selectedStudent
              ? `Download academic reports for ${selectedStudent.name}`
              : 'Download academic reports for your children'
            }
          </p>
        </div>

        {!selectedStudent && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Please select a student from the sidebar to view and download reports.
              </div>
            </CardContent>
          </Card>
        )}

        {selectedStudent && !studentReport && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No reports available for {selectedStudent.name} at the moment.
              </div>
            </CardContent>
          </Card>
        )}

        {selectedStudent && studentReport && (
          <Card>
            <CardHeader>
              <CardTitle>Available Reports for {selectedStudent.name}</CardTitle>
              <CardDescription>
                Download comprehensive academic reports and progress summaries in multiple formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Term 1 Progress Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive academic performance report for 1st Term 2025-2026
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExportReport('pdf', 'Term 1 Progress Report')}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download PDF</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('csv', 'Term 1 Progress Report')}
                        className="flex items-center space-x-2"
                      >
                        <Sheet className="h-4 w-4" />
                        <span>Download CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('excel', 'Term 1 Progress Report')}
                        className="flex items-center space-x-2"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Download Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Mid-Term Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed mid-term performance analysis and teacher comments
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExportReport('pdf', 'Mid-Term Assessment')}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download PDF</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('csv', 'Mid-Term Assessment')}
                        className="flex items-center space-x-2"
                      >
                        <Sheet className="h-4 w-4" />
                        <span>Download CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('excel', 'Mid-Term Assessment')}
                        className="flex items-center space-x-2"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Download Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Attendance Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Monthly and term-wise attendance records
                    </p>
                  </div>
                  <Button onClick={() => handleDownloadReport('Attendance Summary')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Complete Academic Year Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Full academic year performance across all subjects
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExportReport('pdf', 'Complete Academic Year Report')}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download PDF</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('csv', 'Complete Academic Year Report')}
                        className="flex items-center space-x-2"
                      >
                        <Sheet className="h-4 w-4" />
                        <span>Download CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportReport('excel', 'Complete Academic Year Report')}
                        className="flex items-center space-x-2"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Download Excel</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Current Academic Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded-lg bg-white">
                      <div className="text-xl font-bold text-blue-600">{studentReport.overallAverage}%</div>
                      <div className="text-xs text-muted-foreground">Overall Average</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg bg-white">
                      <div className="text-xl font-bold text-green-600">#{studentReport.position}</div>
                      <div className="text-xs text-muted-foreground">Class Position</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg bg-white">
                      <div className="text-xl font-bold text-purple-600">{studentReport.attendance}%</div>
                      <div className="text-xs text-muted-foreground">Attendance</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg bg-white">
                      <div className="text-xl font-bold text-orange-600">
                        {getOverallGrade(studentReport.overallAverage)}
                      </div>
                      <div className="text-xs text-muted-foreground">Final Grade</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}