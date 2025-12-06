'use client';

import { Suspense } from 'react';
import FilterSection from './components/FilterSection';
import ChartsSection from './components/ChartsSection';
import GradeTable from './components/GradeTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import { useGradeStore } from '@/store/gradeStore';
import { Card, CardContent } from '@/components/ui/card';

function DashboardContent() {
  const {
    gradeData,
    isLoading,
    error,
    selectedCourse
  } = useGradeStore();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    if (gradeData.length > 0) {
      return (
        <>
          <ChartsSection />
          <GradeTable />
        </>
      );
    }

    if (selectedCourse) {
      return null; // Will show empty state
    }

    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                Loading filters...
              </div>
            </CardContent>
          </Card>
        }>
          <FilterSection />
        </Suspense>
        {renderContent()}
      </main>

      <footer className="border-t border-border bg-muted/50 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Student Grade Report Dashboard © 2024 | Admin Portal
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with Next.js 16, TypeScript, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}



// 'use client'
// import React, { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Download, Sheet, FileDown, FileText } from 'lucide-react';
// import { toast } from 'sonner';

// type ExportFormat = 'csv' | 'excel' | 'pdf';

// // Mock reports data with complete information
// const reports = [
//   {
//     student: 'Alex Johnson',
//     studentId: 'STU2025001',
//     class: 'JSS 2A',
//     subjects: [
//       { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, grade: 'A', position: 5, teacher: 'Mr. Smith' },
//       { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, grade: 'B+', position: 8, teacher: 'Mrs. Johnson' },
//       { name: 'Science', test: 25, quiz: 8, exam: 52, total: 85, average: 85, grade: 'B', position: 12, teacher: 'Mr. Brown' },
//       { name: 'Social Studies', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+', position: 6, teacher: 'Mrs. Davis' },
//       { name: 'Computer Science', test: 29, quiz: 10, exam: 56, total: 95, average: 95, grade: 'A+', position: 2, teacher: 'Mr. Wilson' },
//       { name: 'French', test: 24, quiz: 7, exam: 50, total: 81, average: 81, grade: 'B-', position: 15, teacher: 'Mrs. Garcia' }
//     ],
//     overallAverage: 88.5,
//     position: 5,
//     attendance: 95,
//     term: '1st',
//     teacherComments: {
//       mathematics: "Excellent problem-solving skills. Shows great potential in advanced mathematics.",
//       english: "Strong writing abilities. Should focus on expanding vocabulary for even better results.",
//       science: "Very curious and engaged in class. Excellent laboratory skills.",
//       socialStudies: "Good understanding of historical concepts. Participates well in class discussions."
//     }
//   },
//   {
//     student: 'Sarah Wilson',
//     studentId: 'STU2025002',
//     class: 'JSS 1B',
//     subjects: [
//       { name: 'Mathematics', test: 24, quiz: 7, exam: 48, total: 79, average: 79, grade: 'C+', position: 18, teacher: 'Mr. Smith' },
//       { name: 'English', test: 22, quiz: 6, exam: 50, total: 78, average: 78, grade: 'C+', position: 20, teacher: 'Mrs. Johnson' },
//       { name: 'Science', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+', position: 19, teacher: 'Mr. Brown' },
//       { name: 'Social Studies', test: 25, quiz: 8, exam: 51, total: 84, average: 84, grade: 'B', position: 14, teacher: 'Mrs. Davis' },
//       { name: 'Computer Science', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B', position: 12, teacher: 'Mr. Wilson' },
//       { name: 'French', test: 21, quiz: 6, exam: 48, total: 75, average: 75, grade: 'C', position: 22, teacher: 'Mrs. Garcia' }
//     ],
//     overallAverage: 80.0,
//     position: 12,
//     attendance: 92,
//     term: '1st',
//     teacherComments: {
//       mathematics: "Needs to practice more problems. Shows improvement but needs consistency.",
//       english: "Good reading comprehension. Should work on grammar and sentence structure.",
//       science: "Shows interest in experiments. Needs to improve theoretical understanding.",
//       socialStudies: "Participates actively in class. Good understanding of basic concepts."
//     }
//   },
//   {
//     student: 'Michael Brown',
//     studentId: 'STU2025003',
//     class: 'JSS 2A',
//     subjects: [
//       { name: 'Mathematics', test: 30, quiz: 10, exam: 58, total: 98, average: 98, grade: 'A+', position: 1, teacher: 'Mr. Smith' },
//       { name: 'English', test: 28, quiz: 9, exam: 56, total: 93, average: 93, grade: 'A', position: 3, teacher: 'Mrs. Johnson' },
//       { name: 'Science', test: 29, quiz: 10, exam: 57, total: 96, average: 96, grade: 'A', position: 2, teacher: 'Mr. Brown' },
//       { name: 'Social Studies', test: 27, quiz: 9, exam: 55, total: 91, average: 91, grade: 'A', position: 4, teacher: 'Mrs. Davis' },
//       { name: 'Computer Science', test: 30, quiz: 10, exam: 58, total: 98, average: 98, grade: 'A+', position: 1, teacher: 'Mr. Wilson' },
//       { name: 'French', test: 26, quiz: 8, exam: 53, total: 87, average: 87, grade: 'B+', position: 8, teacher: 'Mrs. Garcia' }
//     ],
//     overallAverage: 94.5,
//     position: 1,
//     attendance: 98,
//     term: '1st',
//     teacherComments: {
//       mathematics: "Exceptional mathematical ability. Consistently top performer in class.",
//       english: "Excellent writing skills and vocabulary. Very articulate in discussions.",
//       science: "Outstanding performance in both theory and practical work.",
//       socialStudies: "Deep understanding of concepts. Excellent analytical skills."
//     }
//   },
//   {
//     student: 'Emma Davis',
//     studentId: 'STU2025004',
//     class: 'JSS 1B',
//     subjects: [
//       { name: 'Mathematics', test: 26, quiz: 8, exam: 52, total: 86, average: 86, grade: 'B', position: 10, teacher: 'Mr. Smith' },
//       { name: 'English', test: 24, quiz: 7, exam: 51, total: 82, average: 82, grade: 'B', position: 15, teacher: 'Mrs. Johnson' },
//       { name: 'Science', test: 25, quiz: 8, exam: 50, total: 83, average: 83, grade: 'B', position: 13, teacher: 'Mr. Brown' },
//       { name: 'Social Studies', test: 23, quiz: 7, exam: 49, total: 79, average: 79, grade: 'C+', position: 20, teacher: 'Mrs. Davis' },
//       { name: 'Computer Science', test: 27, quiz: 9, exam: 53, total: 89, average: 89, grade: 'B+', position: 8, teacher: 'Mr. Wilson' },
//       { name: 'French', test: 22, quiz: 7, exam: 49, total: 78, average: 78, grade: 'C+', position: 18, teacher: 'Mrs. Garcia' }
//     ],
//     overallAverage: 82.5,
//     position: 8,
//     attendance: 94,
//     term: '1st',
//     teacherComments: {
//       mathematics: "Good understanding of concepts. Should work on speed and accuracy.",
//       english: "Creative writer with good imagination. Needs to improve spelling.",
//       science: "Shows good practical skills. Theoretical knowledge is adequate.",
//       socialStudies: "Good participation in class discussions. Should read more widely."
//     }
//   }
// ];

