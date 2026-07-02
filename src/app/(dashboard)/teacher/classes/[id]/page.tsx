'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
    Users,
    UserPlus,
    Search,
    Download,
    Calendar,
    MessageSquare,
    Loader2,
    AlertCircle,
    ArrowLeft,
    PlayCircle,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Import the actual hooks and services
import { useTeacherQueries } from '@/hooks/useTeacherQueries';
import { StudentsOverview } from './components/StudentsOverview';
import { AttendanceOverview } from './components/AttendanceOverview';
import { MessageDialog } from './components/MessageDialog';
import { useStudentManagement } from './hook/useStudentManagement';
import { useAuthContext } from '@/providers/AuthProvider';
import { useParams } from 'next/navigation';
import { ExportFormat, GroupFormData, groupSchema, useExportStudents } from './hook/useExportStudents';

// LMS URL - update with your actual LMS URL
const LMS_BASE_URL = process.env.NEXT_PUBLIC_LMS_URL || 'https://your-lms.com';

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

const StudentManagementPage: React.FC = () => {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { user } = useAuthContext();
    const teacherId = user?.id ? Number(user.id) : 1;

    const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'attendance'>('students');
    const [dialogOpen, setDialogOpen] = useState<'createGroup' | 'manageGroup' | 'sendMessage' | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [filters] = useState({
        term: '1st',
        classId: id,
    });

    // Use actual service data
    const {
        students,
        classes,
        attendance,
        isLoading,
        isError
    } = useStudentManagement(teacherId, filters);

    // Export functionality
    const { exportToCSV, exportToExcel, exportToPDF } = useExportStudents();

    // Group mutations
    const {
        useCreateGroup,
        useDeleteGroup,
    } = useTeacherQueries();

    const createGroupMutation = useCreateGroup();
    const deleteGroupMutation = useDeleteGroup();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
    });

    // Available classes from service data
    const availableClasses = Array.isArray(classes) ? classes.map(cls => ({
        id: cls.id || 0,
        name: cls.name || cls.shortName || 'Unknown Class',
        level: cls.level || ''
    })) : [];

    // Filter students based on search term
    const filteredStudents = useMemo(() => {
        if (!Array.isArray(students)) return [];
        return students.filter((student) => {
            if (!student) return false;
            const nameMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const emailMatch = student.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const classNameMatch = student.class?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            return nameMatch || emailMatch || classNameMatch;
        });
    }, [students, searchTerm]);

    // Calculate attendance rate safely
    const getAttendanceRate = () => {
        if (!attendance || !attendance.daily || attendance.daily.length === 0) {
            return 0;
        }
        const total = attendance.daily.reduce((acc: number, day: any) => acc + (day.rate || 0), 0);
        return Math.round(total / attendance.daily.length);
    };

    const attendanceRate = getAttendanceRate();

    // Generate LMS URL for the course
    const courseLmsUrl = `${LMS_BASE_URL}/course/view.php?id=${id}`;

    const onSubmitGroup = async (data: GroupFormData) => {
        try {
            if (!teacherId) {
                toast.error('Teacher ID not found');
                return;
            }

            await createGroupMutation.mutateAsync({
                ...data,
                classId: filters.classId,
                className: availableClasses.find(c => c.id === filters.classId)?.name || '',
                studentIds: [],
                createdBy: teacherId,
            });

            toast.success(`"${data.name}" group created successfully!`);
            reset();
            setDialogOpen(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create group. Please try again.');
        }
    };

    const handleDeleteGroup = async (groupId: number) => {
        try {
            await deleteGroupMutation.mutateAsync(groupId);
            toast.success('Group deleted successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete group. Please try again.');
        }
    };

    const handleExportData = (format: ExportFormat, studentsToExport: any[]) => {
        if (!Array.isArray(studentsToExport) || studentsToExport.length === 0) {
            toast.error('No students to export');
            return;
        }

        const className = availableClasses.find(c => c.id === filters.classId)?.name || 'students';
        const filename = `${className}_${filters.term}`;

        try {
            switch (format) {
                case 'csv':
                    exportToCSV(studentsToExport, filename);
                    toast.success(`Exported ${studentsToExport.length} students as CSV`);
                    break;
                case 'excel':
                    exportToExcel(studentsToExport, filename);
                    toast.success(`Exported ${studentsToExport.length} students as Excel`);
                    break;
                case 'pdf':
                    exportToPDF(studentsToExport, filename);
                    toast.success(`Exported ${studentsToExport.length} students as PDF`);
                    break;
                default:
                    toast.error('Unsupported export format');
            }
        } catch (error) {
            toast.error('Failed to export data. Please try again.');
            console.error('Export error:', error);
        }
    };

    const handleSendMessage = (studentIds: number[], message: string, method: 'sms' | 'email' | 'in-app') => {
        toast.success(`Message sent to ${studentIds.length} student(s) via ${method}`);
        setDialogOpen(null);
    };

    const toggleStudentSelection = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const selectAllStudents = () => {
        if (!Array.isArray(students) || students.length === 0) {
            setSelectedStudents([]);
            return;
        }
        
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map((student) => student.id || 0));
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading student data...</p>
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
                        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Data</h3>
                        <p className="text-muted-foreground mb-4">
                            Unable to load student information. Please try again later.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const totalStudents = Array.isArray(students) ? students.length : 0;
    const className = availableClasses.find(c => c.id === filters.classId)?.name || 'Course';
    const courseName = attendance?.course_details?.fullname || className;

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
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/teacher/classes">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    <ArrowLeft size={16} />
                                    Back
                                </Button>
                            </Link>
                            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Course Details</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{courseName}</h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Manage students, track attendance, and organize groups for this course.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* Continue Button - Redirects to LMS */}
                        <Link href={courseLmsUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="default" size="sm" className="gap-2">
                                <PlayCircle size={16} />
                                Continue Course
                                <ExternalLink size={14} />
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setDialogOpen('sendMessage')}>
                            <MessageSquare size={16} />
                            Message
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <StatPill label="Total Students" value={totalStudents} />
                    <StatPill label="Classes" value={availableClasses.length} />
                    <StatPill label="Term" value={filters.term} />
                    <StatPill label="Attendance Rate" value={`${attendanceRate}%`} />
                </div>
            </motion.section>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DashboardCard
                    title="Total Students"
                    subtitle="Enrolled in this course"
                    icon={<Users size={18} />}
                >
                    <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active students</p>
                </DashboardCard>

                <DashboardCard
                    title="Attendance Rate"
                    subtitle="Overall class attendance"
                    icon={<Calendar size={18} />}
                >
                    <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">This term</p>
                </DashboardCard>

                <DashboardCard
                    title="Groups"
                    subtitle="Student groups"
                    icon={<Users size={18} />}
                >
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Create groups to organize students</p>
                </DashboardCard>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
                <TabsList className="bg-card/50 border border-border/70">
                    <TabsTrigger value="students" className="gap-2">
                        <Users size={14} />
                        Students ({totalStudents})
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="gap-2">
                        <Calendar size={14} />
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="gap-2">
                        <Users size={14} />
                        Groups
                    </TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students">
                    <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div>
                                <p className="text-sm font-semibold text-card-foreground">Student Enrollments</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {courseName} • {totalStudents} students enrolled
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search students..."
                                        className="h-9 w-full rounded-xl border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
                                    />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setDialogOpen('sendMessage')} className="gap-2">
                                    <MessageSquare size={14} />
                                    Message
                                </Button>
                            </div>
                        </div>

                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">No Students Found</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {searchTerm ? 'No students match your search criteria' : 'No students available in this class'}
                                </p>
                                {searchTerm && (
                                    <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <StudentsOverview
                                students={filteredStudents}
                                selectedStudents={selectedStudents}
                                onStudentSelect={toggleStudentSelection}
                                onSelectAll={selectAllStudents}
                                className={className}
                            />
                        )}
                    </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                    <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
                        <AttendanceOverview attendance={attendance} />
                    </div>
                </TabsContent>

                {/* Groups Tab */}
                <TabsContent value="groups">
                    <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm font-semibold text-card-foreground">Student Groups</p>
                                <p className="text-xs text-muted-foreground mt-1">Organize students into groups for better management</p>
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => setDialogOpen('createGroup')}>
                                <UserPlus size={14} />
                                Create Group
                            </Button>
                        </div>

                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">No groups yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Create your first student group to get started</p>
                            <Button onClick={() => setDialogOpen('createGroup')} className="gap-2">
                                <UserPlus size={16} />
                                Create Group
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Group Dialog */}
            <Dialog open={dialogOpen === 'createGroup'} onOpenChange={(open) => setDialogOpen(open ? 'createGroup' : null)}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create Student Group</DialogTitle>
                        <DialogDescription>
                            Organize students into groups for better management and collaboration
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitGroup)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="e.g., Science Olympiad Team"
                                className="rounded-xl"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                {...register('description')}
                                placeholder="Brief description of the group's purpose..."
                                className="rounded-xl"
                            />
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createGroupMutation.isPending}>
                                {createGroupMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : 'Create Group'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Send Message Dialog */}
            <Dialog open={dialogOpen === 'sendMessage'} onOpenChange={(open) => setDialogOpen(open ? 'sendMessage' : null)}>
                <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold">Send Message to Students</DialogTitle>
                        <DialogDescription>
                            Send messages to individual students or groups via SMS, email, or in-app notification.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <MessageDialog
                                students={students}
                                selectedStudents={selectedStudents}
                                onStudentSelect={toggleStudentSelection}
                                onSelectAll={selectAllStudents}
                                onSendMessage={handleSendMessage}
                            />
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentManagementPage;