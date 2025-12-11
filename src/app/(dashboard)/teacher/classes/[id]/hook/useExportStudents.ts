import z from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
export type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
export const useExportStudents = () => {
  const exportToCSV = (students: any[], filename: string = 'students') => {
    if (!students.length) return;

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Class', 'Enrollment Date', 'Average Score', 'Status'];

    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        `"${student.name.replace(/"/g, '""')}"`,
        `"${student.email}"`,
        `"${student.phone || 'N/A'}"`,
        `"${student.className || 'N/A'}"`,
        `"${new Date(student.enrollmentDate).toLocaleDateString()}"`,
        student.averageScore || '0',
        student.status || 'Active',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (students: any[], filename: string = 'students') => {
    // For Excel, we'll create a CSV with proper formatting that Excel can open
    if (!students.length) return;

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Class', 'Enrollment Date', 'Average Score', 'Status'];

    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        `"${student.name.replace(/"/g, '""')}"`,
        `"${student.email}"`,
        `"${student.phone || 'N/A'}"`,
        `"${student.className || 'N/A'}"`,
        `"${new Date(student.enrollmentDate).toLocaleDateString()}"`,
        student.averageScore || '0',
        student.status || 'Active',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (students: any[], filename: string = 'students') => {
    // Create a printable HTML page with all student data
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const studentData = students.map(student => `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.phone || 'N/A'}</td>
          <td>${student.className || 'N/A'}</td>
          <td>${new Date(student.enrollmentDate).toLocaleDateString()}</td>
          <td>${student.averageScore || 0}%</td>
          <td>${student.status || 'Active'}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
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
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                font-size: 12px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 10px; 
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
              .summary {
                margin-top: 20px;
                padding: 15px;
                background-color: #f0f9ff;
                border-radius: 5px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student List - ${filename}</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Students: ${students.length}</p>
            </div>

            <div class="summary">
              <strong>Summary:</strong> Showing ${students.length} student(s) with complete academic records.
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Enrollment Date</th>
                  <th>Average Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${studentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Student Data - For Educational Use Only</p>
              <p>Page generated by School Management System</p>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Print PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
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