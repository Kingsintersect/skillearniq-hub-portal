'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTeacherQueries } from '@/hooks/useTeacherQueries';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Loader2,
  Users,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  UserX,
  UserMinus
} from 'lucide-react';
import Link from 'next/link';

// Import types
import { AttendanceRecord } from '@/lib/services/teacherService';

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

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

interface AttendanceData {
  daily: AttendanceRecord[];
  monthly: AttendanceRecord[];
}

interface StudentAttendance {
  id: number;
  name: string;
  status: 'present' | 'absent' | 'late';
  time: string;
}

interface DailyAttendance extends AttendanceRecord {
  students?: StudentAttendance[];
}

export const AttendancePage: React.FC = () => {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    daily: [],
    monthly: []
  });
  const [selectedDayData, setSelectedDayData] = useState<DailyAttendance | null>(null);
  const [stats, setStats] = useState({
    avgAttendance: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0
  });

  const getCurrentTeacherId = (): number => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || 1;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    return 1;
  };

  const currentTeacherId = getCurrentTeacherId();

  const { useAttendance } = useTeacherQueries();
  
  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    error: attendanceError,
    refetch
  } = useAttendance(currentTeacherId);

  useEffect(() => {
    if (attendanceResponse?.data) {
      console.log('Attendance API Response:', attendanceResponse.data);
      
      const { daily, monthly } = attendanceResponse.data;
      
      const transformedDaily = daily.map(record => ({
        ...record,
        students: record.students || []
      }));
      
      setAttendanceData({
        daily: transformedDaily,
        monthly: monthly || []
      });

      if (transformedDaily.length > 0) {
        const totalDays = transformedDaily.length;
        const totalPresent = transformedDaily.reduce((sum, day) => sum + day.present, 0);
        const totalAbsent = transformedDaily.reduce((sum, day) => sum + day.absent, 0);
        //@ts-ignore
        const totalLate = transformedDaily.reduce((sum, day) => sum + day.late, 0);
        const avgRate = transformedDaily.reduce((sum, day) => sum + day.rate, 0) / totalDays;

        setStats({
          avgAttendance: parseFloat(avgRate.toFixed(1)),
          totalPresent,
          totalAbsent,
          totalLate
        });
      } else {
        setStats({
          avgAttendance: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0
        });
      }
    }
  }, [attendanceResponse]);

  useEffect(() => {
    if (selectedDate && attendanceData.daily.length > 0) {
      const dayData = attendanceData.daily.find(day => day.date === selectedDate);
      setSelectedDayData(dayData || null);
    } else {
      setSelectedDayData(null);
    }
  }, [selectedDate, attendanceData.daily]);

  const handleExport = async () => {
    try {
      toast.success('Export functionality to be implemented with backend');
    } catch (error) {
      toast.error('Failed to export attendance data');
      console.error('Export error:', error);
    }
  };

  useEffect(() => {
    if (attendanceResponse && attendanceResponse.status === 204) {
      toast.info('No attendance data available yet');
      setAttendanceData({
        daily: [],
        monthly: []
      });
      setStats({
        avgAttendance: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0
      });
    }
  }, [attendanceResponse]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatMonth = (monthString: string) => {
    return monthString;
  };

  if (attendanceLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading attendance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Attendance</h3>
            <p className="text-muted-foreground mb-4">
              {attendanceError.message || 'Failed to load attendance data'}
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasNoData = attendanceData.daily.length === 0 && attendanceData.monthly.length === 0;

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
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attendance Management</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Attendance Records</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              View and analyze student attendance patterns across your courses. Track presence, absences, and late arrivals.
            </p>
          </div>
          <Button variant="outline" onClick={handleExport} disabled={hasNoData || attendanceLoading} className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        {!hasNoData && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Average Attendance</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stats.avgAttendance}%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <TrendingUp size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Present</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalPresent}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <UserCheck size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Absent</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalAbsent}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <UserX size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Late Arrivals</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalLate}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <UserMinus size={18} />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* Main Content */}
      {hasNoData ? (
        <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center shadow-sm backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mx-auto mb-4">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Attendance Data Available</h3>
          <p className="text-muted-foreground mb-6">
            There are no attendance records available at the moment.
          </p>
          <Button onClick={() => refetch()}>
            Refresh Data
          </Button>
        </div>
      ) : (
        <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
          <TabsList className="bg-card/50 border border-border/70">
            <TabsTrigger value="daily" className="gap-2">
              <Calendar size={14} />
              Daily View
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <BarChart3 size={14} />
              Monthly Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <DailyAttendanceView
              data={attendanceData.daily}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlyAttendanceView
              data={attendanceData.monthly}
              formatMonth={formatMonth}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Day Details Side Panel */}
      {selectedDate && selectedDayData && view === 'daily' && (
        <div className="lg:hidden mt-6">
          <DayAttendanceDetails
            data={selectedDayData}
            onClose={() => setSelectedDate(null)}
            formatDate={formatDate}
          />
        </div>
      )}
    </div>
  );
};

