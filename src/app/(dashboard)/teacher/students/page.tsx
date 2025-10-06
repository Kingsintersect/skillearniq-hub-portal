'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Users, 
  UserPlus, 
  Search, 
  Download, 
  Mail, 
  Phone, 
  MoreVertical,
  Calendar,
  Award,
  TrendingUp,
  Shield,
  MessageSquare,
  Send
} from 'lucide-react';

// Import the actual hooks and services
import { useTeacherQueries } from '@/hooks/useTeacherQueries';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

// Custom hooks for student management
const useStudentManagement = (teacherId: number, filters: any) => {
  const { useStudents, useClasses, useAttendance, useAcademicYears, useGroups } = useTeacherQueries();
  
  const studentsQuery = useStudents(teacherId, filters);
  const classesQuery = useClasses(teacherId, filters);
  const attendanceQuery = useAttendance(teacherId, filters);
  const academicYearsQuery = useAcademicYears(teacherId);
  const groupsQuery = useGroups(teacherId, filters.classId);

  return {
    students: studentsQuery.data?.data || [],
    classes: classesQuery.data?.data || [],
    groups: groupsQuery.data?.data || [],
    attendance: attendanceQuery.data?.data || { daily: [], monthly: [] },
    academicYears: academicYearsQuery.data?.data || [],
    isLoading: studentsQuery.isLoading || classesQuery.isLoading || groupsQuery.isLoading,
    isError: studentsQuery.isError || classesQuery.isError
  };
};

