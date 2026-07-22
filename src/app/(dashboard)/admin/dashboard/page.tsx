'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  UserCog,
  BookOpen,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { useTheme } from 'next-themes';
import { Progress } from '@/components/ui/progress';

// Sample data for charts (in production, this would come from the API)
const enrollmentData = [
  { month: 'Jan', students: 65, teachers: 12, parents: 45 },
  { month: 'Feb', students: 78, teachers: 14, parents: 52 },
  { month: 'Mar', students: 90, teachers: 16, parents: 58 },
  { month: 'Apr', students: 85, teachers: 18, parents: 62 },
  { month: 'May', students: 95, teachers: 20, parents: 70 },
  { month: 'Jun', students: 110, teachers: 22, parents: 78 },
  { month: 'Jul', students: 105, teachers: 24, parents: 85 },
  { month: 'Aug', students: 120, teachers: 26, parents: 92 },
  { month: 'Sep', students: 135, teachers: 28, parents: 100 },
  { month: 'Oct', students: 130, teachers: 30, parents: 108 },
  { month: 'Nov', students: 145, teachers: 32, parents: 115 },
  { month: 'Dec', students: 150, teachers: 34, parents: 120 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 28000 },
  { month: 'Feb', revenue: 52000, expenses: 30000 },
  { month: 'Mar', revenue: 48000, expenses: 32000 },
  { month: 'Apr', revenue: 58000, expenses: 31000 },
  { month: 'May', revenue: 62000, expenses: 33000 },
  { month: 'Jun', revenue: 70000, expenses: 35000 },
  { month: 'Jul', revenue: 68000, expenses: 38000 },
  { month: 'Aug', revenue: 75000, expenses: 36000 },
  { month: 'Sep', revenue: 82000, expenses: 39000 },
  { month: 'Oct', revenue: 78000, expenses: 41000 },
  { month: 'Nov', revenue: 85000, expenses: 42000 },
  { month: 'Dec', revenue: 90000, expenses: 45000 },
];

const courseDistribution = [
  { name: 'Computer Science', value: 35, color: '#293073' },
  { name: 'Mathematics', value: 25, color: '#FB6801' },
  { name: 'Physics', value: 20, color: '#C08A2D' },
  { name: 'Chemistry', value: 15, color: '#6B72B8' },
  { name: 'Biology', value: 5, color: '#9AA0D4' },
];

