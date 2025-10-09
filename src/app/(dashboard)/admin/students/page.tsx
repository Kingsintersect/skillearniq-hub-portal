'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, Upload, Edit, Trash2, Ban, Sheet, FileDown, FileText } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportStudents = () => {
  const exportToCSV = (students: any[], filename: string = 'students') => {
    if (!students.length) return;
    
    const headers = [
      'Student ID',
      'Name', 
      'Email', 
      'Phone', 
      'Class', 
      'Gender', 
      'Date of Birth',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'Status',
      'Enrollment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.studentId,
        `"${student.name.replace(/"/g, '""')}"`,
        `"${student.email}"`,
        `"${student.phone || 'N/A'}"`,
        student.class,
        student.gender,
        `"${student.dateOfBirth || 'N/A'}"`,
        `"${student.parentName || 'N/A'}"`,
        `"${student.parentEmail || 'N/A'}"`,
        `"${student.parentPhone || 'N/A'}"`,
        student.status,
        `"${student.enrollmentDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = (students: any[], filename: string = 'students') => {
    if (!students.length) return;
    
    const headers = [
      'Student ID',
      'Name', 
      'Email', 
      'Phone', 
      'Class', 
      'Gender', 
      'Date of Birth',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'Status',
      'Enrollment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.studentId,
        `"${student.name.replace(/"/g, '""')}"`,
        `"${student.email}"`,
        `"${student.phone || 'N/A'}"`,
        student.class,
        student.gender,
        `"${student.dateOfBirth || 'N/A'}"`,
        `"${student.parentName || 'N/A'}"`,
        `"${student.parentEmail || 'N/A'}"`,
        `"${student.parentPhone || 'N/A'}"`,
        student.status,
        `"${student.enrollmentDate || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (students: any[], filename: string = 'students') => {
    const printWindow = window.open('', '_blank');
    if (printWindow && students.length > 0) {
      const studentData = students.map(student => `
        <tr>
          <td>${student.studentId}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.phone || 'N/A'}</td>
          <td>${student.class}</td>
          <td>${student.gender}</td>
          <td>${student.dateOfBirth || 'N/A'}</td>
          <td>${student.parentName || 'N/A'}</td>
          <td>${student.status}</td>
        </tr>
      `).join('');

      const activeCount = students.filter(s => s.status === 'active').length;
      const suspendedCount = students.filter(s => s.status === 'suspended').length;

      printWindow.document.write(`
        <html>
          <head>
            <title>Student Records - ${filename}</title>
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
              .status-suspended { background-color: #f8d7da; color: #721c24; }
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
              <h1>Student Management Records</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Students: ${students.length}</p>
            </div>

            <div class="summary">
              <h3 style="margin: 0 0 10px 0; color: #1a365d;">Student Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${students.length}</div>
                  <div class="summary-label">Total Students</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${activeCount}</div>
                  <div class="summary-label">Active Students</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${suspendedCount}</div>
                  <div class="summary-label">Suspended Students</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Parent Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${studentData}
              </tbody>
            </table>

            <div class="footer">
              <p>Confidential Student Records - For Administrative Use Only</p>
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

export default function StudentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: 'all',
    status: 'all'
  });

  const { 
    useStudents, 
    useCreateStudent, 
    useUpdateStudentStatus, 
    useDeleteStudent 
  } = useAdminQueries();

  const { data: studentsResponse, isLoading } = useStudents({
    search: searchTerm,
    class: filters.class,
    status: filters.status
  });

  const { exportToCSV, exportToExcel, exportToPDF } = useExportStudents();

  const createStudentMutation = useCreateStudent();
  const updateStudentStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();

  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    class: '',
    gender: '',
    dateOfBirth: '',
    parentName: '',
    email: '',
    phone: ''
  });

  const students = studentsResponse?.data || [];

  const handleCreateStudent = () => {
    createStudentMutation.mutate(newStudent, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewStudent({
          name: '',
          studentId: '',
          class: '',
          gender: '',
          dateOfBirth: '',
          parentName: '',
          email: '',
          phone: ''
        });
        toast.success('Student created successfully!');
      },
      onError: () => {
        toast.error('Failed to create student');
      }
    });
  };

  const handleSuspendStudent = (studentId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateStudentStatusMutation.mutate({ studentId, status: newStatus as 'active' | 'suspended' }, {
      onSuccess: () => {
        toast.success(`Student ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
      },
      onError: () => {
        toast.error('Failed to update student status');
      }
    });
  };

  const handleDeleteStudent = (studentId: number) => {
    deleteStudentMutation.mutate(studentId, {
      onSuccess: () => {
        toast.success('Student deleted successfully!');
      },
      onError: () => {
        toast.error('Failed to delete student');
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    if (students.length === 0) {
      toast.error('No students available to export');
      return;
    }

    try {
      const filename = `students_${filters.class === 'all' ? 'all_classes' : filters.class}`;
      switch (format) {
        case 'csv':
          exportToCSV(students, filename);
          toast.success(`Exported ${students.length} students as CSV`);
          break;
        case 'excel':
          exportToExcel(students, filename);
          toast.success(`Exported ${students.length} students as Excel`);
          break;
        case 'pdf':
          exportToPDF(students, filename);
          toast.success(`Exported ${students.length} students as PDF`);
          break;
        default:
          toast.error('Unsupported export format');
      }
    } catch (error) {
      toast.error('Failed to export students. Please try again.');
      console.error('Export error:', error);
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'studentId',
      'name',
      'email',
      'phone',
      'class',
      'gender',
      'dateOfBirth',
      'parentName',
      'parentEmail',
      'parentPhone'
    ];
    
    const templateContent = [templateHeaders.join(',')].join('\n');
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student_upload_template.csv';
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
          <div>Loading students...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students Management</h1>
            <p className="text-muted-foreground">Manage all students in the school</p>
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
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search students by name, ID, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select 
                value={filters.class} 
                onValueChange={(value) => setFilters(prev => ({...prev, class: value}))}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                  <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                  <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                  <SelectItem value="JSS 2B">JSS 2B</SelectItem>
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {students.length} students found
              </div>
              <div className="text-sm">
                Showing: {filters.class === 'all' ? 'All classes' : filters.class} • {filters.status === 'all' ? 'All status' : filters.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>{students.length} students found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSuspendStudent(student.id, student.status)}
                          className='dark:text-white dark:border-white'
                          disabled={updateStudentStatusMutation.isPending}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className='dark:text-white dark:border-white'
                          disabled={deleteStudentMutation.isPending}
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

        {/* Create Student Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's details to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select onValueChange={(value) => setNewStudent({...newStudent, class: value})}>
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
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setNewStudent({...newStudent, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStudent}
                disabled={createStudentMutation.isPending}
              >
                {createStudentMutation.isPending ? 'Adding...' : 'Add Student'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Upload Students</DialogTitle>
              <DialogDescription>
                Download the template, fill it with student data, and upload it here.
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
      </div>
    </div>
  );
}