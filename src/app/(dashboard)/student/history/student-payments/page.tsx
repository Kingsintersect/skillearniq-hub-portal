'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Download, 
  Filter,
  Search,
  FileText,
  Sheet,
  FileDown,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  DollarSign,
  Calendar
} from 'lucide-react';

type ExportFormat = 'csv' | 'excel' | 'pdf';
type PaymentStatus = 'all' | 'paid' | 'pending' | 'overdue' | 'cancelled';
type PaymentType = 'all' | 'tuition' | 'exam' | 'library' | 'sports' | 'transport' | 'other';

// Custom hook for export functionality
const useExportPayments = () => {
  const exportToCSV = (payments: any[], filters: any, filename: string = 'payment-history') => {
    if (!payments.length) return;
    
    const headers = [
      'Payment ID',
      'Description', 
      'Type', 
      'Amount', 
      'Due Date', 
      'Payment Date', 
      'Status', 
      'Reference Number',
      'Payment Method',
      'Academic Year',
      'Term'
    ];
    
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.id,
        `"${payment.description.replace(/"/g, '""')}"`,
        payment.type,
        payment.amount,
        `"${new Date(payment.dueDate).toLocaleDateString()}"`,
        payment.paymentDate ? `"${new Date(payment.paymentDate).toLocaleDateString()}"` : 'N/A',
        payment.status,
        payment.referenceNumber || 'N/A',
        payment.paymentMethod || 'N/A',
        payment.academicYear,
        payment.term
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (payments: any[], filters: any, filename: string = 'payment-history') => {
    if (!payments.length) return;
    
    const headers = [
      'Payment ID',
      'Description', 
      'Type', 
      'Amount', 
      'Due Date', 
      'Payment Date', 
      'Status', 
      'Reference Number',
      'Payment Method',
      'Academic Year',
      'Term'
    ];
    
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.id,
        `"${payment.description.replace(/"/g, '""')}"`,
        payment.type,
        payment.amount,
        `"${new Date(payment.dueDate).toLocaleDateString()}"`,
        payment.paymentDate ? `"${new Date(payment.paymentDate).toLocaleDateString()}"` : 'N/A',
        payment.status,
        payment.referenceNumber || 'N/A',
        payment.paymentMethod || 'N/A',
        payment.academicYear,
        payment.term
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (payments: any[], filters: any, filename: string = 'payment-history') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && payments.length > 0) {
      const paymentData = payments.map(payment => `
        <tr>
          <td>${payment.id}</td>
          <td>${payment.description}</td>
          <td>${payment.type}</td>
          <td>$${payment.amount.toFixed(2)}</td>
          <td>${new Date(payment.dueDate).toLocaleDateString()}</td>
          <td>${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
          <td>${payment.status}</td>
          <td>${payment.referenceNumber || 'N/A'}</td>
        </tr>
      `).join('');

      const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const paidAmount = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);
      const pendingAmount = payments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, payment) => sum + payment.amount, 0);

      printWindow.document.write(`
        <html>
          <head>
            <title>Payment History - ${filters.academicYear} ${filters.term} Term</title>
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
                font-size: 11px;
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
              .status-paid { background-color: #d4edda; color: #155724; }
              .status-pending { background-color: #fff3cd; color: #856404; }
              .status-overdue { background-color: #f8d7da; color: #721c24; }
              .status-cancelled { background-color: #e2e3e5; color: #383d41; }
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
              <h1>Student Payment History</h1>
              <p>${filters.academicYear} - ${filters.term} Term</p>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Payment Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">$${totalAmount.toFixed(2)}</div>
                  <div class="summary-label">Total Amount</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">$${paidAmount.toFixed(2)}</div>
                  <div class="summary-label">Paid Amount</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">$${pendingAmount.toFixed(2)}</div>
                  <div class="summary-label">Pending Amount</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Reference No.</th>
                </tr>
              </thead>
              <tbody>
                ${paymentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Official Payment Record - For Student Use Only</p>
              <p>Generated by School Management System • Confidential</p>
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

export const PaymentHistoryPage: React.FC = () => {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: 'all',
    status: 'all' as PaymentStatus,
    type: 'all' as PaymentType,
    searchQuery: ''
  });

  const { exportToCSV, exportToExcel, exportToPDF } = useExportPayments();

  // Mock payment data
  const paymentData = [
    {
      id: 'PAY-001',
      description: 'Tuition Fee - 1st Term',
      type: 'tuition',
      amount: 1500.00,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-10',
      status: 'paid',
      referenceNumber: 'REF-001234',
      paymentMethod: 'Bank Transfer',
      academicYear: '2024-2025',
      term: '1st'
    },
    {
      id: 'PAY-002',
      description: 'Examination Fee',
      type: 'exam',
      amount: 50.00,
      dueDate: '2024-02-01',
      paymentDate: null,
      status: 'pending',
      referenceNumber: null,
      paymentMethod: null,
      academicYear: '2024-2025',
      term: '1st'
    },
    {
      id: 'PAY-003',
      description: 'Library Fine',
      type: 'library',
      amount: 25.00,
      dueDate: '2024-01-20',
      paymentDate: null,
      status: 'overdue',
      referenceNumber: null,
      paymentMethod: null,
      academicYear: '2024-2025',
      term: '1st'
    },
    {
      id: 'PAY-004',
      description: 'Sports Activity Fee',
      type: 'sports',
      amount: 75.00,
      dueDate: '2024-01-25',
      paymentDate: '2024-01-22',
      status: 'paid',
      referenceNumber: 'REF-001235',
      paymentMethod: 'Credit Card',
      academicYear: '2024-2025',
      term: '1st'
    },
    {
      id: 'PAY-005',
      description: 'Transportation Fee',
      type: 'transport',
      amount: 200.00,
      dueDate: '2024-02-05',
      paymentDate: null,
      status: 'pending',
      referenceNumber: null,
      paymentMethod: null,
      academicYear: '2024-2025',
      term: '1st'
    },
    {
      id: 'PAY-006',
      description: 'Tuition Fee - 2nd Term',
      type: 'tuition',
      amount: 1500.00,
      dueDate: '2024-04-15',
      paymentDate: null,
      status: 'pending',
      referenceNumber: null,
      paymentMethod: null,
      academicYear: '2024-2025',
      term: '2nd'
    },
    {
      id: 'PAY-007',
      description: 'Lab Equipment Fee',
      type: 'other',
      amount: 100.00,
      dueDate: '2023-11-10',
      paymentDate: '2023-11-05',
      status: 'paid',
      referenceNumber: 'REF-001100',
      paymentMethod: 'Bank Transfer',
      academicYear: '2023-2024',
      term: '1st'
    },
    {
      id: 'PAY-008',
      description: 'Library Membership',
      type: 'library',
      amount: 30.00,
      dueDate: '2023-10-01',
      paymentDate: '2023-09-28',
      status: 'paid',
      referenceNumber: 'REF-001101',
      paymentMethod: 'Cash',
      academicYear: '2023-2024',
      term: '1st'
    }
  ];

  const academicYears = ['2024-2025', '2023-2024', '2022-2023'];
  const terms = ['all', '1st', '2nd', '3rd'];
  const statusOptions: { value: PaymentStatus; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  const typeOptions: { value: PaymentType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'tuition', label: 'Tuition' },
    { value: 'exam', label: 'Examination' },
    { value: 'library', label: 'Library' },
    { value: 'sports', label: 'Sports' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' }
  ];

  // Filter payments based on current filters
  const filteredPayments = useMemo(() => {
    return paymentData.filter(payment => {
      const matchesAcademicYear = payment.academicYear === filters.academicYear;
      const matchesTerm = filters.term === 'all' || payment.term === filters.term;
      const matchesStatus = filters.status === 'all' || payment.status === filters.status;
      const matchesType = filters.type === 'all' || payment.type === filters.type;
      const matchesSearch = payment.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          payment.id.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesAcademicYear && matchesTerm && matchesStatus && matchesType && matchesSearch;
    });
  }, [paymentData, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = filteredPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = filteredPayments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const paidCount = filteredPayments.filter(p => p.status === 'paid').length;
    const pendingCount = filteredPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length;

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      paidCount,
      pendingCount,
      totalCount: filteredPayments.length
    };
  }, [filteredPayments]);

  const handleExport = (format: ExportFormat) => {
    if (filteredPayments.length === 0) {
      toast.error('No payments available to export');
      return;
    }

    try {
      const filename = `payment-history-${filters.academicYear}-${filters.term}`;
      switch (format) {
        case 'csv':
          exportToCSV(filteredPayments, filters, filename);
          toast.success('Payment history exported as CSV successfully!');
          break;
        case 'excel':
          exportToExcel(filteredPayments, filters, filename);
          toast.success('Payment history exported as Excel successfully!');
          break;
        case 'pdf':
          exportToPDF(filteredPayments, filters, filename);
          toast.success('Payment history exported as PDF successfully!');
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export payment history. Please try again.');
      console.error('Export error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tuition':
        return 'bg-blue-100 text-blue-800';
      case 'exam':
        return 'bg-green-100 text-green-800';
      case 'library':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-orange-100 text-orange-800';
      case 'transport':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <CreditCard className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Payment History</h1>
          <p className="text-lg text-muted-foreground">View and manage your payment records</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-bold text-foreground">${summaryStats.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{summaryStats.totalCount} records</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold text-foreground">${summaryStats.paidAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{summaryStats.paidCount} paid</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold text-foreground">${summaryStats.pendingAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{summaryStats.pendingCount} pending</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-foreground">${summaryStats.pendingAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Due payments</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={filters.term}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>
                          {term === 'all' ? 'All Terms' : `${term} Term`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Payment Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value: PaymentStatus) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Payment Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value: PaymentType) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
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

            {/* Search Bar */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments by description or ID..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              Showing {filteredPayments.length} payment(s) for {filters.academicYear} 
              {filters.term !== 'all' && ` - ${filters.term} Term`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No payments found</h3>
                <p className="text-muted-foreground">
                  No payments match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.academicYear} • {payment.term} Term
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(payment.type)}>
                            {payment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate ? (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not paid</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(payment.status)} className="flex items-center space-x-1 w-24 justify-center">
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.referenceNumber ? (
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {payment.referenceNumber}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                            {payment.status === 'pending' || payment.status === 'overdue' ? (
                              <Button size="sm">
                                Pay Now
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;