'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
    ArrowLeft,
    BookOpen,
    CalendarClock,
    ClipboardCheck,
    Download,
    ExternalLink,
    PlayCircle,
    Users,
    CheckCircle2,
    Clock3,
    FileText,
    MessageSquare,
    Award,
    ChevronRight,
    FolderOpen,
    Target,
    Video,
    File,
    Link as LinkIcon,
    Loader2,
    AlertCircle,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentQueries } from "@/hooks/useStudentQueries";

export default function StudentCourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.courseId as string;
    const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'assessments' | 'resources'>('overview');
    
    const { useCourses, useStudentCourses, useAssessments, useAttendance } = useStudentQueries();
    const { data: coursesResponse, isLoading: coursesLoading } = useCourses();
    const { data: studentCoursesResponse, isLoading: studentCoursesLoading } = useStudentCourses();
    const { data: assessmentsResponse, isLoading: assessmentsLoading } = useAssessments();
    const { data: attendanceResponse } = useAttendance();

    const isLoading = coursesLoading || studentCoursesLoading || assessmentsLoading;

    // Get the course data from API
    const course = useMemo(() => {
        if (!coursesResponse?.data || !studentCoursesResponse?.data?.data) return null;
        
        const moodleCourses = coursesResponse.data;
        const studentCourses = studentCoursesResponse.data.data;
        
        // Find the moodle course
        const moodleCourse = moodleCourses.find((c: any) => c.id === parseInt(courseId));
        if (!moodleCourse) return null;
        
        // Find matching student course data
        const matchingStudentCourse = studentCourses.find((sc: any) => 
            sc.name?.toLowerCase() === moodleCourse.fullname?.toLowerCase() ||
            sc.code?.toLowerCase() === moodleCourse.shortname?.toLowerCase()
        );
        
        // Filter assessments for this course
        const courseAssessments = (assessmentsResponse?.data || []).filter((a: any) => 
            a.subject?.toLowerCase().includes(moodleCourse.fullname?.toLowerCase()) ||
            moodleCourse.fullname?.toLowerCase().includes(a.subject?.toLowerCase() || '')
        );
        
        return {
            id: moodleCourse.id,
            fullname: moodleCourse.fullname,
            shortname: moodleCourse.shortname,
            code: moodleCourse.shortname,
            summary: moodleCourse.summary,
            format: moodleCourse.format,
            startdate: moodleCourse.startdate,
            enddate: moodleCourse.enddate,
            timecreated: moodleCourse.timecreated,
            timemodified: moodleCourse.timemodified,
            visible: moodleCourse.visible,
            isEnrolled: !!matchingStudentCourse,
            progress: matchingStudentCourse?.progress || 0,
            currentGrade: matchingStudentCourse?.currentGrade || 'N/A',
            teacher: matchingStudentCourse?.teacher || {
                id: 0,
                name: 'Not Assigned',
                email: '',
                bio: ''
            },
            studentCount: matchingStudentCourse?.studentCount || 0,
            assignments: matchingStudentCourse?.assignments || 0,
            materialsCount: matchingStudentCourse?.materials || 0,
            nextTopic: matchingStudentCourse?.nextTopic || 'Not Available',
            schedule:  'Schedule TBA',
            room:  'TBA',
            term:  'Current Term',
            assessments: courseAssessments.map((a: any) => ({
                id: a.id,
                title: a.title,
                type: a.type,
                due: a.date,
                score: a.score,
                maxScore: a.max_score,
                status: a.score !== null ? 'completed' : 'pending'
            })),
            // Mock data for topics and materials (these would come from a separate API)
            topics: [
                { id: 1, title: "Introduction to Programming", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 10 : false, duration: "2 hours" },
                { id: 2, title: "Variables and Data Types", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 25 : false, duration: "3 hours" },
                { id: 3, title: "Control Structures", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 40 : false, duration: "4 hours" },
                { id: 4, title: "Functions and Modules", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 55 : false, duration: "3 hours" },
                { id: 5, title: "Advanced Concepts", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 70 : false, duration: "5 hours" },
                { id: 6, title: "Final Project", completed: matchingStudentCourse?.progress ? matchingStudentCourse.progress > 85 : false, duration: "10 hours" }
            ],
            materials: [
                { id: 1, title: "Course Syllabus", type: "PDF", size: "2.5 MB", downloadable: true, href: "#" },
                { id: 2, title: "Lecture Slides", type: "PPTX", size: "5.1 MB", downloadable: true, href: "#" },
                { id: 3, title: "Introduction Video", type: "Video", duration: "45 min", href: "#" },
                { id: 4, title: "Practice Exercises", type: "Document", size: "0.8 MB", downloadable: true, href: "#" }
            ],
            announcements: [
                { id: 1, title: "Course Update", date: new Date().toISOString(), content: "Welcome to the course! Please review the syllabus." }
            ]
        };
    }, [coursesResponse, studentCoursesResponse, assessmentsResponse, courseId]);

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <div className="text-lg text-muted-foreground">Loading course details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                <section className="rounded-3xl border border-border/70 bg-card p-6">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The requested course does not exist or is not available.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/student/classes" className="inline-flex items-center gap-2">
                                <ArrowLeft size={16} />
                                Back to Classes
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    const formatDate = (timestamp: number) => {
        if (!timestamp || timestamp === 0) return 'Not set';
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateString = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const completedTopics = course.topics.filter(t => t.completed).length;
    const totalTopics = course.topics.length;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <section className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-cyan-500/10 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Link href="/student/classes">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    <ArrowLeft size={16} />
                                    Back
                                </Button>
                            </Link>
                            <Badge variant="outline">{course.code}</Badge>
                            <Badge variant={course.isEnrolled ? "default" : "secondary"}>
                                {course.isEnrolled ? "Enrolled" : "Available"}
                            </Badge>
                            {course.format && (
                                <Badge variant="outline">{course.format}</Badge>
                            )}
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{course.fullname}</h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                            {course.summary?.replace(/<[^>]*>/g, '') || 'No description available'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                        <p className="text-[11px] text-muted-foreground">Teacher</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{course.teacher?.name || 'Not Assigned'}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                        <p className="text-[11px] text-muted-foreground">Schedule</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{course.schedule}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                        <p className="text-[11px] text-muted-foreground">Term</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{course.term}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
                        <p className="text-[11px] text-muted-foreground">Progress</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{course.progress}%</p>
                    </div>
                </div>
            </section>

            {/* Course Content Tabs */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
                <TabsList className="bg-card/50 border border-border/70">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="content">Course Content</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Course Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {course.summary?.replace(/<[^>]*>/g, '') || 'No description available'}
                                    </p>
                                </CardContent>
                            </Card>

                            {course.isEnrolled && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Topics</CardTitle>
                                        <CardDescription>
                                            {completedTopics} of {totalTopics} topics completed
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {course.topics.map((topic, index) => (
                                                <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-background/60">
                                                    <div className="flex items-center gap-3">
                                                        {topic.completed ? (
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        ) : (
                                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {index + 1}. {topic.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{topic.duration}</p>
                                                        </div>
                                                    </div>
                                                    {!topic.completed && (
                                                        <Button size="sm" variant="outline">
                                                            Resume
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {course.isEnrolled && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center mb-4">
                                            <div className="text-3xl font-bold text-foreground">{course.progress}%</div>
                                            <div className="text-sm text-muted-foreground">Overall Progress</div>
                                        </div>
                                        <Progress value={course.progress} className="h-2 mb-4" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-2 bg-primary/5 rounded-lg">
                                                <div className="text-lg font-bold">{course.currentGrade}</div>
                                                <div className="text-xs text-muted-foreground">Current Grade</div>
                                            </div>
                                            <div className="text-center p-2 bg-primary/5 rounded-lg">
                                                <div className="text-lg font-bold">{course.assignments}</div>
                                                <div className="text-xs text-muted-foreground">Assignments</div>
                                            </div>
                                        </div>
                                        {course.nextTopic && course.nextTopic !== 'Not Available' && (
                                            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                                                <p className="text-xs text-yellow-600 font-semibold">Next Topic</p>
                                                <p className="text-sm text-foreground">{course.nextTopic}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Teacher</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {course.teacher?.name?.charAt(0) || 'T'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{course.teacher?.name || 'Not Assigned'}</p>
                                            <p className="text-sm text-muted-foreground">{course.teacher?.email || 'No email available'}</p>
                                            <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Message
                                            </Button>
                                        </div>
                                    </div>
                                    {/* {course.teacher?.bio && (
                                        <p className="mt-3 text-sm text-muted-foreground">{course.teacher.bio}</p>
                                    )} */}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Students Enrolled:</span>
                                        <span className="font-medium">{course.studentCount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Materials:</span>
                                        <span className="font-medium">{course.materialsCount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Live Sessions:</span>
                                        <span className="font-medium">{course.schedule}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Room:</span>
                                        <span className="font-medium">{course.room}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Course Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Materials</CardTitle>
                            <CardDescription>Access all course materials and resources</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {course.isEnrolled ? (
                                <div className="space-y-4">
                                    {course.materials.map((material: any) => (
                                        <div key={material.id} className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-background/60">
                                            <div className="flex items-center gap-3">
                                                {material.type === "Video" ? (
                                                    <Video className="h-5 w-5 text-blue-500" />
                                                ) : material.type === "PDF" ? (
                                                    <File className="h-5 w-5 text-red-500" />
                                                ) : (
                                                    <FileText className="h-5 w-5 text-green-500" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-foreground">{material.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {material.type} • {material.size || material.duration}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={material.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                                                        <ExternalLink size={14} />
                                                        Open
                                                    </Link>
                                                </Button>
                                                {material.downloadable && (
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={material.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                                                            <Download size={14} />
                                                            Download
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Enroll to Access Content</h3>
                                    <p className="text-muted-foreground">
                                        You need to enroll in this course to access learning materials.
                                    </p>
                                    <Button className="mt-4">
                                        Enroll Now
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Assessments Tab */}
                <TabsContent value="assessments" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assessments & Grades</CardTitle>
                            <CardDescription>Track your performance in this course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {course.assessments.length > 0 ? (
                                <div className="space-y-4">
                                    {course.assessments.map((assessment: any) => (
                                        <div key={assessment.id} className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-background/60">
                                            <div>
                                                <p className="font-medium text-foreground">{assessment.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {assessment.type} • Due: {assessment.due ? formatDateString(assessment.due) : 'No due date'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {assessment.score !== null ? (
                                                    <>
                                                        <div className="font-bold text-foreground">
                                                            {assessment.score}/{assessment.maxScore}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {((assessment.score / assessment.maxScore) * 100).toFixed(0)}%
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Badge variant="secondary">Pending</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No assessments available for this course yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Resources</CardTitle>
                                <CardDescription>Additional learning materials</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/70">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Course Forum</span>
                                        </div>
                                        <Button size="sm" variant="ghost">
                                            Visit
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/70">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Recommended Reading List</span>
                                        </div>
                                        <Button size="sm" variant="ghost">
                                            Download
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/70">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Study Group</span>
                                        </div>
                                        <Button size="sm" variant="ghost">
                                            Join
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Announcements</CardTitle>
                                <CardDescription>Latest updates from your teacher</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {course.announcements.map((announcement: any) => (
                                        <div key={announcement.id} className="p-3 rounded-xl bg-muted/30">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-medium text-foreground">{announcement.title}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDateString(announcement.date)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {course.isEnrolled ? (
                    <>
                        <Button size="lg" className="gap-2">
                            <PlayCircle size={18} />
                            Continue Learning
                        </Button>
                        <Button size="lg" variant="outline" className="gap-2">
                            <MessageSquare size={18} />
                            Ask Question
                        </Button>
                    </>
                ) : (
                    <Button size="lg" className="gap-2">
                        <GraduationCap size={18} />
                        Enroll Now
                    </Button>
                )}
            </div>
        </div>
    );
}