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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, Upload, Trash2, BookOpen, Sheet, FileDown, FileText } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

type Assignment = {
  academicYear: string;
  term: string;
  class: string;
  subjects: string[];
};

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportTeachers = () => {
  const exportToCSV = (teachers: any[], filename: string = 'teachers') => {
    if (!teachers.length) return;
    
    const headers = [
      'Teacher ID',
      'Name', 
      'Email', 
      'Phone', 
      'Subjects',
      'Classes',
      'Status',
      'Employment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...teachers.map(teacher => [
        teacher.teacherId,
        `"${teacher.name.replace(/"/g, '""')}"`,
        `"${teacher.email}"`,
        `"${teacher.phone || 'N/A'}"`,
        `"${teacher.subjects.join('; ')}"`,
        `"${teacher.classes.join('; ')}"`,
        teacher.status,
        `"${teacher.employmentDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (teachers: any[], filename: string = 'teachers') => {
    if (!teachers.length) return;
    
    const headers = [
      'Teacher ID',
      'Name', 
      'Email', 
      'Phone', 
      'Subjects',
      'Classes',
      'Status',
      'Employment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...teachers.map(teacher => [
        teacher.teacherId,
        `"${teacher.name.replace(/"/g, '""')}"`,
        `"${teacher.email}"`,
        `"${teacher.phone || 'N/A'}"`,
        `"${teacher.subjects.join('; ')}"`,
        `"${teacher.classes.join('; ')}"`,
        teacher.status,
        `"${teacher.employmentDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (teachers: any[], filename: string = 'teachers') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && teachers.length > 0) {
      const teacherData = teachers.map(teacher => `
        <tr>
          <td>${teacher.teacherId}</td>
          <td>${teacher.name}</td>
          <td>${teacher.email}</td>
          <td>${teacher.phone || 'N/A'}</td>
          <td>${teacher.subjects.join(', ')}</td>
          <td>${teacher.classes.join(', ')}</td>
          <td>${teacher.status}</td>
        </tr>
      `).join('');

      const activeCount = teachers.filter(t => t.status === 'active').length;
      const inactiveCount = teachers.filter(t => t.status === 'inactive').length;

      printWindow.document.write(`
        <html>
          <head>
            <title>Teacher Records - ${filename}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.4;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 { 
                margin: 0; 
                color: #1a365d;
                font-size: 24px;
              }
              .header p { 
                margin: 5px 0; 
                color: #666;
              }
              .summary { 
                margin: 20px 0;
                padding: 15px;
                background-color: #f0f9ff;
                border-radius: 5px;
                border-left: 4px solid #007bff;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 15px 0;
              }
              .summary-item {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 5px;
                border: 1px solid #e1e5e9;
              }
              .summary-value {
                font-size: 18px;
                font-weight: bold;
                color: #1a365d;
              }
              .summary-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                font-size: 11px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold;
                color: #333;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .status-active { background-color: #d4edda; color: #155724; }
              .status-inactive { background-color: #e2e3e5; color: #383d41; }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 11px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Teacher Management Records</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Teachers: ${teachers.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Teacher Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${teachers.length}</div>
                  <div class="summary-label">Total Teachers</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${activeCount}</div>
                  <div class="summary-label">Active Teachers</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${inactiveCount}</div>
                  <div class="summary-label">Inactive Teachers</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subjects</th>
                  <th>Classes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${teacherData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Teacher Records - For Administrative Use Only</p>
              <p>Generated by School Management System</p>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Print PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Close
              </button>
            </div>

            <script>
              setTimeout(() => {
                window.print();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
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

  const { exportToCSV, exportToExcel, exportToPDF } = useExportTeachers();

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
        toast.success('Teacher created successfully!');
      },
      onError: () => {
        toast.error('Failed to create teacher');
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
          toast.success('Teacher assigned successfully!');
        },
        onError: () => {
          toast.error('Failed to assign teacher');
        }
      });
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    deleteTeacherMutation.mutate(teacherId, {
      onSuccess: () => {
        toast.success('Teacher deleted successfully!');
      },
      onError: () => {
        toast.error('Failed to delete teacher');
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    if (teachers.length === 0) {
      toast.error('No teachers available to export');
      return;
    }

    try {
      const filename = `teachers_${filters.subject === 'all' ? 'all_subjects' : filters.subject}`;
      switch (format) {
        case 'csv':
          exportToCSV(teachers, filename);
          toast.success(`Exported ${teachers.length} teachers as CSV`);
          break;
        case 'excel':
          exportToExcel(teachers, filename);
          toast.success(`Exported ${teachers.length} teachers as Excel`);
          break;
        case 'pdf':
          exportToPDF(teachers, filename);
          toast.success(`Exported ${teachers.length} teachers as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export teachers. Please try again.');
      console.error('Export error:', error);
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'teacherId',
      'name',
      'email',
      'phone',
      'subjects',
      'classes'
    ];
    
    const templateContent = [templateHeaders.join(',')].join('\n');
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'teacher_upload_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Template downloaded successfully!');
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement bulk upload logic here
      console.log('Bulk upload:', file);
      toast.success('Bulk upload initiated!');
      setIsBulkUploadDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading teachers...</div>
        </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className='dark:border-white dark:text-white'>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleExport('csv')}
                  className="flex items-center space-x-2"
                >
                  <Sheet className="h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('excel')}
                  className="flex items-center space-x-2"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('pdf')}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {teachers.length} teachers found
              </div>
              <div className="text-sm">
                Showing: {filters.subject === 'all' ? 'All subjects' : filters.subject} • {filters.status === 'all' ? 'All status' : filters.status}
              </div>
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