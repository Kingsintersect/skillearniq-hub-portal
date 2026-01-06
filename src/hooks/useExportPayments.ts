// app/dashboard/parent/hooks/useExportPayments.ts
import { Payment } from '@/store/parentStore';
import { ExportFormat } from '@/store/parentStore';

export const useExportPayments = () => {
  const exportToPDF = (payments: Payment[], studentName: string, filename: string) => {
    console.log('Exporting to PDF:', { studentName, filename, paymentsCount: payments.length });
    // Implement PDF export logic here
    alert(`PDF export for ${studentName} would be implemented here`);
  };

  const exportToCSV = (payments: Payment[], studentName: string, filename: string) => {
    console.log('Exporting to CSV:', { studentName, filename, paymentsCount: payments.length });
    
    const headers = ['Reference #', 'Description', 'Amount', 'Due Date', 'Payment Date', 'Status', 'Created'];
    
    const csvRows = [
      headers.join(','),
      ...payments.map(p => [
        p.invoiceNumber,
        `"${p.description.replace(/"/g, '""')}"`,
        p.amount,
        p.dueDate || '',
        p.paymentDate || '',
        p.status,
        p.createdAt
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToExcel = (payments: Payment[], studentName: string, filename: string) => {
    console.log('Exporting to Excel:', { studentName, filename, paymentsCount: payments.length });
    // Implement Excel export logic here
    alert(`Excel export for ${studentName} would be implemented here`);
  };

  return {
    exportToPDF,
    exportToCSV,
    exportToExcel
  };
};