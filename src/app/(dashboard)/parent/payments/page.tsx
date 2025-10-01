
'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PaymentsPage() {
  const payments = [
    {
      id: 1,
      student: 'Alex Johnson',
      description: 'Term 1 Tuition Fee',
      amount: 250000,
      date: '2025-01-15',
      status: 'paid'
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      description: 'Term 1 Tuition Fee',
      amount: 250000,
      date: '2025-01-15',
      status: 'paid'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">View payment histories of your students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All transactions and payment records</CardDescription>
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
                {payments.map((payment) => (
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
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Total Paid This Term</h4>
                  <p className="text-sm text-muted-foreground">2025-2026 Academic Year - 1st Term</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦500,000</div>
                  <div className="text-sm text-muted-foreground">2 payments completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}