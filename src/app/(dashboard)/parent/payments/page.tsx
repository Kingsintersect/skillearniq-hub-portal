'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Sheet, FileDown } from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';
import { toast } from 'sonner';

type ExportFormat = 'pdf' | 'csv' | 'excel';

// Custom hook for export functionality
const useExportPayments = () => {
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

export default function PaymentsPage() {
  const { selectedStudentId, children } = useParentStore();
  const { usePaymentHistory } = useParentQueries();
  const { exportToPDF, exportToCSV, exportToExcel } = useExportPayments();

  const { data: paymentsResponse, isLoading } = usePaymentHistory(selectedStudentId || undefined);

  // Use API data directly - no mock data needed
  const payments = paymentsResponse?.data || [];

  const selectedStudent = children.find(child => child.id === selectedStudentId);

  // The parent service already filters by childId, so we can use the payments directly
  const filteredPayments = payments;

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);

  const handleExportPayments = (format: ExportFormat) => {
    if (filteredPayments.length === 0) {
      toast.error('No payment records available to export');
      return;
    }

    try {
      const studentName = selectedStudent?.name || 'All_Children';
      const filename = `payments_${studentName.replace(/\s+/g, '_')}`;

      switch (format) {
        case 'pdf':
          exportToPDF(filteredPayments, studentName, filename);
          toast.success(`Exported payment history as PDF`);
          break;
        case 'csv':
          exportToCSV(filteredPayments, studentName, filename);
          toast.success(`Exported payment history as CSV`);
          break;
        case 'excel':
          exportToExcel(filteredPayments, studentName, filename);
          toast.success(`Exported payment history as Excel`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export payment history. Please try again.');
      console.error('Export error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            {selectedStudent
              ? `View payment history for ${selectedStudent.name}`
              : 'View payment history for your children'
            }
          </p>
        </div>

        {!selectedStudent && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Please select a student from the sidebar to view payment history.
              </div>
            </CardContent>
          </Card>
        )}

        {selectedStudent && filteredPayments.length === 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No payment records found for {selectedStudent.name}.
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPayments.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    {selectedStudent
                      ? `All transactions for ${selectedStudent.name}`
                      : 'All transactions and payment records for your children'
                    }
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleExportPayments('pdf')}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExportPayments('csv')}
                      className="flex items-center space-x-2"
                    >
                      <Sheet className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExportPayments('excel')}
                      className="flex items-center space-x-2"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.student}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="text-2xl font-bold text-blue-600">₦{totalAmount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="text-2xl font-bold text-green-600">₦{paidAmount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="text-2xl font-bold text-orange-600">₦{pendingAmount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Pending</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Summary</h4>
                    <p className="text-sm text-muted-foreground">2025-2026 Academic Year - 1st Term</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {filteredPayments.filter(p => p.status === 'paid').length} of {filteredPayments.length} payments completed
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {((filteredPayments.filter(p => p.status === 'paid').length / filteredPayments.length) * 100).toFixed(1)}% completion rate
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