const attendanceData = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 92, absent: 8 },
  { day: 'Thu', present: 86, absent: 14 },
  { day: 'Fri', present: 90, absent: 10 },
];

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function DashboardCard({ title, subtitle, icon, action, children, className = '' }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm ${className}`}
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

function StatPill({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      {trend && <p className="mt-1 text-[10px] text-muted-foreground">{trend}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { useDashboardStats } = useAdminQueries();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Chart colors based on theme
  const chartColors = useMemo(() => ({
    text: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? '#334155' : '#e2e8f0',
    stroke: isDark ? '#475569' : '#cbd5e1',
    primary: '#293073',
    secondary: '#FB6801',
    accent: '#C08A2D',
    purple: '#6B72B8',
    red: '#ef4444',
  }), [isDark]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-xl p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-lg text-muted-foreground">Loading dashboard...</div>
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
            <div className="text-red-500 text-lg">Error loading dashboard</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
              <RefreshCw size={16} />
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Admin Portal</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              School management overview and analytics. Monitor key metrics across students, teachers, and financials.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="varsecondary" className="gap-2">
            <RefreshCw size={16} />
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats?.totalStudents || 0}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12 this month</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Teachers</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats?.totalTeachers || 0}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                <UserCheck size={18} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+2 this month</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Parents</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats?.totalParents || 0}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <UserCog size={18} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+8 this month</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Classes</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats?.activeClasses || 0}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <BookOpen size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Current term</p>
          </div>
        </div>
      </motion.section>

      {/* Charts Row 1 - Enrollment & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Enrollment Trends"
          subtitle="Monthly growth across all user types"
          icon={<TrendingUp size={18} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="teacherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} fontSize={11} />
              <YAxis stroke={chartColors.text} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: chartColors.text }} />
              <Area type="monotone" dataKey="students" stroke={chartColors.primary} fill="url(#studentGradient)" name="Students" />
              <Area type="monotone" dataKey="teachers" stroke={chartColors.secondary} fill="url(#teacherGradient)" name="Teachers" />
              <Area type="monotone" dataKey="parents" stroke={chartColors.accent} fill="none" name="Parents" />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          title="Revenue vs Expenses"
          subtitle="Monthly financial overview"
          icon={<DollarSign size={18} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} fontSize={11} />
              <YAxis stroke={chartColors.text} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: chartColors.text }} />
              <Bar dataKey="revenue" fill={chartColors.primary} name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill={chartColors.red} name="Expenses" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Charts Row 2 - Course Distribution & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Course Distribution"
          subtitle="Student enrollment by subject"
          icon={<PieChartIcon size={18} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={courseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: chartColors.text }} />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          title="Weekly Attendance"
          subtitle="Present vs Absent students"
          icon={<Calendar size={18} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="day" stroke={chartColors.text} fontSize={11} />
              <YAxis stroke={chartColors.text} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: chartColors.text }} />
              <Bar dataKey="present" fill={chartColors.secondary} name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill={chartColors.red} name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          title="Attendance Rate"
          subtitle="This week"
          icon={<Activity size={18} />}
        >
          <p className="text-3xl font-bold text-foreground">{stats?.attendanceRate || 0}%</p>
          <Progress value={stats?.attendanceRate || 0} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">+5% compared to last week</p>
        </DashboardCard>

        <DashboardCard
          title="Fee Collection"
          subtitle="This term"
          icon={<CreditCard size={18} />}
        >
          <p className="text-3xl font-bold text-foreground">{stats?.feeCollection || 0}%</p>
          <Progress value={stats?.feeCollection || 0} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">₦2,450,000 collected this term</p>
        </DashboardCard>

        <DashboardCard
          title="Active Users"
          subtitle="Currently online"
          icon={<Users size={18} />}
        >
          <p className="text-3xl font-bold text-foreground">42</p>
          <p className="text-xs text-muted-foreground mt-2">24 students • 12 teachers • 6 parents</p>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold text-card-foreground mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {[
            { href: '/admin/students', icon: Users, label: 'Students', color: 'blue' },
            { href: '/admin/teachers', icon: UserCheck, label: 'Teachers', color: 'green' },
            { href: '/admin/parents', icon: UserCog, label: 'Parents', color: 'purple' },
            { href: '/admin/messages', icon: MessageSquare, label: 'Messages', color: 'orange' },
            { href: '/admin/reports', icon: FileText, label: 'Reports', color: 'red' },
            { href: '/admin/payments', icon: CreditCard, label: 'Payments', color: 'indigo' },
            { href: '/admin/settings', icon: Settings, label: 'Settings', color: 'gray' },
            { href: '/admin/classes', icon: BookOpen, label: 'Classes', color: 'cyan' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="group cursor-pointer text-center p-3 rounded-2xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                <div className={`w-10 h-10 bg-${item.color}-500/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-${item.color}-500/20 transition-colors`}>
                  <item.icon className={`h-5 w-5 text-${item.color}-500`} />
                </div>
                <p className="text-xs font-medium text-foreground">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <DashboardCard
        title="Recent Activity"
        subtitle="Latest system activities and updates"
        icon={<Activity size={18} />}
      >
        <div className="space-y-3">
          {[
            { icon: UserCheck, label: 'New teacher registered', time: '2 hours ago', color: 'green' },
            { icon: Users, label: '5 new students enrolled', time: '5 hours ago', color: 'blue' },
            { icon: CreditCard, label: 'Fee payment received', time: '1 day ago', color: 'orange' },
            { icon: MessageSquare, label: '3 new messages from parents', time: '1 day ago', color: 'purple' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-2xl border border-border/50 bg-background/60 hover:bg-accent/40 transition-colors"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-${activity.color}-500/10 text-${activity.color}-500`}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.label}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

// Helper for className merging
function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}