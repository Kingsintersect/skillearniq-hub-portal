
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  Sheet, 
  FileDown, 
  Filter, 
  Search, 
  RefreshCw, 
  User, 
  Loader2, 
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  FileUp
} from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PaymentsPage() {
  const { selectedChild, children } = useParentStore();
  const { payments, summary, loading, error, refetch } = usePaymentHistory();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    // Tab filter
    if (activeTab !== 'all' && payment.status !== activeTab) {
      return false;
    }
    
    // Manual status filter (if different from tab)
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !payment.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  // Calculate completion percentage
  const completionPercentage = summary?.totalCount 
    ? ((summary.paidCount || 0) / summary.totalCount) * 100 
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-bold">Payment History</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Track and manage payment records for your children
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={refetch} 
              variant="outline"
              size="lg"
              disabled={loading}
              className="h-11 px-4"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Error Loading Payments</h3>
                  <p className="text-destructive text-sm mb-3">{error}</p>
                  <Button 
                    onClick={refetch}
                    variant="outline"
                    size="sm"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Child Selected */}
        {!selectedChild && children.length > 0 && (
          <Card className="mb-6 border-yellow-200">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
                <User className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 text-lg mb-2">Select a Student</h3>
              <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                Use the student selector in the header to choose a student and view their payment history
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="p-12 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <p className="mt-4 font-medium">Loading payment history</p>
                <p className="text-sm text-muted-foreground mt-1">Fetching records for {selectedChild?.first_name}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Only show when selected child exists and not loading */}
        {selectedChild && !loading && (
          <>
            {/* Student Profile Card */}
            <Card className="mb-6">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 md:h-10 md:w-10" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">{selectedChild.first_name} {selectedChild.last_name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-muted">
                          <CreditCard className="h-3 w-3 mr-1" />
                          ID: {selectedChild.id}
                        </Badge>
                        <Badge variant="outline" className="bg-muted">
                          {selectedChild.email}
                        </Badge>
                        {selectedChild.phone && (
                          <Badge variant="outline" className="bg-muted">
                            {selectedChild.phone}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold">{summary?.totalCount || 0}</div>
                      <div className="text-muted-foreground text-sm md:text-base">Total Payments</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(summary?.totalAmount || 0)} total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {summary && summary.totalCount > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(summary.totalAmount || 0)}</div>
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                        <div className="text-xs text-primary mt-1">{summary.totalCount} payments</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(summary.paidAmount || 0)}</div>
                        <div className="text-sm text-muted-foreground">Paid</div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">{summary.paidCount} completed</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(summary.pendingAmount || 0)}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                        <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">{summary.pendingCount} awaiting</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(summary.overdueAmount || 0)}</div>
                        <div className="text-sm text-muted-foreground">Overdue</div>
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">{summary.overdueCount} overdue</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardContent className="p-4 md:p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Completion</div>
                        <div className="text-sm font-bold text-primary">{Math.round(completionPercentage)}%</div>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {summary.paidCount} of {summary.totalCount} payments completed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters & Search Section */}
            <Card className="mb-6">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Payment Records</h3>
                    <p className="text-sm text-muted-foreground">Filter and search through payment history</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Tabs for Mobile/Tablet */}
                    <div className="lg:hidden">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-4 w-full">
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="paid" className="text-xs">Paid</TabsTrigger>
                          <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                          <TabsTrigger value="overdue" className="text-xs">Overdue</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    {/* Desktop Status Filter */}
                    <div className="hidden lg:block">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search payments, reference, amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setStatusFilter('all');
                          setActiveTab('all');
                          setSearchTerm('');
                        }}
                      >
                        Clear
                      </Button>
                      
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                            <Sheet className="h-4 w-4 mr-2" />
                            Export as CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                            <FileText className="h-4 w-4 mr-2" />
                            Export as PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                            <FileDown className="h-4 w-4 mr-2" />
                            Export as Excel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments Content */}
            {filteredPayments.length === 0 ? (
              <Card>
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="inline-flex flex-col items-center max-w-sm mx-auto">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileUp className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {payments.length === 0 ? 'No Payment Records' : 'No Matching Payments'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {payments.length === 0 
                        ? `No payment records found for ${selectedChild.first_name}. Payment records will appear here once payments are made.`
                        : 'No payments match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    {payments.length > 0 && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setStatusFilter('all');
                          setActiveTab('all');
                          setSearchTerm('');
                        }}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Mobile/Tablet View */}
                <div className="lg:hidden space-y-4">
                  {filteredPayments.map((payment) => (
                    <Card key={payment.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">{payment.invoiceNumber}</div>
                          </div>
                          <Badge 
                            variant={
                              payment.status === 'paid' ? 'default' :
                              payment.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                            className="capitalize"
                          >
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{payment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Due Date</div>
                            <div className="font-medium">{formatDate(payment.dueDate)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payment Date</div>
                            <div className="font-medium">{formatDate(payment.paymentDate)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div className="font-medium">{formatDate(payment.createdAt)}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">Transaction ID: {payment.transactionId}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Download Receipt</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop View */}
                <Card className="hidden lg:block overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Payment History</CardTitle>
                        <CardDescription>
                          {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found • 
                          Total: {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredPayments.length} of {payments.length} records
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-semibold">Reference</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Due Date</TableHead>
                            <TableHead className="font-semibold">Payment Date</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Created</TableHead>
                            <TableHead className="font-semibold w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment) => (
                            <TableRow key={payment.id} className="hover:bg-muted/50">
                              <TableCell className="font-mono text-sm">
                                <div className="font-medium">{payment.invoiceNumber}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{payment.transactionId}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium max-w-[200px] truncate" title={payment.description}>
                                  {payment.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold">{formatCurrency(payment.amount)}</div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(payment.dueDate)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>{formatDate(payment.paymentDate)}</div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    payment.status === 'paid' ? 'default' :
                                    payment.status === 'pending' ? 'secondary' :
                                    'destructive'
                                  }
                                  className="capitalize px-3 py-1"
                                >
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-2">{payment.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>{formatDate(payment.createdAt)}</div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Download Receipt</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Footer */}
                {filteredPayments.length > 0 && (
                  <Card className="mt-6">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">Payment Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} displayed
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {summary?.paidCount || 0} of {payments.length} payments completed
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payments.length > 0 
                                ? `${Math.round(((summary?.paidCount || 0) / payments.length) * 100)}% completion rate`
                                : 'No payments to calculate rate'
                              }
                            </div>
                          </div>
                          <Separator orientation="vertical" className="hidden sm:block h-8" />
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                            </div>
                            <div className="text-sm text-muted-foreground">Total displayed amount</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}