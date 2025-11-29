'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Sheet, FileDown } from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { toast } from 'sonner';
import { useParentPayments } from '../hooks/useParentPayments';
import { ExportFormat, useExportPayments } from '../hooks/useExportPayments';


export default function PaymentsPage() {
  const { selectedChild } = useParentStore();
  const { exportToPDF, exportToCSV, exportToExcel } = useExportPayments();

  const {
    // payments: paymentsResponse,
    isPaymentsLoading: isLoading,
    filteredPayments
  } = useParentPayments();

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);

  const handleExportPayments = (format: ExportFormat) => {
    if (filteredPayments.length === 0) {
      toast.error('No payment records available to export');
      return;
    }

    try {
      const studentName = selectedChild?.first_name || 'All_Children';
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
            {selectedChild
              ? <>View payment history for <span className="text-green-500 font-bold">{selectedChild.first_name}</span></>
              : 'View payment history for your children'
            }
          </p>
        </div>

        {!selectedChild && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Please select a student from the sidebar to view payment history.
              </div>
            </CardContent>
          </Card>
        )}

        {selectedChild && filteredPayments.length === 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No payment records found for {selectedChild.first_name}.
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
                    <div className="">
                      {selectedChild
                        ? <>All transactions for <span className='text-green-500 font-bold'>{selectedChild.first_name}</span></>
                        : 'All transactions and payment records for your children'
                      }
                      <br />
                    </div>
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
                      <TableCell className="font-medium">{payment.studentName}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.createdAt}</TableCell>
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