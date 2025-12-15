
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Award,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Trophy,
  Bell,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Receipt,
  User,
  CreditCard,
  AlertCircle,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'classes' | 'assessments' | 'attendance'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { useDashboardSummary } = useStudentQueries();
  const { data: dashboardResponse, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-sm mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <div className="text-lg font-semibold">Error loading dashboard data</div>
          <div className="text-sm text-muted-foreground mt-2">Please try again later</div>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full md:w-auto">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardResponse?.data;
  
  if (!dashboardData) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-lg">No dashboard data available</div>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full md:w-auto">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const { profile, paymentStats, recentAssessments, attendance, upcomingDeadlines } = dashboardData;
  
  // Extract payment summary - handle both possible structures
  const paymentSummary = paymentStats?.studentPayments?.summary || paymentStats?.summary || {
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    totalDue: 0
  };
  
  const payments = paymentStats?.studentPayments?.payments || paymentStats?.payments || [];
  
  // Get student ID
  const studentId = profile?.admission_no || profile?.user_id?.toString() || 'Not assigned';
  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student';
  
  // Calculate attendance percentage
  const attendancePercentage = attendance.length > 0
    ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
    : 0;

  return (
    <div className="min-h-screen ">
      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="text-sm text-muted-foreground">Student ID: {studentId}</div>
              </div>
            </div>
          </div>
          <nav className="p-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Overview
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('payments');
                  setMobileMenuOpen(false);
                }}
              >
                <DollarSign className="h-4 w-4 mr-3" />
                Payments
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('classes');
                  setMobileMenuOpen(false);
                }}
              >
                <BookOpen className="h-4 w-4 mr-3" />
                Classes
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('assessments');
                  setMobileMenuOpen(false);
                }}
              >
                <Award className="h-4 w-4 mr-3" />
                Assessments
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('attendance');
                  setMobileMenuOpen(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-3" />
                Attendance
              </Button>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/student/settings');
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/student/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-3" />
                Profile
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">Student Dashboard</h1>
                <p className="text-base sm:text-lg text-muted-foreground">Welcome back, {fullName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => router.push('/student/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                onClick={() => router.push('/student/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar 
                className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push('/student/profile')}
              >
                <AvatarFallback className="text-sm sm:text-base">
                  {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Student ID</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate font-mono">
                      {studentId}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground truncate capitalize">
                        {profile?.enrollment_status || 'Active'}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <User className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Paid</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                      ₦{paymentSummary.totalPaid?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">Payments</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Pending Balance</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                      ₦{paymentSummary.totalPending?.toLocaleString() || '0'}
                    </p>
                    <Progress 
                      value={
                        paymentSummary.totalDue > 0 
                          ? (paymentSummary.totalPending / paymentSummary.totalDue) * 100 
                          : 0
                      } 
                      className="w-full mt-2 h-1.5 sm:h-2" 
                    />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Recent Assessments</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                      {recentAssessments?.length || 0}
                    </p>
                    <span className="text-xs sm:text-sm text-muted-foreground">This term</span>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => router.push('/student/payments')}
            >
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm md:text-base">Payments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => router.push('/student/classes')}
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm md:text-base">Classes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => setActiveTab('assessments')}
            >
              <Award className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm md:text-base">Assessments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => setActiveTab('attendance')}
            >
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm md:text-base">Attendance</span>
            </Button>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4 md:space-y-6">
            {/* Mobile Tabs Scroll Container */}
            <div className="relative">
              <TabsList className="w-full grid grid-cols-5 h-auto p-1 overflow-x-auto no-scrollbar">
                <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Payments</span>
                </TabsTrigger>
                <TabsTrigger value="classes" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Classes</span>
                </TabsTrigger>
                <TabsTrigger value="assessments" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Assessments</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Attendance</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <DashboardOverview
                profile={profile}
                paymentSummary={paymentSummary}
                recentAssessments={recentAssessments}
                attendance={attendance}
                upcomingDeadlines={upcomingDeadlines}
                attendancePercentage={attendancePercentage}
              />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsView payments={payments} />
            </TabsContent>

            <TabsContent value="classes">
              <ClassesView />
            </TabsContent>

            <TabsContent value="assessments">
              <AssessmentsView assessments={recentAssessments} />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceView attendance={attendance} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component - Updated for mobile
const DashboardOverview: React.FC<{
  profile: any;
  paymentSummary: any;
  recentAssessments: any[];
  attendance: any[];
  upcomingDeadlines: any[];
  attendancePercentage: number;
}> = ({ profile, paymentSummary, recentAssessments, attendance, upcomingDeadlines, attendancePercentage }) => {
  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        {/* Welcome Card */}
        <Card className="bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Welcome, {fullName}!</h3>
                <p className="text-primary-foreground/80 text-sm sm:text-base">
                  {profile?.enrollment_status === 'active' 
                    ? "You're actively enrolled. Keep up the good work!"
                    : "Check your enrollment status with administration."}
                </p>
                <div className="flex items-center space-x-4 mt-3 sm:mt-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-bold">{recentAssessments.length}</div>
                    <div className="text-primary-foreground/80 text-xs sm:text-sm">Assessments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-bold">{attendance.length}</div>
                    <div className="text-primary-foreground/80 text-xs sm:text-sm">Attendance</div>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 sm:border-4 border-primary-foreground/20">
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg sm:text-2xl">
                    {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="mt-2 bg-primary-foreground/20 text-primary-foreground text-xs">
                  {profile?.admission_no || 'No ID'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Award className="h-4 w-4 md:h-5 md:w-5" />
              <span>Recent Assessments</span>
            </CardTitle>
            <CardDescription className="text-sm md:text-base">Your latest assessment results</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {recentAssessments.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <Award className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                <p className="text-muted-foreground text-sm md:text-base">No assessment records available</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {recentAssessments.slice(0, 5).map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        assessment.score !== null ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {assessment.score !== null ? (
                          <span className="font-bold text-sm sm:text-base">{((assessment.score / assessment.max_score) * 100).toFixed(0)}%</span>
                        ) : (
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base truncate">{assessment.title}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">
                          {assessment.subject} • {new Date(assessment.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={assessment.score !== null ? "default" : "secondary"} className="ml-2 text-xs">
                      {assessment.score !== null ? 'Done' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-4 md:space-y-6">
        {/* Payment Summary */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Due:</span>
                <span className="font-semibold text-sm md:text-base">₦{paymentSummary.totalDue?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paid:</span>
                <span className="font-semibold text-green-600 text-sm md:text-base">₦{paymentSummary.totalPaid?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending:</span>
                <span className="font-semibold text-orange-600 text-sm md:text-base">₦{paymentSummary.totalPending?.toLocaleString() || '0'}</span>
              </div>
              <Separator />
              <div className="pt-2">
                <Button className="w-full text-sm md:text-base">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Make Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              <span>Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-center mb-3 md:mb-4">
              <div className="text-2xl md:text-3xl font-bold">{attendancePercentage.toFixed(1)}%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Attendance Rate</div>
            </div>
            <Progress value={attendancePercentage} className="w-full h-1.5 md:h-2 mb-4" />
            <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm">
              <div className="p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-600">
                  {attendance.filter(a => a.status === 'present').length}
                </div>
                <div className="text-muted-foreground">Present</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-600">
                  {attendance.filter(a => a.status === 'absent').length}
                </div>
                <div className="text-muted-foreground">Absent</div>
              </div>
              <div className="p-2 bg-yellow-50 rounded">
                <div className="font-semibold text-yellow-600">
                  {attendance.filter(a => a.status === 'late').length}
                </div>
                <div className="text-muted-foreground">Late</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-sm md:text-base">No upcoming deadlines</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                  <div key={index} className="p-3 rounded-lg border-l-4 bg-muted/50 border-yellow-500">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm md:text-base truncate">{deadline.title}</div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate">{deadline.subject}</div>
                      </div>
                      <Badge variant="secondary" className="ml-2 text-xs flex-shrink-0">
                        {new Date(deadline.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Payments View Component - Updated for mobile
const PaymentsView: React.FC<{ payments: any[] }> = ({ payments }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Payment History</CardTitle>
        <CardDescription className="text-sm md:text-base">View all your payment records</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        {payments.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <CreditCard className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">No Payment Records</h3>
            <p className="text-muted-foreground text-sm md:text-base">You don't have any payment records yet.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm md:text-base truncate">{payment.description}</div>
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    Ref: {payment.referenceNumber}
                    {payment.dueDate && ` • Due: ${new Date(payment.dueDate).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="font-bold text-sm md:text-base whitespace-nowrap">₦{payment.amount?.toLocaleString()}</div>
                  <Badge variant={getStatusVariant(payment.status)} className="flex items-center space-x-1 mt-1 text-xs">
                    {getStatusIcon(payment.status)}
                    <span className="capitalize truncate">{payment.status}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Assessments View Component - Updated for mobile
const AssessmentsView: React.FC<{ assessments: any[] }> = ({ assessments }) => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">All Assessments</CardTitle>
        <CardDescription className="text-sm md:text-base">Tests, quizzes, and exams</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        {assessments.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Award className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">No Assessments</h3>
            <p className="text-muted-foreground text-sm md:text-base">No assessment records available.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {assessments.map((assessment, index) => (
              <div key={index} className="p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm md:text-base truncate">{assessment.title}</div>
                    <div className="text-xs md:text-sm text-muted-foreground truncate">
                      {assessment.subject} • {new Date(assessment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={assessment.score !== null ? "default" : "secondary"} className="ml-2 text-xs flex-shrink-0">
                    {assessment.type}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-xs md:text-sm text-muted-foreground">Score: </span>
                    <span className="font-semibold text-sm md:text-base">
                      {assessment.score !== null 
                        ? `${assessment.score}/${assessment.max_score} (${((assessment.score / assessment.max_score) * 100).toFixed(1)}%)`
                        : 'Not graded'
                      }
                    </span>
                  </div>
                  {assessment.score === null && (
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Attendance View Component - Updated for mobile
const AttendanceView: React.FC<{ attendance: any[] }> = ({ attendance }) => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Attendance Records</CardTitle>
        <CardDescription className="text-sm md:text-base">Your attendance history</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        {attendance.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">No Attendance Records</h3>
            <p className="text-muted-foreground text-sm md:text-base">No attendance records available.</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {attendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm md:text-base truncate">{record.subject}</div>
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    {new Date(record.date).toLocaleDateString()} • {record.teacher}
                  </div>
                </div>
                <Badge variant={
                  record.status === 'present' ? 'default' :
                  record.status === 'absent' ? 'destructive' :
                  record.status === 'late' ? 'secondary' : 'outline'
                } className="ml-2 text-xs flex-shrink-0">
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Classes View Component - Updated for mobile
const ClassesView: React.FC = () => {
  const { useClasses } = useStudentQueries();
  const { data: classesResponse, isLoading } = useClasses();
  const classes = classesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-sm md:text-base">Loading classes...</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">My Classes</CardTitle>
        <CardDescription className="text-sm md:text-base">Your enrolled classes and subjects</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        {classes.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">No Classes</h3>
            <p className="text-muted-foreground text-sm md:text-base">You are not enrolled in any classes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {classes.map((classItem: any) => (
              <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                  <CardTitle className="text-base md:text-lg truncate">{classItem.name}</CardTitle>
                  <CardDescription className="text-xs md:text-sm truncate">{classItem.code} • {classItem.teacher_name}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium truncate ml-2">{classItem.schedule}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{classItem.room}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Term:</span>
                      <span className="font-medium">{classItem.term}</span>
                    </div>
                    {classItem.attendance_percentage && (
                      <div className="pt-2 md:pt-3">
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium">{classItem.attendance_percentage}%</span>
                        </div>
                        <Progress value={classItem.attendance_percentage} className="h-1.5 md:h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;

// Add this to your global CSS (globals.css) or component CSS:
/*
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
*/