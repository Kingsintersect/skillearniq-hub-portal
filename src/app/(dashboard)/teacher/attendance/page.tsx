'use client'
import React, { useState } from 'react';
import { useTeacherClasses } from '@/hooks/use-classes';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Calendar, 
  Download, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st',
    classId: 1,
  });
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [dateFilter, setDateFilter] = useState('');

  const currentTeacherId = 1;
  const { data: classes, isLoading } = useTeacherClasses(currentTeacherId);

  // Mock attendance data
  const attendanceData = {
    daily: [
      { 
        date: '2024-01-15', 
        present: 28, 
        absent: 2, 
        late: 1, 
        rate: 93.3,
        students: [
          { id: 1, name: 'John Doe', status: 'present', time: '08:00 AM' },
          { id: 2, name: 'Jane Smith', status: 'absent', time: '-' },
          { id: 3, name: 'Mike Johnson', status: 'late', time: '08:15 AM' },
        ]
      },
      { 
        date: '2024-01-16', 
        present: 29, 
        absent: 1, 
        late: 1, 
        rate: 96.7,
        students: [
          { id: 1, name: 'John Doe', status: 'present', time: '07:55 AM' },
          { id: 2, name: 'Jane Smith', status: 'present', time: '08:00 AM' },
          { id: 3, name: 'Mike Johnson', status: 'late', time: '08:20 AM' },
        ]
      },
    ],
    monthly: [
      { month: 'January 2024', present: 580, absent: 20, rate: 96.7 },
      { month: 'February 2024', present: 560, absent: 40, rate: 93.3 },
      { month: 'March 2024', present: 590, absent: 10, rate: 98.3 },
    ]
  };

  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const terms = ['1st', '2nd', '3rd'];

  const handleExport = () => {
    toast.success('Attendance data exported successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold text-foreground">94.2%</p>
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
                  <p className="text-2xl font-bold text-foreground">1,420</p>
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
                  <p className="text-2xl font-bold text-foreground">86</p>
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
                  <p className="text-2xl font-bold text-foreground">42</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={filters.term}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>{term} Term</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={filters.classId.toString()}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, classId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map(cls => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.shortName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
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
            <DailyAttendanceView data={attendanceData.daily} />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlyAttendanceView data={attendanceData.monthly} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Daily Attendance View Component
const DailyAttendanceView: React.FC<{ data: any[] }> = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDayData = selectedDate ? data.find(day => day.date === selectedDate) : null;

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
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedDate === day.date ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <TableCell className="font-medium">
                      {new Date(day.date).toLocaleDateString()}
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
                          setSelectedDate(day.date);
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

      {/* Day Details */}
      {selectedDate && selectedDayData && (
        <div className="lg:col-span-1">
          <DayAttendanceDetails 
            data={selectedDayData} 
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}
    </div>
  );
};

// Day Attendance Details Component
const DayAttendanceDetails: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => {
  return (
    <Card className="sticky top-6 h-fit">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>
              {new Date(data.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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
          <div>
            <h4 className="font-medium mb-2">Student Attendance</h4>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {data.students.map((student: any) => (
                  <div key={student.id} className="flex justify-between items-center p-2 border rounded text-sm">
                    <span>{student.name}</span>
                    <Badge 
                      variant={
                        student.status === 'present' ? 'default' :
                        student.status === 'absent' ? 'destructive' : 'outline'
                      }
                      className={
                        student.status === 'present' ? 'bg-green-500' :
                        student.status === 'absent' ? '' : 'bg-orange-500'
                      }
                    >
                      {student.status} {student.time && `(${student.time})`}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Monthly Attendance View Component
const MonthlyAttendanceView: React.FC<{ data: any[] }> = ({ data }) => {
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
              <TableHead>Attendance Rate</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((month) => (
              <TableRow key={month.month}>
                <TableCell className="font-medium">{month.month}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500">
                    {month.present}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{month.absent}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={month.rate} className="h-2 w-20" />
                    <span className="text-sm font-medium">{month.rate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TrendingUp className="h-4 w-4 text-green-500" />
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