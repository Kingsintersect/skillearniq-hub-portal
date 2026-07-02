'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  MessageSquare,
  Bell,
  Download,
  Eye,
  AlertCircle,
  Loader2,
  RefreshCw,
  GraduationCap,
  Video,
  ClipboardCheck,
  BarChart3,
  Zap
} from 'lucide-react';
import { useTeacherQueries } from '@/hooks/useTeacherQueries';
import { teacherService } from '@/lib/services/teacherService';

// Recharts components
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
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Dashboard Card Component - FIXED with className prop
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string; // Added className prop
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

function StatPill({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      {trend && <p className="mt-1 text-[10px] text-muted-foreground">{trend}</p>}
    </div>
  );
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
        <p className="text-foreground font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-foreground" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Define types
interface PerformanceTrendItem {
  date: string;
  averageScore: number | null;
  totalAssessments: number;
}

interface SubjectPerformanceItem {
  subject: string;
  averageScore: number;
  totalStudents: number;
  improvement: number;
}

interface AttendanceTrendItem {
  month: string;
  present: number;
  absent: number;
  rate: number;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  type: 'assessment' | 'attendance' | 'message' | 'grade';
  timestamp: string;
  class?: string;
}

export default function Dashboard() {
  const teacherId = 1; // This would come from auth context
  const { useDashboardData } = useTeacherQueries();
  const { data: dashboardResponse, isLoading, error, isError, refetch } = useDashboardData(teacherId);
  
  const [studentCount, setStudentCount] = useState<number>(0);
  const [classCount, setClassCount] = useState<number>(0);
  const [isFetchingFallbackData, setIsFetchingFallbackData] = useState(false);

  // Fetch fallback data if dashboard doesn't provide it
  useEffect(() => {
    const fetchFallbackData = async () => {
      const needsFallback = !dashboardResponse?.data?.totalStudents || 
                           !dashboardResponse?.data?.totalClasses ||
                           dashboardResponse?.data?.totalStudents === 0;
      
      if (needsFallback && dashboardResponse?.data) {
        setIsFetchingFallbackData(true);
        try {
          try {
            const studentsResponse = await teacherService.getStudentsPerCourse(teacherId);
            if (studentsResponse.data && Array.isArray(studentsResponse.data)) {
              setStudentCount(studentsResponse.data.length);
            }
          } catch (studentError) {
            console.error('Failed to fetch students count:', studentError);
          }

          try {
            const classesResponse = await teacherService.getClasses(teacherId);
            if (Array.isArray(classesResponse)) {
              setClassCount(classesResponse.length);
            }
          } catch (classError) {
            console.error('Failed to fetch classes count:', classError);
          }
        } catch (err) {
          console.error('Failed to fetch fallback data:', err);
        } finally {
          setIsFetchingFallbackData(false);
        }
      }
    };

    fetchFallbackData();
  }, [dashboardResponse, teacherId]);

  if (isLoading || isFetchingFallbackData) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">
              {isFetchingFallbackData ? 'Loading additional data...' : 'Loading dashboard...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error loading dashboard</div>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Please try again later'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
              <RefreshCw size={16} />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardResponse || !dashboardResponse.data) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg text-foreground">No dashboard data available</div>
            <p className="text-sm text-muted-foreground mt-2">The API returned an empty response.</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardResponse.data;

  const totalStudents = dashboardData.totalStudents > 0 ? dashboardData.totalStudents : studentCount;
  const totalClasses = dashboardData.totalClasses > 0 ? dashboardData.totalClasses : classCount;
  const totalAssessments = dashboardData.totalAssessments || 0;
  const averageAttendance = dashboardData.averageAttendance || 0;
  const pendingGrading = dashboardData.pendingGrading || 0;
  const upcomingDeadlines = dashboardData.upcomingDeadlines || 0;

  const safePerformanceTrend: PerformanceTrendItem[] = dashboardData.performanceTrend?.map((item: PerformanceTrendItem) => ({
    date: item.date || '',
    averageScore: item.averageScore || 0,
    totalAssessments: item.totalAssessments || 0
  })) || [];

  const safeSubjectPerformance: SubjectPerformanceItem[] = dashboardData.subjectPerformance?.map((item: SubjectPerformanceItem) => ({
    subject: item.subject || 'Unknown',
    averageScore: item.averageScore || 0,
    totalStudents: item.totalStudents || 0,
    improvement: item.improvement || 0
  })) || [];

  const safeAttendanceTrend: AttendanceTrendItem[] = dashboardData.attendanceTrend?.map((item: AttendanceTrendItem) => ({
    month: item.month || '',
    present: item.present || 0,
    absent: item.absent || 0,
    rate: item.rate || 0
  })) || [];

  const safeRecentActivities: RecentActivity[] = dashboardData.recentActivities || [];

  const totalPresent = safeAttendanceTrend.reduce((sum, month) => sum + month.present, 0);
  const totalAbsent = safeAttendanceTrend.reduce((sum, month) => sum + month.absent, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-blue-500/10 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Teacher Portal</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Teacher Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Welcome back! Here's your teaching overview. Manage classes, track student performance, and stay on top of your teaching activities.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell size={16} />
              Notifications
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Classes</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalClasses}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active this term</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                <Users size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all classes</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Assessments</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalAssessments}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <FileText size={18} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This term</p>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          title="Attendance Rate"
          subtitle="Overall class attendance"
          icon={<Calendar size={18} />}
        >
          <p className="text-2xl font-bold text-foreground">{averageAttendance}%</p>
          <Progress value={averageAttendance} className="h-2 mt-2" />
        </DashboardCard>

        <DashboardCard
          title="Pending Grading"
          subtitle="Assessments awaiting review"
          icon={<Clock size={18} />}
        >
          <p className="text-2xl font-bold text-foreground">{pendingGrading}</p>
          <p className="text-xs text-muted-foreground mt-1">Need your attention</p>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Deadlines"
          subtitle="This week"
          icon={<Award size={18} />}
        >
          <p className="text-2xl font-bold text-foreground">{upcomingDeadlines}</p>
          <p className="text-xs text-muted-foreground mt-1">Deadlines approaching</p>
        </DashboardCard>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card/50 border border-border/70">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 size={14} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp size={14} />
            Performance
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <Calendar size={14} />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <MessageSquare size={14} />
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend Chart */}
            <DashboardCard
              title="Performance Trend"
              subtitle="Average scores and assessment count over time"
              icon={<TrendingUp size={18} />}
              className="lg:col-span-2"
            >
              {safePerformanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={safePerformanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="averageScore" stroke="#0088FE" strokeWidth={2} name="Average Score" dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="totalAssessments" stroke="#00C49F" strokeWidth={2} name="Total Assessments" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No performance data available</p>
                    <p className="text-sm">Create assessments to see performance trends</p>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Subject Performance */}
            <DashboardCard
              title="Subject Performance"
              subtitle="Average scores by subject"
              icon={<BookOpen size={18} />}
            >
              {safeSubjectPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeSubjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No subject performance data</p>
                    <p className="text-sm">Add subjects to classes to see performance data</p>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Attendance Trend */}
            <DashboardCard
              title="Attendance Trend"
              subtitle="Monthly attendance rates"
              icon={<Calendar size={18} />}
            >
              {safeAttendanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={safeAttendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#FF8042" strokeWidth={2} name="Attendance Rate (%)" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance data available</p>
                    <p className="text-sm">Record attendance to see trends</p>
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Distribution */}
            <DashboardCard
              title="Subject Distribution"
              subtitle="Students enrolled by subject"
              icon={<Users size={18} />}
            >
              {safeSubjectPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={safeSubjectPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, totalStudents }) => `${subject}: ${totalStudents}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalStudents"
                      nameKey="subject"
                    >
                      {safeSubjectPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No subject distribution data</p>
                    <p className="text-sm">Add students to subjects to see distribution</p>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Performance Comparison */}
            <DashboardCard
              title="Performance Comparison"
              subtitle="Average scores and improvement by subject"
              icon={<BarChart3 size={18} />}
            >
              {safeSubjectPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeSubjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
                    <Bar dataKey="improvement" fill="#82ca9d" name="Improvement" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No performance comparison data</p>
                    <p className="text-sm">Add subject data to see comparisons</p>
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Overview */}
            <DashboardCard
              title="Attendance Overview"
              subtitle="Present vs Absent students by month"
              icon={<Calendar size={18} />}
              className="lg:col-span-2"
            >
              {safeAttendanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeAttendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="present" stackId="a" fill="#00C49F" name="Present" />
                    <Bar dataKey="absent" stackId="a" fill="#FF8042" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance data available</p>
                    <p className="text-sm">Record attendance to see overview</p>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Attendance Rate Progress */}
            <DashboardCard
              title="Attendance Rate Progress"
              subtitle="Monthly attendance rate changes"
              icon={<TrendingUp size={18} />}
            >
              {safeAttendanceTrend.length > 0 ? (
                <div className="space-y-4">
                  {safeAttendanceTrend.map((month: AttendanceTrendItem, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{month.month}</span>
                        <span className="font-medium text-foreground">{month.rate}%</span>
                      </div>
                      <Progress value={month.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance progress data</p>
                    <p className="text-sm">Record attendance over time to see progress</p>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Quick Stats */}
            <DashboardCard
              title="Attendance Summary"
              subtitle="Overall attendance statistics"
              icon={<BarChart3 size={18} />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{totalPresent}</div>
                    <div className="text-sm text-muted-foreground">Total Present</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{totalAbsent}</div>
                    <div className="text-sm text-muted-foreground">Total Absent</div>
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{averageAttendance}%</div>
                  <div className="text-sm text-muted-foreground">Overall Attendance Rate</div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <DashboardCard
            title="Recent Activities"
            subtitle="Latest teaching activities and updates"
            icon={<MessageSquare size={18} />}
          >
            {safeRecentActivities.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {safeRecentActivities.map((activity: RecentActivity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-border/70 bg-background/60"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        activity.type === 'assessment' ? 'bg-blue-500/10 text-blue-500' :
                        activity.type === 'attendance' ? 'bg-green-500/10 text-green-500' :
                        activity.type === 'message' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>
                        {activity.type === 'assessment' && <FileText size={18} />}
                        {activity.type === 'attendance' && <Calendar size={18} />}
                        {activity.type === 'message' && <MessageSquare size={18} />}
                        {activity.type === 'grade' && <Award size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-foreground">{activity.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        {activity.class && (
                          <Badge variant="outline" className="mt-2">
                            {activity.class}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <Eye size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activities</p>
                  <p className="text-sm">Activities will appear here as you use the system</p>
                </div>
              </div>
            )}
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}