'use client'
import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

// Import types
import { AttendanceRecord } from '@/lib/services/teacherService';

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

  // Get current teacher ID from auth context or localStorage
  const getCurrentTeacherId = (): number => {
    // This should come from your auth context
    // For now, using a default or from localStorage
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
    return 1; // Fallback to teacher ID 1
  };

  const currentTeacherId = getCurrentTeacherId();

  // Use the teacher queries hook - NO FILTERS NEEDED
  const { useAttendance } = useTeacherQueries();
  
  // Fetch attendance data without any filters
  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    error: attendanceError,
    refetch
  } = useAttendance(currentTeacherId);

  // Process and transform data when it loads
  useEffect(() => {
    if (attendanceResponse?.data) {
      console.log('Attendance API Response:', attendanceResponse.data);
      
      const { daily, monthly } = attendanceResponse.data;
      
      // Transform data to match component needs
      const transformedDaily = daily.map(record => ({
        ...record,
        students: record.students || []
      }));
      
      setAttendanceData({
        daily: transformedDaily,
        monthly: monthly || []
      });

      // Calculate stats
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
        // If no data, set default stats
        setStats({
          avgAttendance: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0
        });
      }
    }
  }, [attendanceResponse]);

  // Update selected day data when selectedDate changes
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
      // This would be your export API call
      // For now, just show a success message
      toast.success('Export functionality to be implemented with backend');
    } catch (error) {
      toast.error('Failed to export attendance data');
      console.error('Export error:', error);
    }
  };

  // Handle 204 No Content response
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format month for display
  const formatMonth = (monthString: string) => {
    return monthString; // Already formatted from API
  };

  if (attendanceLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Attendance</h3>
          <p className="text-muted-foreground mb-4">
            {attendanceError.message || 'Failed to load attendance data'}
          </p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check for empty data
  const hasNoData = attendanceData.daily.length === 0 && attendanceData.monthly.length === 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Calendar className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Attendance Records</h1>
          <p className="text-muted-foreground text-lg">View and analyze student attendance patterns</p>
        </div>

        {/* Stats Overview - Only show if we have data */}
        {!hasNoData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                    <p className="text-2xl font-bold text-foreground">{stats.avgAttendance}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Present</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalPresent}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Absent</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalAbsent}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Late Arrivals</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalLate}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Export Button */}
        <div className="mb-6 flex justify-end">
          <Button variant="outline" onClick={handleExport} disabled={hasNoData || attendanceLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Main Content */}
        {hasNoData ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Attendance Data Available</h3>
              <p className="text-muted-foreground mb-6">
                There are no attendance records available at the moment.
              </p>
              <Button onClick={() => refetch()}>
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Daily View</span>
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Monthly Overview</span>
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
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Daily Attendance Data</h3>
          <p className="text-muted-foreground">
            No daily attendance records found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily List */}
      <div className={`${selectedDate ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Records</CardTitle>
            <CardDescription>Click on a date to view detailed attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((day) => (
                  <TableRow
                    key={day.date}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedDate === day.date ? 'bg-muted' : ''
                      }`}
                    onClick={() => onSelectDate(day.date)}
                  >
                    <TableCell className="font-medium">
                      {formatDate(day.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">
                        {day.present}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{day.absent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{day.late}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={day.rate} className="h-2 w-20" />
                        <span className="text-sm font-medium">{day.rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(day.date);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
        return <Badge className="bg-green-500">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-orange-500">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="sticky top-6 h-fit">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>
              {formatDate(data.date)}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{data.present}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center p-3 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-500">{data.absent}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
          </div>

          <Separator />

          {/* Attendance Rate */}
          <div>
            <h4 className="font-medium mb-2">Attendance Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Rate:</span>
                <span className="font-medium">{data.rate}%</span>
              </div>
              <Progress value={data.rate} className="h-2" />
            </div>
          </div>

          {/* Student List */}
          {data.students && data.students.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Student Attendance</h4>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {data.students.map((student) => (
                    <div key={student.id} className="flex justify-between items-center p-2 border rounded text-sm">
                      <span className="truncate">{student.name}</span>
                      {getStatusBadge(student.status)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {(!data.students || data.students.length === 0) && (
            <div className="text-center py-4 border rounded">
              <p className="text-muted-foreground">No student details available for this day</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Monthly Data</h3>
          <p className="text-muted-foreground">
            No monthly attendance records found.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (currentRate: number, previousRate?: number) => {
    if (!previousRate) return <TrendingUp className="h-4 w-4 text-gray-400" />;
    
    if (currentRate > previousRate) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (currentRate < previousRate) {
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Overview</CardTitle>
        <CardDescription>Attendance trends and patterns by month</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Late</TableHead>
              <TableHead>Attendance Rate</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((month, index) => (
              <TableRow key={month.date || month.month || index}>
                <TableCell className="font-medium">
                  {formatMonth(month.month || month.date)}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500">
                    {month.present}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{month.absent}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{month.late || 0}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={month.rate} className="h-2 w-20" />
                    <span className="text-sm font-medium">{month.rate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getTrendIcon(
                    month.rate,
                    index > 0 ? data[index - 1].rate : undefined
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AttendancePage;