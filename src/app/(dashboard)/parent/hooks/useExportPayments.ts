
export type ExportFormat = 'pdf' | 'csv' | 'excel';

// Custom hook for export functionality
export const useExportPayments = () => {
    const exportToPDF = (payments: any[], studentName: string, filename: string = 'payments') => {
        const printWindow = window.open('', '_blank');
        if (printWindow && payments.length > 0) {
            const paymentRows = payments.map(payment => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 6px;">${payment.description}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">₦${payment.amount.toLocaleString()}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">${payment.date}</td>
          <td style="border: 1px solid #ddd; padding: 6px;">
            <span style="padding: 2px 6px; border-radius: 3px; font-size: 10px; 
              ${payment.status === 'paid' ? 'background: #d4edda; color: #155724;' : 'background: #fff3cd; color: #856404;'}">
              ${payment.status}
            </span>
          </td>
        </tr>
      `).join('');

            const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
            const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
            const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);

            printWindow.document.write(`
        <html>
          <head>
            <title>Payment History - ${studentName}</title>
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
              <h1>Payment History</h1>
              <p>Student: ${studentName}</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Payments: ${payments.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Payment Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">₦${totalAmount.toLocaleString()}</div>
                  <div class="summary-label">Total Amount</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">₦${paidAmount.toLocaleString()}</div>
                  <div class="summary-label">Total Paid</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">₦${pendingAmount.toLocaleString()}</div>
                  <div class="summary-label">Total Pending</div>
                </div>
              </div>
            </div>

            <h3 style="margin: 0 0 10px 0; color: #1a365d;">Payment Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${paymentRows}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Payment Records - For Parent/Guardian Use Only</p>
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

    const exportToCSV = (payments: any[], studentName: string, filename: string = 'payments') => {
        const headers = [
            'Student',
            'Description',
            'Amount',
            'Date',
            'Status'
        ];

        const csvContent = [
            headers.join(','),
            ...payments.map(payment => [
                `"${payment.student.replace(/"/g, '""')}"`,
                `"${payment.description.replace(/"/g, '""')}"`,
                payment.amount,
                payment.date,
                payment.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToExcel = (payments: any[], studentName: string, filename: string = 'payments') => {
        const headers = [
            'Student',
            'Description',
            'Amount',
            'Date',
            'Status'
        ];

        const csvContent = [
            headers.join(','),
            ...payments.map(payment => [
                `"${payment.student.replace(/"/g, '""')}"`,
                `"${payment.description.replace(/"/g, '""')}"`,
                payment.amount,
                payment.date,
                payment.status
            ].join(','))
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