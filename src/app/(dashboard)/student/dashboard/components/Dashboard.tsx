'use client';

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
    Award,
    Bell,
    BookOpen,
    Brain,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    ExternalLink,
    Flame,
    GraduationCap,
    PlayCircle,
    Trophy,
    User,
    TrendingUp,
    AlertCircle,
    Settings,
    FileText,
    Users,
    MessageSquare,
    Star,
    XCircle,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudentQueries } from '@/hooks/useStudentQueries';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardCardProps {
    title: string;
    subtitle?: string;
    icon: ReactNode;
    children: ReactNode;
    action?: ReactNode;
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

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const { useDashboardSummary, useGamificationData, useClasses, useAssessments, useAttendance } = useStudentQueries();
    
    const { data: dashboardResponse, isLoading: dashboardLoading } = useDashboardSummary();
    const { data: gamificationResponse, isLoading: gamificationLoading } = useGamificationData();
    const { data: classesResponse, isLoading: classesLoading } = useClasses();
    const { data: assessmentsResponse, isLoading: assessmentsLoading } = useAssessments();
    const { data: attendanceResponse, isLoading: attendanceLoading } = useAttendance();

    const isLoading = dashboardLoading || gamificationLoading || classesLoading || assessmentsLoading || attendanceLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <div className="text-lg text-muted-foreground">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const dashboardData = dashboardResponse?.data;
    const gamificationData = gamificationResponse?.data;
    const classes = classesResponse?.data || [];
    const assessments = assessmentsResponse?.data || [];
    const attendance = attendanceResponse?.data || [];

    if (!dashboardData) {
        return (
            <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
                <div className="text-center max-w-sm mx-auto">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg text-foreground">No dashboard data available</div>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Refresh
                    </Button>
                </div>
            </div>
        );
    }

    const { profile, upcomingDeadlines } = dashboardData;
    
    const studentId = profile?.admission_no || profile?.user_id?.toString() || 'Not assigned';
    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student';
    const firstName = profile?.first_name || 'Student';
    
    // Safe access with fallbacks - these might come from meta or be undefined
    const department = profile?.meta?.department || 'Computer Science';
    const level = profile?.meta?.level || '400 Level';
    const faculty = profile?.meta?.faculty || 'Science';

    const attendancePercentage = attendance.length > 0
        ? (attendance.filter((a: any) => a.status === 'present').length / attendance.length) * 100
        : 0;

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    };

    // Prepare chart data
    const weeklyRankingData = gamificationData?.leaderboard?.slice(0, 5).map((entry: any) => ({
        name: entry.name?.split(' ')[0] || `Student ${entry.rank}`,
        grade: entry.points || 0,
    })) || [
        { name: "You", grade: 85 },
        { name: "Peer 1", grade: 78 },
        { name: "Peer 2", grade: 72 },
        { name: "Peer 3", grade: 68 },
        { name: "Peer 4", grade: 65 },
    ];

    const achievementData = (gamificationData?.badges?.filter((b: any) => b.earned) || []).slice(0, 4).map((badge: any, idx: number) => ({
        name: badge.name,
        value: badge.points || 10,
        color: ['#2563eb', '#f97316', '#0f766e', '#7c3aed'][idx % 4],
    }));

    if (achievementData.length === 0) {
        achievementData.push(
            { name: "CBT Passed", value: 18, color: "#2563eb" },
            { name: "Streaks", value: 7, color: "#f97316" },
            { name: "Live Classes", value: 9, color: "#0f766e" },
            { name: "Badges", value: 5, color: "#7c3aed" }
        );
    }

    const cbtPerformanceData = assessments.slice(0, 6).map((a: any, idx: number) => ({
        week: `W${idx + 1}`,
        score: a.score && a.max_score ? (a.score / a.max_score) * 100 : 70 + (idx * 3),
    }));

    if (cbtPerformanceData.length === 0) {
        cbtPerformanceData.push(
            { week: "W1", score: 72 },
            { week: "W2", score: 78 },
            { week: "W3", score: 76 },
            { week: "W4", score: 81 },
            { week: "W5", score: 87 },
            { week: "W6", score: 90 }
        );
    }

    const recentAssessments = assessments.slice(0, 5);
    const upcomingClasses = classes.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-sky-500/10 p-6"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            Student Dashboard
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                            {greeting()}, {firstName}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Track your learning rhythm, CBT readiness, and weekly class position from one focused dashboard.
                        </p>
                    </div>
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatPill label="Student ID" value={studentId} />
                    <StatPill label="Department" value={department} />
                    <StatPill label="Level" value={level} />
                </div>
            </motion.div>

            {/* Stats Grid - Removed Payment Summary Card */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DashboardCard
                    title="Study Streak"
                    subtitle="Your consistency pulse"
                    icon={<Flame size={18} />}
                >
                    <p className="text-3xl font-bold text-foreground">{gamificationData?.profile?.streak || 0} days</p>
                    <p className="mt-1 text-xs text-muted-foreground">Level {gamificationData?.profile?.level || 1} • {gamificationData?.profile?.points || 0} points</p>
                </DashboardCard>

                <DashboardCard
                    title="Subject Mastery"
                    subtitle="Most perfected subject"
                    icon={<Brain size={18} />}
                >
                    <p className="text-lg font-semibold text-foreground">
                        {assessments.length > 0 && assessments[0]?.subject 
                            ? assessments[0].subject 
                            : "Mathematics"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Avg score: {assessments.length > 0 && assessments[0]?.score && assessments[0]?.max_score
                            ? `${Math.round((assessments[0].score / assessments[0].max_score) * 100)}%` 
                            : '85%'}
                    </p>
                </DashboardCard>

                <DashboardCard
                    title="Class Ranking"
                    subtitle="Your position"
                    icon={<Trophy size={18} />}
                >
                    <p className="text-lg font-semibold text-foreground">#{gamificationData?.profile?.rank || 1}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Out of {gamificationData?.profile?.totalStudents || 50} students
                    </p>
                </DashboardCard>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-card/50 border border-border/70">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <DashboardCard
                            title="Continue Learning"
                            subtitle="Recommended lessons, live classes and achievements"
                            icon={<BookOpen size={18} />}
                        >
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended Lessons</p>
                                    <div className="mt-2 space-y-2">
                                        <Link
                                            href="/student/courses/csc401"
                                            className="block rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                                        >
                                            <p className="text-sm font-medium text-foreground">Software Engineering Sprint</p>
                                            <p className="mt-1 text-xs text-muted-foreground">21 mins left</p>
                                        </Link>
                                        <Link
                                            href="/student/courses/csc405"
                                            className="block rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                                        >
                                            <p className="text-sm font-medium text-foreground">Algorithms Quick Drills</p>
                                            <p className="mt-1 text-xs text-muted-foreground">14 mins left</p>
                                        </Link>
                                        <Link
                                            href="/student/courses/csc403"
                                            className="block rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                                        >
                                            <p className="text-sm font-medium text-foreground">Networks Transport Layer</p>
                                            <p className="mt-1 text-xs text-muted-foreground">32 mins left</p>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Classes</p>
                                    <div className="mt-2 space-y-2">
                                        <Link
                                            href="/student/timetable"
                                            className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">CSC 407 - Operating Systems</p>
                                                <p className="mt-1 text-xs text-muted-foreground">Starts at 10:30 AM</p>
                                            </div>
                                            <PlayCircle size={18} className="text-primary" />
                                        </Link>
                                        <Link
                                            href="/student/timetable"
                                            className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">MTH 401 - Numerical Analysis</p>
                                                <p className="mt-1 text-xs text-muted-foreground">Starts at 1:00 PM</p>
                                            </div>
                                            <PlayCircle size={18} className="text-primary" />
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Achievements</p>
                                    <div className="mt-2 space-y-2">
                                        <p className="text-xs text-muted-foreground">• 7-day consistency streak</p>
                                        <p className="text-xs text-muted-foreground">• Top 5 in weekly algorithm sprint</p>
                                        <p className="text-xs text-muted-foreground">• 3 consecutive CBT scores above 85%</p>
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Upcoming Deadlines & Classes"
                            subtitle="Pending assessments and scheduled classes"
                            icon={<Calendar size={18} />}
                            action={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => router.push('/student/timetable')}
                                >
                                    View Full Schedule
                                    <ExternalLink size={12} className="ml-1" />
                                </Button>
                            }
                        >
                            <div className="space-y-3">
                                {/* Upcoming Deadlines from API */}
                                {upcomingDeadlines && upcomingDeadlines.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Pending Assessments</p>
                                        {upcomingDeadlines.slice(0, 3).map((deadline: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="rounded-2xl border border-border/70 bg-background/60 p-3 mb-2"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                                                        <p className="text-xs text-muted-foreground">{deadline.subject}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {deadline.due ? new Date(deadline.due).toLocaleDateString() : 'Pending'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upcoming Classes */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Today's Classes</p>
                                    {upcomingClasses.length > 0 ? (
                                        upcomingClasses.map((classItem: any) => (
                                            <div
                                                key={classItem.id}
                                                className="rounded-2xl border border-border/70 bg-background/60 p-3 mb-2"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{classItem.name}</p>
                                                        <p className="text-xs text-muted-foreground">{classItem.schedule} • {classItem.teacher_name}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {classItem.room}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                                            <p className="text-sm text-muted-foreground">No upcoming classes scheduled</p>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Action Button */}
                                <Link
                                    href="/student/courses"
                                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                                >
                                    <GraduationCap size={16} />
                                    Browse All Courses
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <DashboardCard
                            title="Weekly Ranking"
                            subtitle="Top performers this week"
                            icon={<Trophy size={18} />}
                        >
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyRankingData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="grade" radius={[8, 8, 0, 0]} fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Achievements Overview"
                            subtitle="Points breakdown"
                            icon={<Award size={18} />}
                        >
                            <div className="h-52 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={achievementData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={48}
                                            outerRadius={70}
                                            paddingAngle={3}
                                        >
                                            {achievementData.map((entry: any) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* CBT Performance Trend */}
                    <DashboardCard
                        title="CBT Performance"
                        subtitle="Weekly trend"
                        icon={<TrendingUp size={18} />}
                    >
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cbtPerformanceData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="cbtScoreFill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                                    <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                                    <YAxis domain={[55, 100]} tickLine={false} axisLine={false} fontSize={12} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#0ea5e9"
                                        strokeWidth={2.5}
                                        fill="url(#cbtScoreFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </TabsContent>

                <TabsContent value="assessments" className="space-y-6">
                    <DashboardCard
                        title="All Assessments"
                        subtitle="Complete assessment history"
                        icon={<FileText size={18} />}
                    >
                        <div className="space-y-3">
                            {assessments.map((assessment: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">{assessment.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {assessment.subject} • {assessment.date ? new Date(assessment.date).toLocaleDateString() : 'Date not set'}
                                        </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        <Badge variant={assessment.score !== null ? "default" : "secondary"} className="text-sm">
                                            {assessment.score !== null && assessment.max_score
                                                ? `${assessment.score}/${assessment.max_score} (${Math.round((assessment.score / assessment.max_score) * 100)}%)`
                                                : 'Not graded'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {assessments.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No assessment records available</p>
                            )}
                        </div>
                    </DashboardCard>
                </TabsContent>

                <TabsContent value="classes" className="space-y-6">
                    <DashboardCard
                        title="My Classes"
                        subtitle="Enrolled subjects and courses"
                        icon={<BookOpen size={18} />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classes.map((classItem: any) => (
                                <div
                                    key={classItem.id}
                                    className="rounded-2xl border border-border/70 bg-background/60 p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-foreground">{classItem.name}</p>
                                            <p className="text-xs text-muted-foreground">{classItem.code} • {classItem.teacher_name}</p>
                                        </div>
                                        <Badge variant="outline">{classItem.term}</Badge>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Schedule:</span>
                                            <span>{classItem.schedule}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Room:</span>
                                            <span>{classItem.room}</span>
                                        </div>
                                        {classItem.attendance_percentage && (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-muted-foreground">Attendance:</span>
                                                    <span>{classItem.attendance_percentage}%</span>
                                                </div>
                                                <Progress value={classItem.attendance_percentage} className="h-1.5" />
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href={`/student/classes/${classItem.id}`}
                                        className="mt-3 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
                                    >
                                        View Details
                                        <ChevronRight size={12} />
                                    </Link>
                                </div>
                            ))}
                            {classes.length === 0 && (
                                <p className="text-center text-muted-foreground py-8 col-span-2">No classes available</p>
                            )}
                        </div>
                    </DashboardCard>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-6">
                    <DashboardCard
                        title="Attendance Records"
                        subtitle="Your attendance history"
                        icon={<CheckCircle size={18} />}
                    >
                        <div className="mb-4 p-4 rounded-2xl bg-primary/5">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-foreground">{attendancePercentage.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">Overall Attendance Rate</p>
                            </div>
                            <Progress value={attendancePercentage} className="h-2 mt-3" />
                        </div>
                        <div className="space-y-2">
                            {attendance.slice(0, 10).map((record: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{record.subject}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {record.date ? new Date(record.date).toLocaleDateString() : 'Date not set'}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        record.status === 'present' ? 'default' :
                                        record.status === 'absent' ? 'destructive' : 'secondary'
                                    }>
                                        {record.status || 'N/A'}
                                    </Badge>
                                </div>
                            ))}
                            {attendance.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No attendance records available</p>
                            )}
                        </div>
                    </DashboardCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}