// // Custom hook for export functionality
// const useExportReports = () => {
//   const exportToCSV = (reports: any[], filters: any, filename: string = 'reports') => {
//     if (!reports.length) return;

//     // Create detailed CSV with all subject information
//     const headers = [
//       'Student',
//       'Student ID',
//       'Class',
//       'Term',
//       'Overall Average',
//       'Position',
//       'Attendance',
//       'Final Grade',
//       'Mathematics Score',
//       'Mathematics Grade',
//       'Mathematics Position',
//       'English Score',
//       'English Grade',
//       'English Position',
//       'Science Score',
//       'Science Grade',
//       'Science Position',
//       'Social Studies Score',
//       'Social Studies Grade',
//       'Social Studies Position',
//       'Computer Science Score',
//       'Computer Science Grade',
//       'Computer Science Position',
//       'French Score',
//       'French Grade',
//       'French Position'
//     ];

//     const csvContent = [
//       headers.join(','),
//       ...reports.map(report => [
//         `"${report.student.replace(/"/g, '""')}"`,
//         report.studentId,
//         report.class,
//         report.term,
//         report.overallAverage,
//         report.position,
//         `${report.attendance}%`,
//         getOverallGrade(report.overallAverage),
//         // Mathematics
//         report.subjects.find((s: any) => s.name === 'Mathematics')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Mathematics')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Mathematics')?.position || 'N/A',
//         // English
//         report.subjects.find((s: any) => s.name === 'English')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'English')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'English')?.position || 'N/A',
//         // Science
//         report.subjects.find((s: any) => s.name === 'Science')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Science')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Science')?.position || 'N/A',
//         // Social Studies
//         report.subjects.find((s: any) => s.name === 'Social Studies')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Social Studies')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Social Studies')?.position || 'N/A',
//         // Computer Science
//         report.subjects.find((s: any) => s.name === 'Computer Science')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Computer Science')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'Computer Science')?.position || 'N/A',
//         // French
//         report.subjects.find((s: any) => s.name === 'French')?.total || 'N/A',
//         report.subjects.find((s: any) => s.name === 'French')?.grade || 'N/A',
//         report.subjects.find((s: any) => s.name === 'French')?.position || 'N/A'
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     URL.revokeObjectURL(link.href);
//   };

