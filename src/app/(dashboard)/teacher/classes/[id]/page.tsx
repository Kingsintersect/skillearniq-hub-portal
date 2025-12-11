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
    FileDown
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
    const teacherId = Number(user?.id) || 1; // This should come from your auth context or props

    const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'attendance'>('students');
    const [dialogOpen, setDialogOpen] = useState<'createGroup' | 'manageGroup' | 'sendMessage' | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        term: '1st',
        classId: 1,
    });

    // Use actual service data
    const {
        students,
        classes,
        groups,
        attendance,
        isLoading
    } = useStudentManagement(id, filters);

    // Export functionality
    const { exportToCSV, exportToExcel, exportToPDF } = useExportStudents();

    // Group mutations
    const {
        useCreateGroup,
        useDeleteGroup,
        useAddStudentToGroup,
        useRemoveStudentFromGroup
    } = useTeacherQueries();

    const createGroupMutation = useCreateGroup();
    const deleteGroupMutation = useDeleteGroup();
    const addStudentMutation = useAddStudentToGroup();
    const removeStudentMutation = useRemoveStudentFromGroup();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
    });

    // Available classes from service data
    const availableClasses = classes.map(cls => ({
        id: cls.id,
        name: cls.shortName,
        level: cls.level
    }));

    const terms = ['1st', '2nd', '3rd'];

    // Filter students based on search term
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    // Properly define the onSubmitGroup function
    const onSubmitGroup = async (data: GroupFormData) => {
        try {
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
        } catch (error) {
            toast.error('Failed to create group. Please try again.');
        }
    };

    const handleDeleteGroup = async (groupId: number) => {
        try {
            await deleteGroupMutation.mutateAsync(groupId);
            toast.success('Group deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete group. Please try again.');
        }
    };

    const handleAddStudentToGroup = async (groupId: number, studentId: number) => {
        try {
            await addStudentMutation.mutateAsync({ groupId, studentId });
            toast.success('Student added to group!');
        } catch (error) {
            toast.error('Failed to add student to group.');
        }
    };

    const handleRemoveStudentFromGroup = async (groupId: number, studentId: number) => {
        try {
            await removeStudentMutation.mutateAsync({ groupId, studentId });
            toast.success('Student removed from group!');
        } catch (error) {
            toast.error('Failed to remove student from group.');
        }
    };

    const handleExportData = (format: ExportFormat, studentsToExport: any[]) => {
        if (studentsToExport.length === 0) {
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
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map((student) => student.id));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading student data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full">

                {/* Messaging and Export Selected Button */}
                <Card className="mb-6 px-12 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                            <Users className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Student Management</h1>
                        <p className="text-muted-foreground text-lg">Manage student enrollments, groups, and attendance records</p>
                    </div>
                    <CardContent className="space-y-10 p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="font-semibold">Quick Actions</h3>
                                <p className="text-sm text-muted-foreground">Send messages or export selected students</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen('sendMessage')}
                                    disabled={selectedStudents.length === 0}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message ({selectedStudents.length})
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={selectedStudents.length === 0}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Selected ({selectedStudents.length})
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleExportData('csv', students.filter(s => selectedStudents.includes(s.id)))}
                                            className="flex items-center space-x-2"
                                        >
                                            <Sheet className="h-4 w-4" />
                                            <span>Export as CSV</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleExportData('excel', students.filter(s => selectedStudents.includes(s.id)))}
                                            className="flex items-center space-x-2"
                                        >
                                            <FileDown className="h-4 w-4" />
                                            <span>Export as Excel</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleExportData('pdf', students.filter(s => selectedStudents.includes(s.id)))}
                                            className="flex items-center space-x-2"
                                        >
                                            <FileText className="h-4 w-4" />
                                            <span>Export as PDF</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="flex gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export All
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => handleExportData('csv', filteredStudents)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Sheet className="h-4 w-4" />
                                        <span>Export as CSV</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleExportData('excel', filteredStudents)}
                                        className="flex items-center space-x-2"
                                    >
                                        <FileDown className="h-4 w-4" />
                                        <span>Export as Excel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleExportData('pdf', filteredStudents)}
                                        className="flex items-center space-x-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>Export as PDF</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <Button onClick={() => setDialogOpen('createGroup')}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                New Group
                            </Button> */}
                        </div>
                        {/* Search Bar */}
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students by name, email, or class..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="students" className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Students</span>
                        </TabsTrigger>
                        {/* <TabsTrigger value="groups" className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Groups</span>
                        </TabsTrigger> */}
                        <TabsTrigger value="attendance" className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Attendance</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Students Tab */}
                    <TabsContent value="students">
                        <StudentsOverview
                            students={filteredStudents}
                            selectedStudents={selectedStudents}
                            onStudentSelect={toggleStudentSelection}
                            onSelectAll={selectAllStudents}
                            className={availableClasses.find(c => c.id === filters.classId)?.name || ''}
                        />
                    </TabsContent>

                    {/* Groups Tab */}
                    {/* <TabsContent value="groups">
                        <GroupsOverview
                            groups={groups}
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
                            term={filters.term}
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
                                    {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
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
                        {selectedGroup && (
                            <ScrollArea className="flex-1 pr-4">
                                <GroupManagement
                                    group={selectedGroup}
                                    students={students}
                                    onAddStudent={handleAddStudentToGroup}
                                    onRemoveStudent={handleRemoveStudentFromGroup}
                                    onDelete={() => {
                                        handleDeleteGroup(selectedGroup.id);
                                        setDialogOpen(null);
                                    }}
                                />
                            </ScrollArea>
                        )}
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
