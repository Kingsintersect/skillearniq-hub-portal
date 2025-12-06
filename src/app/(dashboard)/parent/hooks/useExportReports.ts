import { StudentGradeReport, TermGrade } from "@/store/parentStore";

export const getOverallGrade = (average: number): string => {
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
export const useExportReports = () => {
  const exportToPDF = (gradeReport: StudentGradeReport, currentTerm: TermGrade, filename: string = 'grade_report') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && gradeReport) {
      const subjectRows = currentTerm.subjects.map((subject) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.subject}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.code}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.ca1}/20</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.ca2}/20</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.exam}/60</td>
          <td style="border: 1px solid #ddd; padding: 6px; font-weight: bold;">${subject.total}/100</td>
          <td style="border: 1px solid #ddd; padding: 6px;">
            <span style="padding: 2px 6px; border-radius: 3px; font-size: 10px; 
              ${subject.grade === 'A' ? 'background: #d4edda; color: #155724;' :
          subject.grade === 'B' ? 'background: #d1ecf1; color: #0c5460;' :
            subject.grade === 'C' ? 'background: #fff3cd; color: #856404;' :
              subject.grade === 'D' ? 'background: #ffeaa7; color: #856404;' :
                'background: #f8d7da; color: #721c24;'}">
              ${subject.grade}
            </span>
          </td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.position}/${currentTerm.summary.classSize}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${subject.remark}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Academic Report - ${gradeReport.studentName}</title>
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
              .remarks-section {
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
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
              <h1>STUDENT ACADEMIC REPORT</h1>
              <p>${currentTerm.term} TERM</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">STUDENT INFORMATION</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div><strong>Student Name:</strong> ${gradeReport.studentName}</div>
                <div><strong>Student ID:</strong> ${gradeReport.studentId}</div>
                <div><strong>Class:</strong> ${gradeReport.class} ${gradeReport.classArm}</div>
                <div><strong>Class Teacher:</strong> ${gradeReport.classTeacher}</div>
              </div>
              
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${currentTerm.summary.average.toFixed(1)}%</div>
                  <div class="summary-label">Overall Average</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${currentTerm.summary.position}</div>
                  <div class="summary-label">Class Position</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${currentTerm.attendance.percentage}%</div>
                  <div class="summary-label">Attendance</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${currentTerm.summary.grade}</div>
                  <div class="summary-label">Final Grade</div>
                </div>
              </div>
            </div>

            <h3 style="margin: 0 0 10px 0; color: #1a365d;">SUBJECT PERFORMANCE</h3>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>CA1 (20%)</th>
                  <th>CA2 (20%)</th>
                  <th>Exam (60%)</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Position</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                ${subjectRows}
              </tbody>
            </table>

            <div class="remarks-section">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">REMARKS</h3>
              <div style="margin-bottom: 15px;">
                <strong>Class Teacher's Remark:</strong><br>
                ${currentTerm.remarks.classTeacher}
              </div>
              <div>
                <strong>Principal's Remark:</strong><br>
                ${currentTerm.remarks.principal}
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

  const exportToCSV = (gradeReport: StudentGradeReport, currentTerm: TermGrade, filename: string = 'grade_report') => {
    const headers = [
      'Student Name',
      'Student ID',
      'Class',
      'Class Arm',
      'Term',
      'Overall Average',
      'Class Position',
      'Class Size',
      'Final Grade',
      'Attendance Percentage',
      'Days Present',
      'Total Days',
      'Subject',
      'Subject Code',
      'CA1 Score',
      'CA2 Score',
      'Exam Score',
      'Total Score',
      'Subject Grade',
      'Subject Position',
      'Subject Remark'
    ];

    const csvRows = currentTerm.subjects.map(subject => [
      `"${gradeReport.studentName.replace(/"/g, '""')}"`,
      gradeReport.studentId,
      gradeReport.class,
      gradeReport.classArm,
      currentTerm.term,
      currentTerm.summary.average.toFixed(1),
      currentTerm.summary.position,
      currentTerm.summary.classSize,
      currentTerm.summary.grade,
      currentTerm.attendance.percentage,
      currentTerm.attendance.present,
      currentTerm.attendance.total,
      `"${subject.subject.replace(/"/g, '""')}"`,
      subject.code,
      subject.ca1,
      subject.ca2,
      subject.exam,
      subject.total,
      subject.grade,
      subject.position,
      `"${subject.remark.replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${gradeReport.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (gradeReport: StudentGradeReport, currentTerm: TermGrade, filename: string = 'grade_report') => {
    const headers = [
      'Student Name',
      'Student ID',
      'Class',
      'Class Arm',
      'Term',
      'Overall Average',
      'Class Position',
      'Class Size',
      'Final Grade',
      'Attendance Percentage',
      'Days Present',
      'Total Days',
      'Subject',
      'Subject Code',
      'CA1 Score',
      'CA2 Score',
      'Exam Score',
      'Total Score',
      'Subject Grade',
      'Subject Position',
      'Subject Remark'
    ];

    const excelRows = currentTerm.subjects.map(subject => [
      `"${gradeReport.studentName.replace(/"/g, '""')}"`,
      gradeReport.studentId,
      gradeReport.class,
      gradeReport.classArm,
      currentTerm.term,
      currentTerm.summary.average.toFixed(1),
      currentTerm.summary.position,
      currentTerm.summary.classSize,
      currentTerm.summary.grade,
      currentTerm.attendance.percentage,
      currentTerm.attendance.present,
      currentTerm.attendance.total,
      `"${subject.subject.replace(/"/g, '""')}"`,
      subject.code,
      subject.ca1,
      subject.ca2,
      subject.exam,
      subject.total,
      subject.grade,
      subject.position,
      `"${subject.remark.replace(/"/g, '""')}"`
    ].join(','));

    const excelContent = [
      headers.join(','),
      ...excelRows
    ].join('\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${gradeReport.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return {
    exportToPDF,
    exportToCSV,
    exportToExcel
  };
};