// app/student/payments/page.tsx
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentQueries } from '@/hooks/useStudentQueries';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Receipt,
  Calendar,
  Filter,
  Search,
  FileText,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export const PaymentsPage: React.FC = () => {
  // All hooks must be called unconditionally - move them to the top
  const { usePaymentStats } = useStudentQueries();
  const { data: paymentResponse, isLoading, error } = usePaymentStats();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract data safely
  const paymentData = paymentResponse?.data;
  const studentPayments = paymentData?.studentPayments || paymentData;
  const summary = studentPayments?.summary || {
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    totalDue: 0
  };
  
  const payments = studentPayments?.payments || [];

  // Filter payments - this hook must be called unconditionally
  const filteredPayments = useMemo(() => {
    if (!mounted) return []; // Return empty array until component is mounted
    
    return payments.filter((payment: any) => {
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, searchQuery, mounted]);

  // Format currency - also unconditional
  const formatCurrency = useMemo(() => {
    return (amount: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  }, []);

  // Status functions - also unconditional
  const getStatusIcon = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case 'paid':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'pending':
          return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'overdue':
          return <AlertCircle className="h-4 w-4 text-red-500" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    };
  }, []);

  const getStatusVariant = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case 'paid':
          return 'default';
        case 'pending':
          return 'secondary';
        case 'overdue':
          return 'destructive';
        default:
          return 'secondary';
      }
    };
  }, []);

  // Loading state
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <div>Loading payment information...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error loading payment data</h3>
            <p className="text-muted-foreground">Please try again later</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Payment Management</h1>
              <p className="text-lg text-muted-foreground">View and manage your payment records</p>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Make New Payment
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(summary.totalDue)}
                  </p>
                  <p className="text-xs text-muted-foreground">All outstanding payments</p>
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
                  <p className="text-2xl font-bold  text-green-600">
                    {formatCurrency(summary.totalPaid)}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed payments</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold  text-orange-600">
                    {formatCurrency(summary.totalPending)}
                  </p>
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold  text-red-600">
                    {formatCurrency(summary.totalOverdue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Past due date</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Payments</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by description or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | 'pending' | 'paid' | 'overdue') => setStatusFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Showing {filteredPayments.length} payment(s)
              {statusFilter !== 'all' && ` - ${statusFilter} payments`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payment Records</h3>
                <p className="text-muted-foreground">
                  {payments.length === 0 
                    ? "You don't have any payment records yet."
                    : "No payments match your current filters."
                  }
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.referenceNumber}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.description}</div>
                          {payment.program && (
                            <div className="text-xs text-muted-foreground">{payment.program}</div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          {payment.dueDate ? (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(payment.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate ? (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not paid</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(payment.status)} 
                            className="flex items-center space-x-1 w-24 justify-center"
                          >
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Receipt className="h-4 w-4" />
                            </Button>
                            {(payment.status === 'pending' || payment.status === 'overdue') && (
                              <Button size="sm">
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Payment Analytics */}
            {studentPayments?.analytics && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Payment Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">By Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Paid</span>
                          <Badge variant="default">
                            {studentPayments.analytics.byStatus.paid}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pending</span>
                          <Badge variant="secondary">
                            {studentPayments.analytics.byStatus.pending}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overdue</span>
                          <Badge variant="destructive">
                            {studentPayments.analytics.byStatus.overdue}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm">Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Total Amount</span>
                            <span className="font-semibold">{formatCurrency(summary.totalDue)}</span>
                          </div>
                          <Progress 
                            value={100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-green-600">Paid</span>
                            <span className="font-semibold">{formatCurrency(summary.totalPaid)}</span>
                          </div>
                          <Progress 
                            value={summary.totalDue > 0 ? (summary.totalPaid / summary.totalDue) * 100 : 0} 
                            className="h-2 bg-green-100"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-orange-600">Pending</span>
                            <span className="font-semibold">{formatCurrency(summary.totalPending)}</span>
                          </div>
                          <Progress 
                            value={summary.totalDue > 0 ? (summary.totalPending / summary.totalDue) * 100 : 0} 
                            className="h-2 bg-orange-100"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Payment Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Bank Transfer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Name:</span>
                      <span>First Bank Nigeria</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number:</span>
                      <span className="font-mono">2034567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span>School Name Account</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Online Payment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click "Pay Now" on any pending payment to proceed with online payment.
                  </p>
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Payment Portal
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;