const StudentManagementPage: React.FC = () => {
  const teacherId = 1; // This should come from your auth context or props
  
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'attendance'>('students');
  const [dialogOpen, setDialogOpen] = useState<'createGroup' | 'manageGroup' | 'sendMessage' | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st',
    classId: 1,
  });

  // Use actual service data
  const { 
    students, 
    classes, 
    groups, 
    attendance, 
    academicYears, 
    isLoading 
  } = useStudentManagement(teacherId, filters);

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
    } catch(error) {
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

  const handleExportData = () => {
    toast.success('Data exported successfully!');
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Management</h1>
          <p className="text-muted-foreground text-lg">Manage student enrollments, groups, and attendance records</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold text-foreground">{groups.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {attendance.monthly.length > 0 
                      ? `${attendance.monthly[attendance.monthly.length - 1].rate}%` 
                      : '0%'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-foreground">
                    {students.length > 0 
                      ? `${(students.reduce((acc, student) => acc + student.averageScore, 0) / students.length).toFixed(1)}%` 
                      : '0%'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="academicYear" className="text-sm font-medium">Academic Year</Label>
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
                  <Label htmlFor="term" className="text-sm font-medium">Term</Label>
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
                  <Label htmlFor="class" className="text-sm font-medium">Class</Label>
                  <Select
                    value={filters.classId.toString()}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, classId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setDialogOpen('createGroup')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Group
                </Button>
              </div>
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

        {/* Messaging Button */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Send messages to selected students</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setDialogOpen('sendMessage')}
                  disabled={selectedStudents.length === 0}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message ({selectedStudents.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={selectAllStudents}
                >
                  {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
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
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Groups</span>
            </TabsTrigger>
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
              className={availableClasses.find(c => c.id === filters.classId)?.name || ''}
            />
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <GroupsOverview
              groups={groups}
              students={students}
              onManageGroup={(group) => {
                setSelectedGroup(group);
                setDialogOpen('manageGroup');
              }}
              onDeleteGroup={handleDeleteGroup}
            />
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <AttendanceOverview 
              attendance={attendance}
              academicYear={filters.academicYear}
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

// Students Overview Component
const StudentsOverview: React.FC<{ 
  students: any[]; 
  selectedStudents: number[];
  onStudentSelect: (studentId: number) => void;
  className: string;
}> = ({ students, selectedStudents, onStudentSelect, className }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">Student Enrollments</span>
            <CardDescription className="mt-1">
              {className} • {students.length} students enrolled
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Switch
                    checked={students.length > 0 && selectedStudents.length === students.length}
                    onCheckedChange={() => {}}
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Switch
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => onStudentSelect(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.name.split(' ').map((n:any) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{student.email}</div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                      <Mail className="h-3 w-3" />
                      <Phone className="h-3 w-3" />
                      <span>{student.phone}</span>
                    </div>
                  </TableCell>
                 
                    <TableCell>
  <div className="flex flex-wrap gap-1 max-w-[200px]">
    {(student?.subjects ?? []).slice(0, 3).map((subject: string) => (
      <Badge key={subject} variant="secondary" className="text-xs">
        {subject}
      </Badge>
    ))}
  


                     {(student?.subjects?.length ?? 0) > 3 && (
  <Badge variant="outline" className="text-xs">
    +{(student?.subjects?.length ?? 0) - 3} more
  </Badge>
)}

                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">1st Term</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={student.averageScore || 0} className="w-20 h-2" />
                      <span className="text-sm font-medium">{student.averageScore || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Groups Overview Component
const GroupsOverview: React.FC<{
  groups: any[];
  students: any[];
  onManageGroup: (group: any) => void;
  onDeleteGroup: (groupId: number) => void;
}> = ({ groups, students, onManageGroup, onDeleteGroup }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => {
        const groupStudents = students.filter(s => group.studentIds.includes(s.id));
        return (
          <Card key={group.id} className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-bold">{group.name}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {groupStudents.length} members
                </Badge>
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Group Members</h4>
                  <div className="space-y-2">
                    {groupStudents.slice(0, 3).map((student) => (
                      <div key={student.id} className="flex items-center space-x-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="text-xs">{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                    ))}
                    {groupStudents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{groupStudents.length - 3} more students
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onManageGroup(group)}
                  >
                    Manage
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {groups.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
          <p className="text-muted-foreground mb-4">Create your first student group to get started</p>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      )}
    </div>
  );
};

// Attendance Overview Component
const AttendanceOverview: React.FC<{ 
  attendance: any; 
  academicYear: string; 
  term: string 
}> = ({ 
  attendance, 
  academicYear, 
  term 
}) => {
  const attendanceData = attendance.daily || [];

  // Calculate average attendance rate
  const averageRate = attendanceData.length > 0 
    ? attendanceData.reduce((acc: number, day: any) => acc + day.rate, 0) / attendanceData.length
    : 0;

  const totalPresent = attendanceData.reduce((acc: number, day: any) => acc + day.present, 0);
  const totalAbsent = attendanceData.reduce((acc: number, day: any) => acc + day.absent, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Attendance Records</CardTitle>
        <CardDescription>
          Viewing attendance for {academicYear} {term} Term
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <div className="text-2xl font-bold text-green-600">{averageRate.toFixed(1)}%</div>
              <div className="text-sm text-green-700">Average Attendance Rate</div>
            </div>
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{totalPresent}</div>
              <div className="text-sm text-blue-700">Total Present Days</div>
            </div>
            <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">{totalAbsent}</div>
              <div className="text-sm text-orange-700">Absent Days</div>
            </div>
          </div>

          {/* Attendance Table */}
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((day: any) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        {day.present}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {day.absent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        {day.late}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={day.rate} className="w-20 h-2" />
                        <span className="text-sm font-medium">{day.rate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

// Group Management Component
const GroupManagement: React.FC<{
  group: any;
  students: any[];
  onAddStudent: (groupId: number, studentId: number) => Promise<void>;
  onRemoveStudent: (groupId: number, studentId: number) => Promise<void>;
  onDelete: () => void;
}> = ({ group, students, onAddStudent, onRemoveStudent, onDelete }) => {
  const availableStudents = students.filter(s => !group.studentIds.includes(s.id));
  const groupStudents = students.filter(s => group.studentIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Students */}
        <div>
          <h4 className="font-semibold mb-3">Available Students ({availableStudents.length})</h4>
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-2">
              {availableStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="text-sm">{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddStudent(group.id, student.id)}
                    className="px-3 py-1 text-xs"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Group Members */}
        <div>
          <h4 className="font-semibold mb-3">Group Members ({groupStudents.length})</h4>
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-2">
              {groupStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="text-sm">{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveStudent(group.id, student.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50 px-3 py-1 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onDelete} className="text-red-600 border-red-200 hover:bg-red-50">
          Delete Group
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Done
        </Button>
      </div>
    </div>
  );
};

// Message Dialog Component
const MessageDialog: React.FC<{
  students: any[];
  selectedStudents: number[];
  onStudentSelect: (studentId: number) => void;
  onSelectAll: () => void;
  onSendMessage: (studentIds: number[], message: string, method: 'sms' | 'email' | 'in-app') => void;
}> = ({ students, selectedStudents, onStudentSelect, onSelectAll, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'sms' | 'email' | 'in-app'>('in-app');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedStudents.length === 0) return;

    setIsSending(true);
    try {
      await onSendMessage(selectedStudents, message, method);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col gap-4">
      {/* Student Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Select Students</CardTitle>
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-32">
            <div className="p-4 space-y-2">
              {students.map(student => (
                <div key={student.id} className="flex items-center space-x-3">
                  <Switch
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => onStudentSelect(student.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Delivery Method</CardTitle>
        </CardHeader>
        <CardContent>
           <ScrollArea className="h-32">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={method === 'sms' ? 'default' : 'outline'}
              onClick={() => setMethod('sms')}
              className="flex flex-col h-auto p-3"
            >
              <Phone className="h-4 w-4 mb-1" />
              <span className="text-xs">SMS</span>
            </Button>
            <Button
              type="button"
              variant={method === 'email' ? 'default' : 'outline'}
              onClick={() => setMethod('email')}
              className="flex flex-col h-auto p-3"
            >
              <Mail className="h-4 w-4 mb-1" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              type="button"
              variant={method === 'in-app' ? 'default' : 'outline'}
              onClick={() => setMethod('in-app')}
              className="flex flex-col h-auto p-3"
            >
              <MessageSquare className="h-4 w-4 mb-1" />
              <span className="text-xs">In-App</span>
            </Button>
          </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Form */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Message Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
            <div className="flex-1">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[120px] resize-none"
                required
              />
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </span>
              <Button type="submit" disabled={!message.trim() || selectedStudents.length === 0 || isSending}>
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagementPage;