'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  XCircle
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'performance' | 'messages' | 'groups'>('overview');

  const { useDashboardData } = useStudentQueries();
  const { data: dashboardResponse, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <div>Error loading dashboard data</div>
          <div className="text-sm text-muted-foreground mt-2">Please try again later</div>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardResponse?.data;
  const studentData = dashboardData?.profile;

  if (!dashboardData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {studentData?.name}! Ready to learn?</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={studentData?.avatar} />
              <AvatarFallback>
                {studentData?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold text-foreground">#{studentData?.level}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{studentData?.points} points</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                  <p className="text-2xl font-bold text-foreground">{studentData?.averageGrade}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">+2.5% this term</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{studentData?.attendance}%</p>
                  <Progress value={studentData?.attendance} className="w-full mt-2 h-2" />
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
                  <p className="text-sm font-medium text-muted-foreground">Pending Work</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <span className="text-sm text-muted-foreground">Due this week</span>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Classes</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Study Groups</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview 
              studentData={studentData} 
              recentActivities={dashboardData.recentActivities}
              upcomingDeadlines={dashboardData.upcomingDeadlines}
              leaderboard={dashboardData.leaderboard}
            />
          </TabsContent>

          <TabsContent value="classes">
            <ClassesView />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsView />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceView />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesView />
          </TabsContent>

          <TabsContent value="groups">
            <StudyGroupsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<{ 
  studentData: any; 
  recentActivities: any[];
  upcomingDeadlines: any[];
  leaderboard: any[];
}> = ({ studentData, recentActivities, upcomingDeadlines, leaderboard }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Great work, {studentData.name}!</h3>
                <p className="text-primary-foreground/80">You're making excellent progress this term. Keep it up!</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{studentData.averageGrade}%</div>
                    <div className="text-primary-foreground/80 text-sm">Current Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">15</div>
                    <div className="text-primary-foreground/80 text-sm">Assignments Done</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Avatar className="h-16 w-16 border-4 border-primary-foreground/20">
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-2xl">
                    {studentData.name.split(' ').map((n:any) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="mt-2 bg-primary-foreground/20 text-primary-foreground">
                  Level {studentData.level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                      activity.type === 'message' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {activity.type === 'assignment' && <FileText className="h-5 w-5" />}
                      {activity.type === 'quiz' && <Award className="h-5 w-5" />}
                      {activity.type === 'message' && <MessageSquare className="h-5 w-5" />}
                      {activity.type === 'badge' && <Trophy className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                  {activity.points > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      +{activity.points} pts
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="p-3 rounded-lg border-l-4 bg-muted/50" style={{
                  borderLeftColor: deadline.priority === 'high' ? '#ef4444' : 
                                 deadline.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-muted-foreground">{deadline.subject}</div>
                    </div>
                    <Badge variant={
                      deadline.priority === 'high' ? 'destructive' :
                      deadline.priority === 'medium' ? 'secondary' : 'default'
                    }>
                      {deadline.due}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Class Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((student, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  student.name === studentData.name ? 'bg-primary/10' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      student.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                      student.rank === 2 ? 'bg-gray-100 text-gray-600' :
                      student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {student.rank}
                    </div>
                    <div className="text-sm font-medium">{student.name}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{student.points} pts</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Classes View Component
const ClassesView: React.FC = () => {
  const { useClasses } = useStudentQueries();
  const { data: classesResponse, isLoading, error } = useClasses({
    academicYear: '2025-2026',
    term: '1st'
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading classes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <div>Error loading classes</div>
          <div className="text-sm text-muted-foreground mt-2">Please try again later</div>
        </div>
      </div>
    );
  }

  const classes = classesResponse?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="bg-primary h-2 rounded-t-lg -mx-6 -mt-6 mb-4"></div>
            <CardTitle className="flex items-center justify-between">
              <span>{classItem.name}</span>
              <Badge variant="secondary">{classItem.room}</Badge>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{classItem.teacher.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{classItem.progress}%</span>
              </div>
              <Progress value={classItem.progress} className="h-2" />
            </div>
            
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">Next Topic:</div>
              <div className="font-medium">{classItem.nextTopic}</div>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{classItem.schedule}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Materials
              </Button>
              <Button size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Placeholder components for other tabs
const AssignmentsView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Assignments View</h3>
      <p className="text-muted-foreground">Assignments functionality would be implemented here</p>
    </CardContent>
  </Card>
);

const PerformanceView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Performance View</h3>
      <p className="text-muted-foreground">Performance analytics would be implemented here</p>
    </CardContent>
  </Card>
);

const MessagesView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Messages View</h3>
      <p className="text-muted-foreground">Messaging functionality would be implemented here</p>
    </CardContent>
  </Card>
);

const StudyGroupsView: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Study Groups View</h3>
      <p className="text-muted-foreground">Study groups functionality would be implemented here</p>
    </CardContent>
  </Card>
);

export default Dashboard;