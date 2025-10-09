'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Download, Sheet, FileDown, FileText } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportPayments = () => {
  const exportToCSV = (payments: any[], filename: string = 'payments') => {
    if (!payments.length) return;
    
    const headers = [
      'Student',
      'Student ID',
      'Class', 
      'Payment For', 
      'Amount', 
      'Date', 
      'Due Date', 
      'Status',
      'Method',
      'Reference'
    ];
    
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        `"${payment.student.replace(/"/g, '""')}"`,
        payment.studentId,
        payment.class,
        `"${payment.paymentFor}"`,
        payment.amount,
        `"${payment.date || 'N/A'}"`,
        `"${payment.dueDate}"`,
        payment.status,
        `"${payment.method || 'N/A'}"`,
        `"${payment.reference || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (payments: any[], filename: string = 'payments') => {
    if (!payments.length) return;
    
    const headers = [
      'Student',
      'Student ID',
      'Class', 
      'Payment For', 
      'Amount', 
      'Date', 
      'Due Date', 
      'Status',
      'Method',
      'Reference'
    ];
    
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        `"${payment.student.replace(/"/g, '""')}"`,
        payment.studentId,
        payment.class,
        `"${payment.paymentFor}"`,
        payment.amount,
        `"${payment.date || 'N/A'}"`,
        `"${payment.dueDate}"`,
        payment.status,
        `"${payment.method || 'N/A'}"`,
        `"${payment.reference || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (payments: any[], filename: string = 'payments') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && payments.length > 0) {
      const paymentData = payments.map(payment => `
        <tr>
          <td>${payment.student}</td>
          <td>${payment.studentId}</td>
          <td>${payment.class}</td>
          <td>${payment.paymentFor}</td>
          <td>₦${payment.amount.toLocaleString()}</td>
          <td>${payment.date || '-'}</td>
          <td>${payment.dueDate}</td>
          <td>${payment.status}</td>
          <td>${payment.method || '-'}</td>
          <td>${payment.reference || '-'}</td>
        </tr>
      `).join('');

      const totalCollected = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);
      const pendingPayments = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0);
      const collectionRate = payments.length > 0 
        ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100)
        : 0;

      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Records - ${filename}</title>
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
                padding: 6px; 
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
              .status-paid { background-color: #d4edda; color: #155724; }
              .status-pending { background-color: #fff3cd; color: #856404; }
              .status-overdue { background-color: #f8d7da; color: #721c24; }
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
              <h1>Payment Management Records</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Payments: ${payments.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Payment Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">₦${totalCollected.toLocaleString()}</div>
                  <div class="summary-label">Total Collected</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">₦${pendingPayments.toLocaleString()}</div>
                  <div class="summary-label">Pending Payments</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${collectionRate}%</div>
                  <div class="summary-label">Collection Rate</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Payment For</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                ${paymentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Payment Records - For Administrative Use Only</p>
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

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026',
    term: '1st',
    class: 'all',
    student: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { usePayments } = useAdminQueries();

  const { data: paymentsResponse, isLoading } = usePayments({
    academicYear: filters.academicYear,
    term: filters.term,
    class: filters.class,
    student: filters.student,
    status: filters.status,
    search: searchTerm
  });

  const { exportToCSV, exportToExcel, exportToPDF } = useExportPayments();

  const payments = paymentsResponse?.data || [];

  const handleExport = (format: ExportFormat) => {
    if (payments.length === 0) {
      toast.error('No payments available to export');
      return;
    }

    try {
      const filename = `payments_${filters.academicYear}_${filters.term}`;
      switch (format) {
        case 'csv':
          exportToCSV(payments, filename);
          toast.success(`Exported ${payments.length} payments as CSV`);
          break;
        case 'excel':
          exportToExcel(payments, filename);
          toast.success(`Exported ${payments.length} payments as Excel`);
          break;
        case 'pdf':
          exportToPDF(payments, filename);
          toast.success(`Exported ${payments.length} payments as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export payments. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalCollected = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const collectionRate = payments.length > 0 
      ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100)
      : 0;

    return {
      totalCollected,
      pendingPayments,
      collectionRate
    };
  }, [payments]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">View and manage all student payments</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={filters.academicYear} onValueChange={(value) => setFilters({...filters, academicYear: value})}>
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
                <Select value={filters.term} onValueChange={(value) => setFilters({...filters, term: value})}>
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
                <Select value={filters.class} onValueChange={(value) => setFilters({...filters, class: value})}>
                  <SelectTrigger>
                    <SelectValue>All Classes</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                    <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                    <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Student</label>
                <Select value={filters.student} onValueChange={(value) => setFilters({...filters, student: value})}>
                  <SelectTrigger>
                    <SelectValue>All Students</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Smith">Michael Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue>All Status</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {payments.length} payments found
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className='dark:text-white dark:border-white'>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
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
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>All payment transactions and records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Payment For</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.student}</TableCell>
                    <TableCell>{payment.class}</TableCell>
                    <TableCell>{payment.paymentFor}</TableCell>
                    <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.date || '-'}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        payment.status === 'paid' ? 'default' :
                        payment.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.reference || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">₦{summaryStats.totalCollected.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Collected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">₦{summaryStats.pendingPayments.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Pending Payments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{summaryStats.collectionRate}%</div>
                  <div className="text-sm text-muted-foreground">Collection Rate</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}