'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Loader2,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function DashboardCard({ title, subtitle, icon, action, children }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {children}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

function StatPill({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      {trend && <p className="mt-1 text-[10px] text-muted-foreground">{trend}</p>}
    </div>
  );
}

export default function PaymentsPage() {
  const { usePaymentStats } = useStudentQueries();
  const { data: paymentResponse, isLoading, error } = usePaymentStats();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const paymentData = paymentResponse?.data;
  const studentPayments = paymentData?.studentPayments || paymentData;
  const summary = studentPayments?.summary || {
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    totalDue: 0
  };
  
  const payments = studentPayments?.payments || [];

  const filteredPayments = useMemo(() => {
    if (!mounted) return [];
    return payments.filter((payment: any) => {
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, searchQuery, mounted]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'overdue': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const paidPercentage = summary.totalDue > 0 ? (summary.totalPaid / summary.totalDue) * 100 : 0;
  const pendingPercentage = summary.totalDue > 0 ? (summary.totalPending / summary.totalDue) * 100 : 0;

  if (isLoading || !mounted) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">Loading payment information...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error loading payment data</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Financial Hub</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Payment Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              View and manage your payment records, track outstanding balances, and make secure payments.
            </p>
          </div>
          <Link href="/enrollment">
            <Button variant="secondary" className="gap-2">
              <CreditCard size={16} />
              Make New Payment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Due</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(summary.totalDue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <DollarSign size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Paid Amount</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalPaid)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle size={18} />
              </div>
            </div>
            <Progress value={paidPercentage} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{paidPercentage.toFixed(1)}% of total due</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">{formatCurrency(summary.totalPending)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Clock size={18} />
              </div>
            </div>
            <Progress value={pendingPercentage} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{pendingPercentage.toFixed(1)}% of total due</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(summary.totalOverdue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <AlertCircle size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={16} className="text-primary" />
          <p className="text-sm font-semibold text-foreground">Filter Payments</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Search Payments</p>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by description or reference..."
                className="h-10 w-full rounded-xl border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Payment Status</p>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Payments Table */}
      <DashboardCard
        title="Payment History"
        subtitle={`Showing ${filteredPayments.length} payment(s)${statusFilter !== 'all' ? ` - ${statusFilter} payments` : ''}`}
        icon={<Receipt size={18} />}
      >
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-base font-medium text-foreground">No Payment Records</p>
            <p className="text-sm text-muted-foreground mt-1">
              {payments.length === 0 
                ? "You don't have any payment records yet."
                : "No payments match your current filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left text-sm">
                  <th className="pb-3 font-semibold text-foreground">Reference</th>
                  <th className="pb-3 font-semibold text-foreground">Description</th>
                  <th className="pb-3 font-semibold text-foreground">Amount</th>
                  <th className="pb-3 font-semibold text-foreground">Due Date</th>
                  <th className="pb-3 font-semibold text-foreground">Payment Date</th>
                  <th className="pb-3 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.map((payment: any, idx: number) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 font-mono text-sm text-foreground">{payment.referenceNumber}</td>
                    <td className="py-3">
                      <div className="font-medium text-foreground">{payment.description}</div>
                      {payment.program && (
                        <div className="text-xs text-muted-foreground">{payment.program}</div>
                      )}
                    </td>
                    <td className="py-3 font-semibold text-foreground">{formatCurrency(payment.amount)}</td>
                    <td className="py-3">
                      {payment.dueDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-sm">{format(new Date(payment.dueDate), 'MMM dd, yyyy')}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      {payment.paymentDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-sm">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not paid</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge className={`${getStatusColor(payment.status)} border`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {/* Payment Analytics */}
      {studentPayments?.analytics && (
        <DashboardCard
          title="Payment Analytics"
          subtitle="Breakdown of your payment status"
          icon={<TrendingUp size={18} />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-semibold text-foreground mb-3">By Status</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <Badge variant="default" className="bg-emerald-100 text-emerald-700">
                    {studentPayments.analytics.byStatus.paid}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    {studentPayments.analytics.byStatus.pending}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <Badge variant="destructive" className="bg-red-100 text-red-700">
                    {studentPayments.analytics.byStatus.overdue}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Payment Summary</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-foreground">{formatCurrency(summary.totalDue)}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-600">Paid</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(summary.totalPaid)}</span>
                  </div>
                  <Progress value={paidPercentage} className="h-2 bg-emerald-100 [&>div]:bg-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-600">Pending</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(summary.totalPending)}</span>
                  </div>
                  <Progress value={pendingPercentage} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}