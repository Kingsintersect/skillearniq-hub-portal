'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';

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

  const payments = paymentsResponse?.data || [];

  const handleExport = () => {
    console.log('Export payments');
  };

  // Calculate summary statistics
  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const collectionRate = payments.length > 0 
    ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading payments...</div>
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
              <Button variant="outline" onClick={handleExport} className='dark:text-white dark:border-white'>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
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
                  <div className="text-2xl font-bold text-green-600">₦{totalCollected.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Collected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">₦{pendingPayments.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Pending Payments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{collectionRate}%</div>
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