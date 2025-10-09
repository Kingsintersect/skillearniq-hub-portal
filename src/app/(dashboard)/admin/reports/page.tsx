'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Sheet, FileDown, FileText } from 'lucide-react';
import { toast } from 'sonner';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Mock reports data with complete information
const reports = [
  {
    student: 'Alex Johnson',
    studentId: 'STU2025001',
    class: 'JSS 2A',
    subjects: [
      { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, grade: 'A', position: 5, teacher: 'Mr. Smith' },
      { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, grade: 'B+', position: 8, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 25, quiz: 8, exam: 52, total: 85, average: 85, grade: 'B', position: 12, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+', position: 6, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 29, quiz: 10, exam: 56, total: 95, average: 95, grade: 'A+', position: 2, teacher: 'Mr. Wilson' },
      { name: 'French', test: 24, quiz: 7, exam: 50, total: 81, average: 81, grade: 'B-', position: 15, teacher: 'Mrs. Garcia' }
    ],
    overallAverage: 88.5,
    position: 5,
    attendance: 95,
    term: '1st',
    academicYear: '2024-2025',
    teacherComments: {
      mathematics: "Excellent problem-solving skills. Shows great potential in advanced mathematics.",
      english: "Strong writing abilities. Should focus on expanding vocabulary for even better results.",
      science: "Very curious and engaged in class. Excellent laboratory skills.",
      socialStudies: "Good understanding of historical concepts. Participates well in class discussions."
    }
  },
  {
    student: 'Sarah Wilson',
    studentId: 'STU2025002',
    class: 'JSS 1B',
    subjects: [
      { name: 'Mathematics', test: 24, quiz: 7, exam: 48, total: 79, average: 79, grade: 'C+', position: 18, teacher: 'Mr. Smith' },
      { name: 'English', test: 22, quiz: 6, exam: 50, total: 78, average: 78, grade: 'C+', position: 20, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+', position: 19, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 25, quiz: 8, exam: 51, total: 84, average: 84, grade: 'B', position: 14, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B', position: 12, teacher: 'Mr. Wilson' },
      { name: 'French', test: 21, quiz: 6, exam: 48, total: 75, average: 75, grade: 'C', position: 22, teacher: 'Mrs. Garcia' }
    ],
    overallAverage: 80.0,
    position: 12,
    attendance: 92,
    term: '1st',
    academicYear: '2024-2025',
    teacherComments: {
      mathematics: "Needs to practice more problems. Shows improvement but needs consistency.",
      english: "Good reading comprehension. Should work on grammar and sentence structure.",
      science: "Shows interest in experiments. Needs to improve theoretical understanding.",
      socialStudies: "Participates actively in class. Good understanding of basic concepts."
    }
  },
  {
    student: 'Michael Brown',
    studentId: 'STU2025003',
    class: 'JSS 2A',
    subjects: [
      { name: 'Mathematics', test: 30, quiz: 10, exam: 58, total: 98, average: 98, grade: 'A+', position: 1, teacher: 'Mr. Smith' },
      { name: 'English', test: 28, quiz: 9, exam: 56, total: 93, average: 93, grade: 'A', position: 3, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 29, quiz: 10, exam: 57, total: 96, average: 96, grade: 'A', position: 2, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 27, quiz: 9, exam: 55, total: 91, average: 91, grade: 'A', position: 4, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 30, quiz: 10, exam: 58, total: 98, average: 98, grade: 'A+', position: 1, teacher: 'Mr. Wilson' },
      { name: 'French', test: 26, quiz: 8, exam: 53, total: 87, average: 87, grade: 'B+', position: 8, teacher: 'Mrs. Garcia' }
    ],
    overallAverage: 94.5,
    position: 1,
    attendance: 98,
    term: '1st',
    academicYear: '2024-2025',
    teacherComments: {
      mathematics: "Exceptional mathematical ability. Consistently top performer in class.",
      english: "Excellent writing skills and vocabulary. Very articulate in discussions.",
      science: "Outstanding performance in both theory and practical work.",
      socialStudies: "Deep understanding of concepts. Excellent analytical skills."
    }
  },
  {
    student: 'Emma Davis',
    studentId: 'STU2025004',
    class: 'JSS 1B',
    subjects: [
      { name: 'Mathematics', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B', position: 10, teacher: 'Mr. Smith' },
      { name: 'English', test: 24, quiz: 7, exam: 51, total: 82, average: 82, grade: 'B', position: 15, teacher: 'Mrs. Johnson' },
      { name: 'Science', test: 25, quiz: 8, exam: 50, total: 83, average: 83, grade: 'B', position: 13, teacher: 'Mr. Brown' },
      { name: 'Social Studies', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+', position: 20, teacher: 'Mrs. Davis' },
      { name: 'Computer Science', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+', position: 8, teacher: 'Mr. Wilson' },
      { name: 'French', test: 22, quiz: 7, exam: 49, total: 78, average: 78, grade: 'C+', position: 18, teacher: 'Mrs. Garcia' }
    ],
    overallAverage: 82.5,
    position: 8,
    attendance: 94,
    term: '1st',
    academicYear: '2024-2025',
    teacherComments: {
      mathematics: "Good understanding of concepts. Should work on speed and accuracy.",
      english: "Creative writer with good imagination. Needs to improve spelling.",
      science: "Shows good practical skills. Theoretical knowledge is adequate.",
      socialStudies: "Good participation in class discussions. Should read more widely."
    }
  }
];

// Custom hook for export functionality
const useExportReports = () => {
  const exportToCSV = (reports: any[], filters: any, filename: string = 'reports') => {
    if (!reports.length) return;
    
    // Create detailed CSV with all subject information
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
      'Computer Science Position',
      'French Score',
      'French Grade',
      'French Position'
    ];
    
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        `"${report.student.replace(/"/g, '""')}"`,
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
        report.subjects.find((s: any) => s.name === 'Computer Science')?.position || 'N/A',
        // French
        report.subjects.find((s: any) => s.name === 'French')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'French')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'French')?.position || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (reports: any[], filters: any, filename: string = 'reports') => {
    if (!reports.length) return;
    
    // Create detailed Excel with all subject information
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
      'Computer Science Position',
      'French Score',
      'French Grade',
      'French Position'
    ];
    
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        `"${report.student.replace(/"/g, '""')}"`,
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
        report.subjects.find((s: any) => s.name === 'Computer Science')?.position || 'N/A',
        // French
        report.subjects.find((s: any) => s.name === 'French')?.total || 'N/A',
        report.subjects.find((s: any) => s.name === 'French')?.grade || 'N/A',
        report.subjects.find((s: any) => s.name === 'French')?.position || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (reports: any[], filters: any, filename: string = 'reports') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && reports.length > 0) {
      
      // Create detailed report content for each student
      const reportContent = reports.map(report => {
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

        return `
          <div style="page-break-inside: avoid; margin-bottom: 30px;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <h2 style="margin: 0 0 10px 0; color: #1a365d;">${report.student}</h2>
              <p style="margin: 0; color: #666;">
                ${report.class} • Student ID: ${report.studentId} • ${report.academicYear} ${report.term} Term
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="font-size: 18px; font-weight: bold; color: #007bff;">${report.overallAverage}%</div>
                <div style="font-size: 11px; color: #666;">Overall Average</div>
              </div>
              <div style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="font-size: 18px; font-weight: bold; color: #28a745;">#${report.position}</div>
                <div style="font-size: 11px; color: #666;">Class Position</div>
              </div>
              <div style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="font-size: 18px; font-weight: bold; color: #6f42c1;">${report.attendance}%</div>
                <div style="font-size: 11px; color: #666;">Attendance</div>
              </div>
              <div style="text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="font-size: 18px; font-weight: bold; color: #fd7e14;">${getOverallGrade(report.overallAverage)}</div>
                <div style="font-size: 11px; color: #666;">Final Grade</div>
              </div>
            </div>

            <h3 style="margin: 0 0 10px 0; color: #1a365d;">Subject Performance</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Subject</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Teacher</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Test (30%)</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Quiz (10%)</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Exam (60%)</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Total</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Average</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Grade</th>
                  <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Position</th>
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
          </div>
          <hr style="border: none; border-top: 2px dashed #ddd; margin: 20px 0;">
        `;
      }).join('');

      const averageScore = reports.reduce((sum, report) => sum + report.overallAverage, 0) / reports.length;
      const averageAttendance = reports.reduce((sum, report) => sum + report.attendance, 0) / reports.length;

      printWindow.document.write(`
        <html>
          <head>
            <title>Student Academic Reports - ${filters.academicYear} ${filters.term} Term</title>
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
                grid-template-columns: repeat(3, 1fr);
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
              <h1>Student Academic Reports</h1>
              <p>${filters.academicYear} - ${filters.term} Term</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Reports: ${reports.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Overall Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${reports.length}</div>
                  <div class="summary-label">Total Students</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${averageScore.toFixed(1)}%</div>
                  <div class="summary-label">Average Score</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${averageAttendance.toFixed(1)}%</div>
                  <div class="summary-label">Average Attendance</div>
                </div>
              </div>
            </div>

            ${reportContent}

            <div class="footer">
              <p>Confidential Academic Reports - For Administrative Use Only</p>
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

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
};

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

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st',
    class: 'all',
    student: 'all'
  });

  const { exportToCSV, exportToExcel, exportToPDF } = useExportReports();

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
      const matchesAcademicYear = report.academicYear === filters.academicYear;
      const matchesTerm = report.term === filters.term;
      return matchesClass && matchesStudent && matchesAcademicYear && matchesTerm;
    });
  }, [filters, reports]);

  const handleExport = (format: ExportFormat) => {
    if (filteredReports.length === 0) {
      toast.error('No reports available to export');
      return;
    }

    try {
      const filename = `reports_${filters.academicYear}_${filters.term}`;
      switch (format) {
        case 'csv':
          exportToCSV(filteredReports, filters, filename);
          toast.success(`Exported ${filteredReports.length} reports as CSV`);
          break;
        case 'excel':
          exportToExcel(filteredReports, filters, filename);
          toast.success(`Exported ${filteredReports.length} reports as Excel`);
          break;
        case 'pdf':
          exportToPDF(filteredReports, filters, filename);
          toast.success(`Exported ${filteredReports.length} reports as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export reports. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleExportReport = (student: string) => {
    const studentReport = reports.find(r => r.student === student);
    if (studentReport) {
      exportToPDF([studentReport], filters, `report_${student.replace(/\s+/g, '_')}`);
      toast.success(`Exported PDF report for ${student}`);
    }
  };

  const handleExportAll = () => {
    handleExport('pdf');
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
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
                        {report.class} • Student ID: {report.studentId} • {report.academicYear} {report.term} Term • Overall Average: {report.overallAverage}%
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
                        <TableHead>Teacher</TableHead>
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
                          <TableCell>{subject.teacher}</TableCell>
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
                          <TableCell>#{subject.position}/35</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Teacher Comments */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-3">Teacher Comments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-sm">Mathematics - {report.subjects.find(s => s.name === 'Mathematics')?.teacher}</div>
                        <div className="text-sm text-muted-foreground">
                          "{report.teacherComments.mathematics}"
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">English - {report.subjects.find(s => s.name === 'English')?.teacher}</div>
                        <div className="text-sm text-muted-foreground">
                          "{report.teacherComments.english}"
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Science - {report.subjects.find(s => s.name === 'Science')?.teacher}</div>
                        <div className="text-sm text-muted-foreground">
                          "{report.teacherComments.science}"
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Social Studies - {report.subjects.find(s => s.name === 'Social Studies')?.teacher}</div>
                        <div className="text-sm text-muted-foreground">
                          "{report.teacherComments.socialStudies}"
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