'use client'
import React, { useState, useEffect } from 'react';
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
  RefreshCw
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

export const Dashboard: React.FC = () => {
  const teacherId = 1; // This would come from auth context
  const { useDashboardData } = useTeacherQueries();
  const { data: dashboardResponse, isLoading, error, isError, refetch } = useDashboardData(teacherId);

  // State for manually fetched data
  const [studentCount, setStudentCount] = useState<number>(0);
  const [classCount, setClassCount] = useState<number>(0);
  const [isFetchingFallbackData, setIsFetchingFallbackData] = useState(false);

  // Fetch fallback data if dashboard doesn't provide it
  useEffect(() => {
    const fetchFallbackData = async () => {
      // Only fetch if dashboard data is empty or missing critical info
      const needsFallback = !dashboardResponse?.data?.totalStudents ||
        !dashboardResponse?.data?.totalClasses ||
        dashboardResponse?.data?.totalStudents === 0;

      if (needsFallback && dashboardResponse?.data) {
        setIsFetchingFallbackData(true);
        try {
          // Fetch students count
          try {
            const studentsResponse = await teacherService.getStudentsPerCourse(teacherId);
            if (studentsResponse.data && Array.isArray(studentsResponse.data)) {
              setStudentCount(studentsResponse.data.length);
            }
          } catch (studentError) {
            console.error('Failed to fetch students count:', studentError);
          }

          // Fetch classes count
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
      <div className="min-h-screen p-6 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <div className="text-foreground">
            {isFetchingFallbackData ? 'Loading additional data...' : 'Loading dashboard...'}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-background">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <div>Error loading dashboard data</div>
          <div className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Please try again later'}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Check if we have valid data
  if (!dashboardResponse || !dashboardResponse.data) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-foreground">No dashboard data available</div>
          <div className="text-sm text-muted-foreground mt-2">
            The API returned an empty response.
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardResponse.data;

  // Use dashboard data or fallback data
  const totalStudents = dashboardData.totalStudents > 0
    ? dashboardData.totalStudents
    : studentCount;

  const totalClasses = dashboardData.totalClasses > 0
    ? dashboardData.totalClasses
    : classCount;

  const totalAssessments = dashboardData.totalAssessments || 0;
  const averageAttendance = dashboardData.averageAttendance || 0;
  const pendingGrading = dashboardData.pendingGrading || 0;
  const upcomingDeadlines = dashboardData.upcomingDeadlines || 0;

  // Handle data with proper typing
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

  // Calculate totals for attendance
  const totalPresent: number = safeAttendanceTrend.reduce((sum: number, month: AttendanceTrendItem) => sum + month.present, 0);
  const totalAbsent: number = safeAttendanceTrend.reduce((sum: number, month: AttendanceTrendItem) => sum + month.absent, 0);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back! Here's your teaching overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold text-foreground">{totalClasses}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active this term</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                  <div className="text-sm text-muted-foreground mt-1">Across all classes</div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessments</p>
                  <p className="text-2xl font-bold text-foreground">{totalAssessments}</p>
                  <div className="text-sm text-muted-foreground mt-1">This term</div>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{averageAttendance}%</p>
                  <Progress value={averageAttendance} className="w-full mt-2 h-2" />
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Grading</p>
                  <p className="text-2xl font-bold text-foreground">{pendingGrading}</p>
                  <div className="text-sm text-muted-foreground mt-1">Need attention</div>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingDeadlines}</p>
                  <div className="text-sm text-muted-foreground mt-1">This week</div>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend Chart */}
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Performance Trend</CardTitle>
                  <CardDescription>Average scores and assessment count over time</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Attendance Trend */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Attendance Trend</CardTitle>
                  <CardDescription>Monthly attendance rates</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Subject Distribution</CardTitle>
                  <CardDescription>Students enrolled by subject</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Performance Comparison */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Performance Comparison</CardTitle>
                  <CardDescription>Average scores and improvement by subject</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Overview */}
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Attendance Overview</CardTitle>
                  <CardDescription>Present vs Absent students by month</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Attendance Rate Progress */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Attendance Rate Progress</CardTitle>
                  <CardDescription>Monthly attendance rate changes</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalPresent}</div>
                        <div className="text-sm text-muted-foreground">Total Present</div>
                      </div>
                      <div className="text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalAbsent}</div>
                        <div className="text-sm text-muted-foreground">Total Absent</div>
                      </div>
                    </div>
                    <Separator className="bg-border" />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{averageAttendance}%</div>
                      <div className="text-sm text-muted-foreground">Overall Attendance Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activities</CardTitle>
                <CardDescription>Latest teaching activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {safeRecentActivities.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {safeRecentActivities.map((activity: RecentActivity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg bg-background">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'assessment' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                            activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                              activity.type === 'message' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                                'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                            }`}>
                            {activity.type === 'assessment' && <FileText className="h-5 w-5" />}
                            {activity.type === 'attendance' && <Calendar className="h-5 w-5" />}
                            {activity.type === 'message' && <MessageSquare className="h-5 w-5" />}
                            {activity.type === 'grade' && <Award className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground">{activity.title}</h4>
                              <span className="text-sm text-muted-foreground">
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
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;