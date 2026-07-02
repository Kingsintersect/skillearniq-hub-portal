'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
    Users,
    UserPlus,
    Search,
    Download,
    Calendar,
    MessageSquare,
    FileText,
    Sheet,
    FileDown,
    Loader2,
    AlertCircle
} from 'lucide-react';

// Import the actual hooks and services
import { useTeacherQueries } from '@/hooks/useTeacherQueries';
import { StudentsOverview } from './components/StudentsOverview';
import { AttendanceOverview } from './components/AttendanceOverview';
import { GroupManagement } from './components/GroupManagement';
import { MessageDialog } from './components/MessageDialog';
import { useStudentManagement } from './hook/useStudentManagement';
import { useAuthContext } from '@/providers/AuthProvider';
import { useParams } from 'next/navigation';
import { ExportFormat, GroupFormData, groupSchema, useExportStudents } from './hook/useExportStudents';

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
    
    // FIXED: Use the actual class ID from URL
    const [filters] = useState({
        term: '1st',
        classId: id, // This is now the actual class ID from the URL
    });

    console.log('=== PAGE DEBUG ===');
    console.log('URL Class ID:', id);
    console.log('Teacher ID:', teacherId);
    console.log('Filters:', filters);

    // Use actual service data
    const {
        students,
        classes,
        attendance,
        isLoading,
        isError
    } = useStudentManagement(teacherId, filters);

    console.log('Students data:', students);
    console.log('Classes data:', classes);
    console.log('Attendance data:', attendance);
    console.log('Course details:', attendance?.course_details);
    console.log('=== END PAGE DEBUG ===');

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

    const terms = ['1st', '2nd', '3rd'];

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

    // Properly define the onSubmitGroup function
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
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Student Data</h3>
                    <p className="text-muted-foreground mb-4">
                        Unable to load student information. Please try again later.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const totalStudents = Array.isArray(students) ? students.length : 0;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <Users className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Student Management</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage {totalStudents} student{totalStudents !== 1 ? 's' : ''} across {availableClasses.length} class{availableClasses.length !== 1 ? 'es' : ''}
                    </p>
                </div>

                {/* Quick Actions Card */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                           
                            
                        </div>

                        {/* Filters and Search */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search students by name, email, or class..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="text-2xl font-bold">{totalStudents}</div>
                                <div className="text-sm text-muted-foreground">Total Students</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="text-2xl font-bold">{availableClasses.length}</div>
                                <div className="text-sm text-muted-foreground">Classes</div>
                            </div>
                            
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="students" className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Students ({totalStudents})</span>
                        </TabsTrigger>
                       
                        <TabsTrigger value="attendance" className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Attendance</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Students Tab */}
                    <TabsContent value="students">
                        {filteredStudents.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm ? 'No students match your search criteria' : 'No students available in this class'}
                                    </p>
                                    {searchTerm && (
                                        <Button 
                                            variant="outline" 
                                            className="mt-4"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <StudentsOverview
                                students={filteredStudents}
                                selectedStudents={selectedStudents}
                                onStudentSelect={toggleStudentSelection}
                                onSelectAll={selectAllStudents}
                                className={availableClasses.find(c => c.id === filters.classId)?.name || ''}
                            />
                        )}
                    </TabsContent>

                    {/* Groups Tab */}
                    {/* <TabsContent value="groups">
                        <GroupManagement
                            groups={Array.isArray(groupsQuery.data?.data) ? groupsQuery.data.data : []}
                            students={students}
                            onManageGroup={(group) => {
                                setSelectedGroup(group);
                                setDialogOpen('manageGroup');
                            }}
                            onDeleteGroup={handleDeleteGroup}
                        />
                    </TabsContent> */}

                    {/* Attendance Tab */}
                    <TabsContent value="attendance">
                        <AttendanceOverview
                            attendance={attendance}
                        />
                    </TabsContent>
                </Tabs>

                {/* Create Group Dialog */}
                <Dialog open={dialogOpen === 'createGroup'} onOpenChange={(open) => setDialogOpen(open ? 'createGroup' : null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Create Student Group</DialogTitle>
                            <DialogDescription className="text-md">
                                Organize students into groups for better management and collaboration
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmitGroup)} className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium">Group Name</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="e.g., Science Olympiad Team, Math Club"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                <Input
                                    id="description"
                                    {...register('description')}
                                    placeholder="Brief description of the group's purpose..."
                                />
                            </div>
                            <DialogFooter>
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

                {/* Manage Group Dialog */}
                <Dialog open={dialogOpen === 'manageGroup'} onOpenChange={(open) => setDialogOpen(open ? 'manageGroup' : null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Manage Group: {selectedGroup?.name}</DialogTitle>
                            <DialogDescription>
                                Add or remove students from this group
                            </DialogDescription>
                        </DialogHeader>
                        {/* {selectedGroup && (
                            <ScrollArea className="flex-1 pr-4">
                                <GroupManagement
                                    group={selectedGroup}
                                    students={students}
                                    onAddStudent={() => {}}
                                    onRemoveStudent={() => {}}
                                    onDelete={() => {
                                        handleDeleteGroup(selectedGroup.id);
                                        setDialogOpen(null);
                                    }}
                                />
                            </ScrollArea>
                        )} */}
                    </DialogContent>
                </Dialog>

                {/* Send Message Dialog */}
                <Dialog open={dialogOpen === 'sendMessage'} onOpenChange={(open) => setDialogOpen(open ? 'sendMessage' : null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                        <ScrollArea className='h-[400px]'>
                            <DialogHeader>
                                <DialogTitle>Send Message to Students</DialogTitle>
                                <DialogDescription>
                                    Send messages to individual students or groups via SMS, email, or in-app notification.
                                </DialogDescription>
                            </DialogHeader>
                            <MessageDialog
                                students={students}
                                selectedStudents={selectedStudents}
                                onStudentSelect={toggleStudentSelection}
                                onSelectAll={selectAllStudents}
                                onSendMessage={handleSendMessage}
                            />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default StudentManagementPage;