//   const exportToExcel = (reports: any[], filters: any, filename: string = 'reports') => {
//     if (!reports.length) return;

//     // Create detailed Excel with all subject information
//     const csvContent = [
//       // Same CSV content as above
//       ...reports.map(report => [
//         // Same mapping as CSV export
//       ])
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
//     link.click();
//     URL.revokeObjectURL(link.href);
//   };

//   const exportToPDF = (reports: any[], filters: any, filename: string = 'reports') => {
//     const printWindow = window.open('', '_blank');
//     if (printWindow && reports.length > 0) {
//       // PDF generation logic remains the same as it's for printing
//       // ... (same PDF generation code)
//     }
//   };

//   return {
//     exportToCSV,
//     exportToExcel,
//     exportToPDF
//   };
// };

// // Helper function to get overall grade
// const getOverallGrade = (average: number): string => {
//   if (average >= 90) return 'A+';
//   if (average >= 85) return 'A';
//   if (average >= 80) return 'A-';
//   if (average >= 75) return 'B+';
//   if (average >= 70) return 'B';
//   if (average >= 65) return 'B-';
//   if (average >= 60) return 'C+';
//   if (average >= 55) return 'C';
//   if (average >= 50) return 'C-';
//   return 'F';
// };

// export default function ReportsPage() {
//   const [filters, setFilters] = useState({
//     term: '1st',
//     class: 'all',
//     student: 'all'
//   });

//   const { exportToCSV, exportToExcel, exportToPDF } = useExportReports();

//   // Get unique classes and students for filter options
//   const classes = useMemo(() => {
//     const uniqueClasses = [...new Set(reports.map(report => report.class))];
//     return uniqueClasses;
//   }, []);

//   const students = useMemo(() => {
//     return reports.map(report => report.student);
//   }, []);

//   // Filter reports based on selected filters
//   const filteredReports = useMemo(() => {
//     return reports.filter(report => {
//       const matchesClass = filters.class === 'all' || report.class === filters.class;
//       const matchesStudent = filters.student === 'all' || report.student === filters.student;
//       const matchesTerm = report.term === filters.term;
//       return matchesClass && matchesStudent && matchesTerm;
//     });
//   }, [filters, reports]);

//   const handleExport = (format: ExportFormat) => {
//     if (filteredReports.length === 0) {
//       toast.error('No reports available to export');
//       return;
//     }

