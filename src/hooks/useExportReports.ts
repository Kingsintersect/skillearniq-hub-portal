// hooks/useExportReports.ts
import { StudentGradeReport, TermGrade, ExportFormat } from '@/store/parentStore';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const useExportReports = () => {
  const exportToPDF = (report: StudentGradeReport, term: TermGrade, filename: string) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Academic Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Student: ${report.studentName}`, 20, 35);
    doc.text(`Class: ${report.class} ${report.classArm}`, 20, 45);
    doc.text(`Class Teacher: ${report.classTeacher}`, 20, 55);
    doc.text(`Term: ${term.term}`, 20, 65);
    
    // Add summary table
    const summaryData = [
      ['Total Score', term.summary.totalScore.toString()],
      ['Average', `${term.summary.average.toFixed(1)}%`],
      ['Position', `${term.summary.position}/${term.summary.classSize}`],
      ['Overall Grade', term.summary.grade]
    ];
    
    (doc as any).autoTable({
      startY: 75,
      head: [['Metric', 'Value']],
      body: summaryData,
    });
    
    // Add subjects table
    const subjectsData = term.subjects.map(subject => [
      subject.subject,
      subject.ca1.toString(),
      subject.ca2.toString(),
      subject.exam.toString(),
      subject.total.toString(),
      subject.grade,
      `${subject.position}/${term.summary.classSize}`,
      subject.remark
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Subject', 'CA1', 'CA2', 'Exam', 'Total', 'Grade', 'Position', 'Remark']],
      body: subjectsData,
    });
    
    // Add attendance
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Attendance']],
      body: [
        [`Present: ${term.attendance.present}`],
        [`Total: ${term.attendance.total}`],
        [`Percentage: ${term.attendance.percentage}%`]
      ],
    });
    
    // Add remarks
    const remarksY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Class Teacher Remark:', 20, remarksY);
    doc.text(term.remarks.classTeacher, 20, remarksY + 10);
    
    doc.text('Principal Remark:', 20, remarksY + 30);
    doc.text(term.remarks.principal, 20, remarksY + 40);
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  };

  const exportToCSV = (report: StudentGradeReport, term: TermGrade, filename: string) => {
    // Prepare data
    const headers = ['Subject', 'CA1', 'CA2', 'Exam', 'Total', 'Grade', 'Position', 'Remark'];
    const rows = term.subjects.map(subject => [
      subject.subject,
      subject.ca1,
      subject.ca2,
      subject.exam,
      subject.total,
      subject.grade,
      `${subject.position}/${term.summary.classSize}`,
      subject.remark
    ]);
    
    // Add summary rows
    const summaryRows = [
      [],
      ['Summary'],
      ['Total Score', term.summary.totalScore],
      ['Average', `${term.summary.average.toFixed(1)}%`],
      ['Position', `${term.summary.position}/${term.summary.classSize}`],
      ['Overall Grade', term.summary.grade],
      [],
      ['Attendance'],
      ['Present', term.attendance.present],
      ['Total', term.attendance.total],
      ['Percentage', `${term.attendance.percentage}%`]
    ];
    
    // Combine all data
    const allData = [headers, ...rows, ...summaryRows];
    
    // Convert to CSV
    const csvContent = allData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (report: StudentGradeReport, term: TermGrade, filename: string) => {
    // Create workbook
    const wb = utils.book_new();
    
    // Subjects sheet
    const subjectsData = [
      ['Subject', 'CA1', 'CA2', 'Exam', 'Total', 'Grade', 'Position', 'Remark'],
      ...term.subjects.map(subject => [
        subject.subject,
        subject.ca1,
        subject.ca2,
        subject.exam,
        subject.total,
        subject.grade,
        `${subject.position}/${term.summary.classSize}`,
        subject.remark
      ])
    ];
    
    const wsSubjects = utils.aoa_to_sheet(subjectsData);
    utils.book_append_sheet(wb, wsSubjects, 'Subjects');
    
    // Summary sheet
    const summaryData = [
      ['Metric', 'Value'],
      ['Student', report.studentName],
      ['Class', `${report.class} ${report.classArm}`],
      ['Class Teacher', report.classTeacher],
      ['Term', term.term],
      ['Total Score', term.summary.totalScore],
      ['Average', `${term.summary.average.toFixed(1)}%`],
      ['Position', `${term.summary.position}/${term.summary.classSize}`],
      ['Overall Grade', term.summary.grade],
      [],
      ['Attendance', ''],
      ['Present', term.attendance.present],
      ['Total', term.attendance.total],
      ['Percentage', `${term.attendance.percentage}%`],
      [],
      ['Remarks', ''],
      ['Class Teacher', term.remarks.classTeacher],
      ['Principal', term.remarks.principal]
    ];
    
    const wsSummary = utils.aoa_to_sheet(summaryData);
    utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    // Write and download
    writeFile(wb, `${filename}.xlsx`);
  };

  return {
    exportToPDF,
    exportToCSV,
    exportToExcel
  };
};