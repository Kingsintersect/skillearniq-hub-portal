'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Download, Upload, Trash2, BookOpen } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';

type Assignment = {
  academicYear: string;
  term: string;
  class: string;
  subjects: string[];
};

export default function TeachersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all'
  });
  
  const { 
    useTeachers, 
    useCreateTeacher, 
    useAssignTeacher, 
    useDeleteTeacher 
  } = useAdminQueries();

  const { data: teachersResponse, isLoading } = useTeachers({
    search: searchTerm,
    subject: filters.subject,
    status: filters.status
  });

  const createTeacherMutation = useCreateTeacher();
  const assignTeacherMutation = useAssignTeacher();
  const deleteTeacherMutation = useDeleteTeacher();

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    teacherId: '',
    email: '',
    phone: '',
    subjects: [],
    classes: []
  });

  const [assignment, setAssignment] = useState<Assignment>({
    academicYear: '2025-2026',
    term: '1st',
    class: '',
    subjects: []
  });

  const teachers = teachersResponse?.data || [];

  const handleCreateTeacher = () => {
    createTeacherMutation.mutate(newTeacher, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewTeacher({
          name: '',
          teacherId: '',
          email: '',
          phone: '',
          subjects: [],
          classes: []
        });
      }
    });
  };

  const handleAssignTeacher = () => {
    if (selectedTeacher && assignment.class && assignment.subjects.length > 0) {
      assignTeacherMutation.mutate({
        teacherId: selectedTeacher.id,
        class: assignment.class,
        subjects: assignment.subjects
      }, {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
          setAssignment({
            academicYear: '2025-2026',
            term: '1st',
            class: '',
            subjects: []
          });
        }
      });
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    deleteTeacherMutation.mutate(teacherId);
  };

  const downloadTemplate = () => {
    console.log('Download template');
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Bulk upload:', file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teachers Management</h1>
            <p className="text-muted-foreground">Manage all teachers and their assignments</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(true)} className='dark:text-white dark:border-white'>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search teachers by name, ID, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={filters.subject} 
                onValueChange={(value) => setFilters(prev => ({...prev, subject: value}))}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>{teachers.length} teachers in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.teacherId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">{teacher.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.map((cls, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsAssignDialogOpen(true);
                          }}
                          className='dark:text-white dark:border-white'
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className='dark:text-white dark:border-white'
                          disabled={deleteTeacherMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Teacher Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Enter the teacher's details to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input
                  id="teacherId"
                  value={newTeacher.teacherId}
                  onChange={(e) => setNewTeacher({...newTeacher, teacherId: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTeacher}
                disabled={createTeacherMutation.isPending}
              >
                {createTeacherMutation.isPending ? 'Adding...' : 'Add Teacher'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Upload Teachers</DialogTitle>
              <DialogDescription>
                Download the template, fill it with teacher data, and upload it here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center p-6 border-2 border-dashed rounded-lg">
                <Download className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Download Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use this template to ensure your data is formatted correctly
                </p>
                <Button onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Upload Filled Template</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Teacher Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Teacher to Class</DialogTitle>
              <DialogDescription>
                Assign {selectedTeacher?.name} to a class and subjects for the current academic year.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={assignment.academicYear} onValueChange={(value) => setAssignment({...assignment, academicYear: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={assignment.term} onValueChange={(value) => setAssignment({...assignment, term: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Term</SelectItem>
                    <SelectItem value="2nd">2nd Term</SelectItem>
                    <SelectItem value="3rd">3rd Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={assignment.class} onValueChange={(value) => setAssignment({...assignment, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                    <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                    <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                    <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <Select onValueChange={(value) => {
                  if (!assignment.subjects.includes(value)) {
                    setAssignment({...assignment, subjects: [...assignment.subjects, value]});
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {assignment.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {subject}
                      <button 
                        onClick={() => setAssignment({
                          ...assignment, 
                          subjects: assignment.subjects.filter(s => s !== subject)
                        })}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignTeacher}
                disabled={assignTeacherMutation.isPending || !assignment.class || assignment.subjects.length === 0}
              >
                {assignTeacherMutation.isPending ? 'Assigning...' : 'Assign Teacher'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}