//     try {
//       const filename = `reports_${filters.term}`;
//       switch (format) {
//         case 'csv':
//           exportToCSV(filteredReports, filters, filename);
//           toast.success(`Exported ${filteredReports.length} reports as CSV`);
//           break;
//         case 'excel':
//           exportToExcel(filteredReports, filters, filename);
//           toast.success(`Exported ${filteredReports.length} reports as Excel`);
//           break;
//         case 'pdf':
//           exportToPDF(filteredReports, filters, filename);
//           toast.success(`Exported ${filteredReports.length} reports as PDF`);
//           break;
//         default:
//           toast.error('Unsupported export format');
//       }
//     } catch (error) {
//       toast.error('Failed to export reports. Please try again.');
//       console.error('Export error:', error);
//     }
//   };

//   const handleExportReport = (student: string) => {
//     const studentReport = reports.find(r => r.student === student);
//     if (studentReport) {
//       exportToPDF([studentReport], filters, `report_${student.replace(/\s+/g, '_')}`);
//       toast.success(`Exported PDF report for ${student}`);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-background">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground">Student Reports</h1>
//           <p className="text-muted-foreground">View and export comprehensive student reports</p>
//         </div>

//         {/* Filters */}
//         <Card className="mb-6 bg-card border-border">
//           <CardContent className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground">Term</label>
//                 <Select
//                   value={filters.term}
//                   onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     <SelectItem value="1st" className="text-foreground">1st Term</SelectItem>
//                     <SelectItem value="2nd" className="text-foreground">2nd Term</SelectItem>
//                     <SelectItem value="3rd" className="text-foreground">3rd Term</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-foreground">Class</label>
//                 <Select
//                   value={filters.class}
//                   onValueChange={(value) => setFilters(prev => ({ ...prev, class: value }))}
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue>All Classes</SelectValue>
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     <SelectItem value="all" className="text-foreground">All Classes</SelectItem>
//                     {classes.map(cls => (
//                       <SelectItem key={cls} value={cls} className="text-foreground">{cls}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-foreground">Student</label>
//                 <Select
//                   value={filters.student}
//                   onValueChange={(value) => setFilters(prev => ({ ...prev, student: value }))}
//                 >
//                   <SelectTrigger className="bg-background border-border">
//                     <SelectValue>All Students</SelectValue>
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     <SelectItem value="all" className="text-foreground">All Students</SelectItem>
//                     {students.map(student => (
//                       <SelectItem key={student} value={student} className="text-foreground">{student}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-end">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button className="w-full">
//                       <Download className="h-4 w-4 mr-2" />
//                       Export All
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="bg-background border-border">
//                     <DropdownMenuItem
//                       onClick={() => handleExport('csv')}
//                       className="flex items-center space-x-2 text-foreground"
//                     >
//                       <Sheet className="h-4 w-4" />
//                       <span>Export as CSV</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() => handleExport('excel')}
//                       className="flex items-center space-x-2 text-foreground"
//                     >
//                       <FileDown className="h-4 w-4" />
//                       <span>Export as Excel</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() => handleExport('pdf')}
//                       className="flex items-center space-x-2 text-foreground"
//                     >
//                       <FileText className="h-4 w-4" />
//                       <span>Export as PDF</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between items-center">
//               <div className="text-sm text-muted-foreground">
//                 {filteredReports.length} student reports found
//               </div>
//               {filteredReports.length > 0 && (
//                 <div className="text-sm text-foreground">
//                   Showing: {filters.class === 'all' ? 'All classes' : filters.class} • {filters.student === 'all' ? 'All students' : filters.student}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Reports */}
//         {filteredReports.length === 0 ? (
//           <Card className="bg-card border-border">
//             <CardContent className="p-12 text-center">
//               <div className="text-muted-foreground">
//                 No student reports found matching the current filters.
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-6">
//             {filteredReports.map((report, index) => (
//               <Card key={index} className="bg-card border-border">
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <CardTitle className="text-foreground">{report.student}</CardTitle>
//                       <CardDescription>
//                         {report.class} • Student ID: {report.studentId} • {report.term} Term • Overall Average: {report.overallAverage}%
//                       </CardDescription>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Button variant="outline" onClick={() => handleExportReport(report.student)} className="border-border">
//                         <Download className="h-4 w-4 mr-2" />
//                         Export PDF
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                     <div className="text-center p-4 border border-border rounded-lg bg-background/50">
//                       <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{report.overallAverage}%</div>
//                       <div className="text-sm text-muted-foreground">Overall Average</div>
//                     </div>
//                     <div className="text-center p-4 border border-border rounded-lg bg-background/50">
//                       <div className="text-2xl font-bold text-green-600 dark:text-green-400">#{report.position}</div>
//                       <div className="text-sm text-muted-foreground">Class Position</div>
//                     </div>
//                     <div className="text-center p-4 border border-border rounded-lg bg-background/50">
//                       <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{report.attendance}%</div>
//                       <div className="text-sm text-muted-foreground">Attendance</div>
//                     </div>
//                     <div className="text-center p-4 border border-border rounded-lg bg-background/50">
//                       <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//                         {getOverallGrade(report.overallAverage)}
//                       </div>
//                       <div className="text-sm text-muted-foreground">Final Grade</div>
//                     </div>
//                   </div>