// Daily Attendance View Component
interface DailyAttendanceViewProps {
  data: DailyAttendance[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  formatDate: (dateString: string) => string;
}

const DailyAttendanceView: React.FC<DailyAttendanceViewProps> = ({
  data,
  selectedDate,
  onSelectDate,
  formatDate
}) => {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center shadow-sm backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mx-auto mb-4">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Daily Attendance Data</h3>
        <p className="text-muted-foreground">No daily attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily List */}
      <div className={`${selectedDate ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <div className="rounded-3xl border border-border/70 bg-card/95 overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="p-5 border-b border-border/50">
            <h3 className="text-sm font-semibold text-card-foreground">Daily Attendance Records</h3>
            <p className="text-xs text-muted-foreground mt-1">Click on a date to view detailed attendance</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Present</TableHead>
                  <TableHead className="text-foreground font-semibold">Absent</TableHead>
                  <TableHead className="text-foreground font-semibold">Late</TableHead>
                  <TableHead className="text-foreground font-semibold">Attendance Rate</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((day, index) => (
                  <motion.tr
                    key={day.date}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={`cursor-pointer hover:bg-muted/30 transition-colors ${selectedDate === day.date ? 'bg-muted/50' : ''}`}
                    onClick={() => onSelectDate(day.date)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {formatDate(day.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                        {day.present}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                        {day.absent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-200 text-orange-600">
                        {day.late}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={day.rate} className="h-1.5 w-20" />
                        <span className="text-sm font-medium text-foreground">{day.rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(day.date);
                        }}
                        className="gap-1"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Day Details (Desktop) */}
      {selectedDate && (
        <div className="lg:col-span-1 hidden lg:block">
          <DayAttendanceDetails
            data={data.find(day => day.date === selectedDate)!}
            onClose={() => onSelectDate('')}
            formatDate={formatDate}
          />
        </div>
      )}
    </div>
  );
};

// Day Attendance Details Component
interface DayAttendanceDetailsProps {
  data: DailyAttendance;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

const DayAttendanceDetails: React.FC<DayAttendanceDetailsProps> = ({
  data,
  onClose,
  formatDate
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">Absent</Badge>;
      case 'late':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm sticky top-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Attendance Details</h3>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(data.date)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden h-8 w-8">
          <XCircle size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-green-500/10 rounded-2xl">
            <div className="text-2xl font-bold text-green-600">{data.present}</div>
            <div className="text-xs text-muted-foreground">Present</div>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-2xl">
            <div className="text-2xl font-bold text-red-600">{data.absent}</div>
            <div className="text-xs text-muted-foreground">Absent</div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Attendance Rate */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Attendance Rate</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Rate:</span>
              <span className="font-medium text-foreground">{data.rate}%</span>
            </div>
            <Progress value={data.rate} className="h-2" />
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Student List */}
        {data.students && data.students.length > 0 ? (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Student Attendance</h4>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {data.students.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-background/30">
                    <span className="text-sm font-medium text-foreground truncate">{student.name}</span>
                    {getStatusBadge(student.status)}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-border/50 rounded-2xl">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No student details available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Monthly Attendance View Component
interface MonthlyAttendanceViewProps {
  data: AttendanceRecord[];
  formatMonth: (monthString: string) => string;
}

const MonthlyAttendanceView: React.FC<MonthlyAttendanceViewProps> = ({ data, formatMonth }) => {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/95 p-12 text-center shadow-sm backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mx-auto mb-4">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Monthly Data</h3>
        <p className="text-muted-foreground">No monthly attendance records found.</p>
      </div>
    );
  }

  const getTrendIcon = (currentRate: number, previousRate?: number) => {
    if (!previousRate) return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    
    if (currentRate > previousRate) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (currentRate < previousRate) {
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/95 overflow-hidden shadow-sm backdrop-blur-sm">
      <div className="p-5 border-b border-border/50">
        <h3 className="text-sm font-semibold text-card-foreground">Monthly Attendance Overview</h3>
        <p className="text-xs text-muted-foreground mt-1">Attendance trends and patterns by month</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-foreground font-semibold">Month</TableHead>
              <TableHead className="text-foreground font-semibold">Present</TableHead>
              <TableHead className="text-foreground font-semibold">Absent</TableHead>
              <TableHead className="text-foreground font-semibold">Late</TableHead>
              <TableHead className="text-foreground font-semibold">Attendance Rate</TableHead>
              <TableHead className="text-foreground font-semibold">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((month, index) => (
              <motion.tr
                key={month.date || month.month || index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {formatMonth(month.month || month.date)}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    {month.present}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                    {month.absent}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-orange-200 text-orange-600">
                    {month.late || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={month.rate} className="h-1.5 w-20" />
                    <span className="text-sm font-medium text-foreground">{month.rate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getTrendIcon(
                    month.rate,
                    index > 0 ? data[index - 1].rate : undefined
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendancePage;