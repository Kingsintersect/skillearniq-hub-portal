
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026',
    term: '1st',
    class: 'all',
    student: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    {
      id: 1,
      student: 'Alex Johnson',
      class: 'JSS 2A',
      paymentFor: 'Term 1 Tuition Fee',
      amount: 250000,
      date: '2025-01-15',
      dueDate: '2025-01-31',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'REF2025001'
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      class: 'JSS 1B',
      paymentFor: 'Term 1 Tuition Fee',
      amount: 250000,
      date: '2025-01-15',
      dueDate: '2025-01-31',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'REF2025002'
    },
    {
      id: 3,
      student: 'Michael Smith',
      class: 'JSS 2A',
      paymentFor: 'Term 1 Tuition Fee',
      amount: 250000,
      date: '',
      dueDate: '2025-01-31',
      status: 'pending',
      method: '',
      reference: ''
    },
    {
      id: 4,
      student: 'Emma Wilson',
      class: 'JSS 1A',
      paymentFor: 'Science Lab Fee',
      amount: 50000,
      date: '2025-01-20',
      dueDate: '2025-02-15',
      status: 'paid',
      method: 'Online Payment',
      reference: 'REF2025004'
    }
  ];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentFor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filters.class === 'all' || payment.class === filters.class;
    const matchesStatus = filters.status === 'all' || payment.status === filters.status;
    const matchesStudent = filters.student === 'all' || payment.student === filters.student;
    
    return matchesSearch && matchesClass && matchesStatus && matchesStudent;
  });

  const handleExport = () => {
    toast.success('Payment report exported successfully');
  };

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
                {filteredPayments.length} payments found
              </div>
              <Button variant="outline" onClick={handleExport}  className='dark:text-white dark:border-white'>
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
                {filteredPayments.map((payment) => (
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
                  <div className="text-2xl font-bold text-green-600">₦600,000</div>
                  <div className="text-sm text-muted-foreground">Total Collected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">₦250,000</div>
                  <div className="text-sm text-muted-foreground">Pending Payments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">71%</div>
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