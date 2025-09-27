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

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'performance' | 'messages' | 'groups'>('overview');

  // Mock student data
  const studentData = {
    name: 'Alex Johnson',
    grade: 'JSS 2A',
    studentId: 'STU2024001',
    avatar: '',
    points: 1250,
    level: 3,
    attendance: 94.5,
    averageGrade: 85.6
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {studentData.name}! Ready to learn?</p>
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
              <AvatarImage src={studentData.avatar} />
              <AvatarFallback>
                {studentData.name.split(' ').map(n => n[0]).join('')}
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
                  <p className="text-2xl font-bold text-foreground">#{studentData.level}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{studentData.points} points</span>
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
                  <p className="text-2xl font-bold text-foreground">{studentData.averageGrade}%</p>
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
                  <p className="text-2xl font-bold text-foreground">{studentData.attendance}%</p>
                  <Progress value={studentData.attendance} className="w-full mt-2 h-2" />
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
            <DashboardOverview studentData={studentData} />
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
const DashboardOverview: React.FC<{ studentData: any }> = ({ studentData }) => {
  const recentActivities = [
    { type: 'assignment', title: 'Math Homework Submitted', time: '2 hours ago', points: 50 },
    { type: 'quiz', title: 'Science Quiz Completed', time: '1 day ago', points: 30 },
    { type: 'message', title: 'Message from Mr. Smith', time: '2 days ago', points: 0 },
    { type: 'badge', title: 'Earned "Math Whiz" Badge', time: '3 days ago', points: 100 },
  ];

  const upcomingDeadlines = [
    { subject: 'Mathematics', title: 'Algebra Assignment', due: 'Tomorrow', priority: 'high' },
    { subject: 'English', title: 'Essay Writing', due: 'In 3 days', priority: 'medium' },
    { subject: 'Science', title: 'Lab Report', due: 'Next week', priority: 'low' },
  ];

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
              {[
                { name: 'Sarah Wilson', points: 1450, position: 1 },
                { name: 'Mike Johnson', points: 1320, position: 2 },
                { name: studentData.name, points: studentData.points, position: 3 },
                { name: 'Emma Davis', points: 1180, position: 4 },
                { name: 'Tom Brown', points: 1050, position: 5 },
              ].map((student, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  student.name === studentData.name ? 'bg-primary/10' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      student.position === 1 ? 'bg-yellow-100 text-yellow-600' :
                      student.position === 2 ? 'bg-gray-100 text-gray-600' :
                      student.position === 3 ? 'bg-orange-100 text-orange-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {student.position}
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
  const classes = [
    {
      id: 1,
      name: 'Mathematics',
      teacher: 'Mr. Smith',
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 201',
      progress: 75,
      nextTopic: 'Algebraic Expressions'
    },
    {
      id: 2,
      name: 'English Language',
      teacher: 'Mrs. Johnson',
      schedule: 'Tue, Thu - 10:30 AM',
      room: 'Room 105',
      progress: 60,
      nextTopic: 'Essay Writing Techniques'
    },
    {
      id: 3,
      name: 'Science',
      teacher: 'Dr. Brown',
      schedule: 'Mon, Wed - 2:00 PM',
      room: 'Lab 301',
      progress: 85,
      nextTopic: 'Chemical Reactions'
    },
    {
      id: 4,
      name: 'Social Studies',
      teacher: 'Ms. Davis',
      schedule: 'Tue, Thu, Fri - 11:00 AM',
      room: 'Room 108',
      progress: 45,
      nextTopic: 'Ancient Civilizations'
    }
  ];

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
              <span>{classItem.teacher}</span>
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

// Assignments View Component
const AssignmentsView: React.FC = () => {
  const assignments = [
    {
      id: 1,
      title: 'Algebra Homework',
      subject: 'Mathematics',
      dueDate: '2024-02-01',
      status: 'submitted',
      grade: 'A',
      points: 95,
      type: 'homework'
    },
    {
      id: 2,
      title: 'Science Lab Report',
      subject: 'Science',
      dueDate: '2024-02-05',
      status: 'pending',
      grade: null,
      points: null,
      type: 'lab'
    },
    {
      id: 3,
      title: 'English Essay',
      subject: 'English Language',
      dueDate: '2024-02-03',
      status: 'in-progress',
      grade: null,
      points: null,
      type: 'essay'
    },
    {
      id: 4,
      title: 'History Project',
      subject: 'Social Studies',
      dueDate: '2024-02-10',
      status: 'not-started',
      grade: null,
      points: null,
      type: 'project'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'submitted': { label: 'Submitted', variant: 'default' as const, icon: CheckCircle },
      'in-progress': { label: 'In Progress', variant: 'secondary' as const, icon: Clock },
      'pending': { label: 'Pending', variant: 'outline' as const, icon: Clock },
      'not-started': { label: 'Not Started', variant: 'outline' as const, icon: XCircle }
    };
    
    const config = variants[status as keyof typeof variants];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignments & Assessments</CardTitle>
        <CardDescription>Track your assignments, homework, and assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      assignment.type === 'homework' ? 'bg-blue-100 text-blue-600' :
                      assignment.type === 'lab' ? 'bg-green-100 text-green-600' :
                      assignment.type === 'essay' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{assignment.title}</div>
                      <div className="text-sm text-muted-foreground">{assignment.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {assignment.grade && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{assignment.grade}</div>
                        <div className="text-sm text-muted-foreground">{assignment.points} points</div>
                      </div>
                    )}
                    {getStatusBadge(assignment.status)}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Performance View Component
const PerformanceView: React.FC = () => {
  const gradeScale = [
    { grade: 'A', points: '90-100%', meaning: 'Excellent - Outstanding performance' },
    { grade: 'B', points: '80-89%', meaning: 'Very Good - Above average performance' },
    { grade: 'C', points: '70-79%', meaning: 'Good - Average performance' },
    { grade: 'D', points: '60-69%', meaning: 'Satisfactory - Below average' },
    { grade: 'E', points: '50-59%', meaning: 'Pass - Minimum passing grade' },
    { grade: 'F', points: '0-49%', meaning: 'Fail - Needs improvement' }
  ];

  const performanceData = {
    overallAverage: 85.6,
    termProgress: 65,
    subjects: [
      { name: 'Mathematics', average: 92, test: 28, quiz: 9, exam: 55, grade: 'A' },
      { name: 'English Language', average: 88, test: 26, quiz: 8, exam: 54, grade: 'B' },
      { name: 'Science', average: 85, test: 25, quiz: 8, exam: 52, grade: 'B' },
      { name: 'Social Studies', average: 78, test: 23, quiz: 7, exam: 48, grade: 'C' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{performanceData.overallAverage}%</div>
              <div className="text-muted-foreground">Overall Average</div>
              <Progress value={performanceData.overallAverage} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">B+</div>
              <div className="text-muted-foreground">Current Grade</div>
              <div className="text-sm text-muted-foreground mt-1">Very Good Performance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{performanceData.termProgress}%</div>
              <div className="text-muted-foreground">Term Progress</div>
              <Progress value={performanceData.termProgress} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Breakdown by subject with test (30%), quiz (10%), and exam (60%) scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.subjects.map((subject, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{subject.name}</div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Average: {subject.average}%</Badge>
                    <Badge variant={subject.grade === 'A' ? 'default' : subject.grade === 'B' ? 'secondary' : 'outline'}>
                      Grade: {subject.grade}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Tests (30%)</span>
                      <span>{subject.test}/30</span>
                    </div>
                    <Progress value={(subject.test/30)*100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Quizzes (10%)</span>
                      <span>{subject.quiz}/10</span>
                    </div>
                    <Progress value={(subject.quiz/10)*100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Exams (60%)</span>
                      <span>{subject.exam}/60</span>
                    </div>
                    <Progress value={(subject.exam/60)*100} className="h-2" />
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Scale</CardTitle>
          <CardDescription>Understanding your grades and what they mean</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeScale.map((grade, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                grade.grade === 'A' ? 'border-green-200 bg-green-50' :
                grade.grade === 'B' ? 'border-blue-200 bg-blue-50' :
                grade.grade === 'C' ? 'border-yellow-200 bg-yellow-50' :
                grade.grade === 'D' ? 'border-orange-200 bg-orange-50' :
                grade.grade === 'E' ? 'border-red-200 bg-red-50' :
                'border-muted bg-muted/50'
              }`}>
                <div className="text-2xl font-bold text-center mb-2">{grade.grade}</div>
                <div className="text-sm text-center text-muted-foreground mb-2">{grade.points}</div>
                <div className="text-xs text-center text-muted-foreground">{grade.meaning}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Messages View Component
const MessagesView: React.FC = () => {
  const messages = [
    {
      id: 1,
      from: 'Mr. Smith',
      subject: 'Mathematics Assignment Feedback',
      message: 'Great work on the algebra assignment! Your problem-solving approach was excellent.',
      timestamp: '2024-01-28T14:30:00Z',
      read: true,
      type: 'feedback'
    },
    {
      id: 2,
      from: 'Mrs. Johnson',
      subject: 'English Essay Reminder',
      message: 'Remember to submit your essay by Friday. Let me know if you need help.',
      timestamp: '2024-01-27T10:15:00Z',
      read: false,
      type: 'reminder'
    },
    {
      id: 3,
      from: 'Dr. Brown',
      subject: 'Science Lab Schedule',
      message: 'Lab session moved to Thursday. Please bring your lab coat.',
      timestamp: '2024-01-26T16:45:00Z',
      read: true,
      type: 'announcement'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages from Teachers</CardTitle>
        <CardDescription>Communicate with your teachers and receive feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                !msg.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {msg.from.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{msg.from}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium text-foreground mb-1">{msg.subject}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{msg.message}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {msg.type}
                      </Badge>
                      {!msg.read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Study Groups View Component
const StudyGroupsView: React.FC = () => {
  const studyGroups = [
    {
      id: 1,
      name: 'Math Study Group',
      subject: 'Mathematics',
      teacher: 'Mr. Smith',
      members: 8,
      nextMeeting: '2024-02-02T15:00:00Z',
      description: 'Focus on algebra and geometry problems'
    },
    {
      id: 2,
      name: 'Science Club',
      subject: 'Science',
      teacher: 'Dr. Brown',
      members: 12,
      nextMeeting: '2024-02-03T14:00:00Z',
      description: 'Lab experiments and science projects'
    },
    {
      id: 3,
      name: 'English Literature Circle',
      subject: 'English Language',
      teacher: 'Mrs. Johnson',
      members: 6,
      nextMeeting: '2024-02-04T16:00:00Z',
      description: 'Book discussions and essay writing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studyGroups.map((group) => (
        <Card key={group.id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{group.name}</span>
              <Badge variant="secondary">{group.members} members</Badge>
            </CardTitle>
            <CardDescription>{group.subject} • {group.teacher}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{group.description}</p>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next: {new Date(group.nextMeeting).toLocaleDateString()} at {new Date(group.nextMeeting).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                View Members
              </Button>
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Join Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Join New Group Card */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Join a Study Group</h3>
          <p className="text-sm text-muted-foreground mb-4">Collaborate with classmates and improve your learning</p>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Browse Groups
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;