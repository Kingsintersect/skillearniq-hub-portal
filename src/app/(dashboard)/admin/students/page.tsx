// app/admin/students/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, Upload, Ban, Trash2, Mail, Phone, Sheet, FileDown, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';
import { CreateStudentPayload } from '@/lib/services/admin/studentService';

// Add Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 py-1 text-sm">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

type ExportFormat = 'csv' | 'excel' | 'pdf';

const useExportStudents = () => {
  const exportToCSV = (students: any[], filename: string = 'students') => {
    if (!students.length) return;
    
    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Status',
      'Email Verified',
      'Phone Verified',
      'Last Login',
      'Created Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        `"${student.first_name}"`,
        `"${student.last_name}"`,
        `"${student.email}"`,
        `"${student.phone}"`,
        student.is_active ? 'Active' : 'Inactive',
        student.email_verified ? 'Yes' : 'No',
        student.phone_verified ? 'Yes' : 'No',
        `"${student.last_login_at || 'Never'}"`,
        `"${new Date(student.created_at).toLocaleDateString()}"`
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
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Status',
      'Email Verified',
      'Phone Verified',
      'Last Login',
      'Created Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        `"${student.first_name}"`,
        `"${student.last_name}"`,
        `"${student.email}"`,
        `"${student.phone}"`,
        student.is_active ? 'Active' : 'Inactive',
        student.email_verified ? 'Yes' : 'No',
        student.phone_verified ? 'Yes' : 'No',
        `"${student.last_login_at || 'Never'}"`,
        `"${new Date(student.created_at).toLocaleDateString()}"`
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
          <td>${student.id}</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td>${student.email}</td>
          <td>${student.phone}</td>
          <td>${student.is_active ? 'Active' : 'Inactive'}</td>
          <td>${student.email_verified ? 'Yes' : 'No'}</td>
          <td>${student.phone_verified ? 'Yes' : 'No'}</td>
          <td>${student.last_login_at ? new Date(student.last_login_at).toLocaleDateString() : 'Never'}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Student Records - ${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .header h1 { margin: 0; color: #1a365d; font-size: 24px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Management Records</h1>
              <p>Total Students: ${students.length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Email Verified</th>
                  <th>Phone Verified</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>${studentData}</tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return { exportToCSV, exportToExcel, exportToPDF };
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function StudentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  
  const { 
    useAllStudents,
    useCreateStudent, 
    useUpdateStudentStatus,
    useDeleteStudent,
    useBulkUploadStudents 
  } = useAdminQueries();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: allStudentsResponse, isLoading } = useAllStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();
  const bulkUploadMutation = useBulkUploadStudents();

  const { exportToCSV, exportToExcel, exportToPDF } = useExportStudents();

  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    password: 'P@55word',
    parent_first_name: '',
    parent_last_name: '',
    parent_email: '',
    parent_phone_number: ''
  });

  const students = allStudentsResponse || [];

  const filteredStudents = students.filter(student => {
    const matchesSearch = debouncedSearchTerm === '' || 
      student.first_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.phone.includes(debouncedSearchTerm);
    
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && student.is_active === 1) ||
      (filters.status === 'inactive' && student.is_active === 0);
    
    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, filters.status]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setPagination({
      currentPage: 1,
      itemsPerPage: parseInt(value),
    });
  };

  // Get paginated students
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / pagination.itemsPerPage);

  const handleCreateStudent = () => {
    const payload: CreateStudentPayload = {
      first_name: newStudent.first_name,
      last_name: newStudent.last_name,
      email: newStudent.email,
      username: newStudent.username,
      phone: newStudent.phone,
      password: newStudent.password,
      parent_first_name: newStudent.parent_first_name,
      parent_last_name: newStudent.parent_last_name,
      parent_email: newStudent.parent_email,
      parent_phone_number: newStudent.parent_phone_number
    };

    createStudentMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewStudent({
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          phone: '',
          password: 'P@55word',
          parent_first_name: '',
          parent_last_name: '',
          parent_email: '',
          parent_phone_number: ''
        });
        toast.success('Student created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create student');
      }
    });
  };

  const handleSuspendStudent = (studentId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateStudentStatusMutation.mutate({ id: studentId, is_active: newStatus }, {
      onSuccess: () => {
        toast.success(`Student ${newStatus === 1 ? 'activated' : 'suspended'} successfully!`);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update student status');
      }
    });
  };

  const handleDeleteStudent = (studentId: number) => {
    deleteStudentMutation.mutate(studentId, {
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete student');
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    if (filteredStudents.length === 0) {
      toast.error('No students available to export');
      return;
    }

    try {
      const filename = `students_${filters.status === 'all' ? 'all_status' : filters.status}`;
      switch (format) {
        case 'csv':
          exportToCSV(filteredStudents, filename);
          break;
        case 'excel':
          exportToExcel(filteredStudents, filename);
          break;
        case 'pdf':
          exportToPDF(filteredStudents, filename);
          break;
      }
      toast.success(`Exported ${filteredStudents.length} students`);
    } catch (error) {
      toast.error('Failed to export students');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
            <p className="text-gray-600">Manage all students and their information</p>
          </div>
          <div className="flex space-x-4">
            {/* <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Sheet className="h-4 w-4 mr-2" /> CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileDown className="h-4 w-4 mr-2" /> Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" /> PDF
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
        <Card className="mb-6 bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search students by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters({ status: value })}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Show per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {filteredStudents.length} students found
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>
              {filteredStudents.length} students in the system
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-gray-500">{student.username || 'No username'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{student.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.is_active ? 'default' : 'secondary'}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={student.email_verified ? 'default' : 'outline'} className="text-xs">
                          Email: {student.email_verified ? 'Yes' : 'No'}
                        </Badge>
                        <Badge variant={student.phone_verified ? 'default' : 'outline'} className="text-xs">
                          Phone: {student.phone_verified ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {formatDate(student.last_login_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSuspendStudent(student.id, student.is_active)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredStudents.length}
                itemsPerPage={pagination.itemsPerPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Create Student Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={newStudent.username}
                  onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent First Name</Label>
                <Input
                  value={newStudent.parent_first_name}
                  onChange={(e) => setNewStudent({...newStudent, parent_first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Last Name</Label>
                <Input
                  value={newStudent.parent_last_name}
                  onChange={(e) => setNewStudent({...newStudent, parent_last_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Email</Label>
                <Input
                  type="email"
                  value={newStudent.parent_email}
                  onChange={(e) => setNewStudent({...newStudent, parent_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Phone</Label>
                <Input
                  value={newStudent.parent_phone_number}
                  onChange={(e) => setNewStudent({...newStudent, parent_phone_number: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateStudent}>Add Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}