//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="text-foreground">Subject</TableHead>
//                         <TableHead className="text-foreground">Teacher</TableHead>
//                         <TableHead className="text-foreground">Test (30%)</TableHead>
//                         <TableHead className="text-foreground">Quiz (10%)</TableHead>
//                         <TableHead className="text-foreground">Exam (60%)</TableHead>
//                         <TableHead className="text-foreground">Total</TableHead>
//                         <TableHead className="text-foreground">Average</TableHead>
//                         <TableHead className="text-foreground">Grade</TableHead>
//                         <TableHead className="text-foreground">Position</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {report.subjects.map((subject, idx) => (
//                         <TableRow key={idx} className="hover:bg-muted/50">
//                           <TableCell className="font-medium text-foreground">{subject.name}</TableCell>
//                           <TableCell className="text-foreground">{subject.teacher}</TableCell>
//                           <TableCell className="text-foreground">{subject.test}/30</TableCell>
//                           <TableCell className="text-foreground">{subject.quiz}/10</TableCell>
//                           <TableCell className="text-foreground">{subject.exam}/60</TableCell>
//                           <TableCell className="font-semibold text-foreground">{subject.total}/100</TableCell>
//                           <TableCell className="text-foreground">{subject.average}%</TableCell>
//                           <TableCell>
//                             <Badge variant={
//                               subject.grade.includes('A') ? 'default' :
//                                 subject.grade.includes('B') ? 'secondary' : 'outline'
//                             }>
//                               {subject.grade}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-foreground">#{subject.position}/35</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>

//                   {/* Teacher Comments */}
//                   <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
//                     <h4 className="font-semibold mb-3 text-foreground">Teacher Comments</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <div className="font-medium text-sm text-foreground">Mathematics - {report.subjects.find(s => s.name === 'Mathematics')?.teacher}</div>
//                         <div className="text-sm text-muted-foreground">
//                           "{report.teacherComments.mathematics}"
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-medium text-sm text-foreground">English - {report.subjects.find(s => s.name === 'English')?.teacher}</div>
//                         <div className="text-sm text-muted-foreground">
//                           "{report.teacherComments.english}"
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-medium text-sm text-foreground">Science - {report.subjects.find(s => s.name === 'Science')?.teacher}</div>
//                         <div className="text-sm text-muted-foreground">
//                           "{report.teacherComments.science}"
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-medium text-sm text-foreground">Social Studies - {report.subjects.find(s => s.name === 'Social Studies')?.teacher}</div>
//                         <div className="text-sm text-muted-foreground">
//                           "{report.teacherComments.socialStudies}"
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }