'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Download, Upload, Edit, Trash2, Ban, Sheet, FileDown, FileText, Mail, Phone, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useStudentQueries } from '@/hooks/admin/useStudentQueries';
import { toast } from 'sonner';
import { CreateStudentPayload, Student } from '@/lib/services/admin/studentService';

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportStudents = () => {
  const exportToCSV = (students: Student[], filename: string = 'students') => {
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

  const exportToExcel = (students: Student[], filename: string = 'students') => {
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

  const exportToPDF = (students: Student[], filename: string = 'students') => {
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

      const activeCount = students.filter(s => s.is_active === 1).length;
      const inactiveCount = students.filter(s => s.is_active === 0).length;
      const verifiedEmailCount = students.filter(s => s.email_verified === 1).length;
      const verifiedPhoneCount = students.filter(s => s.phone_verified === 1).length;

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
                grid-template-columns: repeat(4, 1fr);
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
                  <div class="summary-value">${verifiedEmailCount}</div>
                  <div class="summary-label">Email Verified</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${verifiedPhoneCount}</div>
                  <div class="summary-label">Phone Verified</div>
                </div>
              </div>
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

// Debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
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
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
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
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-2 py-1 text-sm">...</span>
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
          ))}
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

export default function StudentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  });
  
  const { 
    useAllStudents,
    useStudents, 
    useCreateStudent, 
    useUpdateStudentStatus,
    useDeleteStudent,
    useBulkUploadStudents 
  } = useStudentQueries();

  // Use debounce for search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle filter changes
  const [filterParams, setFilterParams] = useState({
    search: '',
    is_active: undefined as number | undefined,
    page: 1,
    perPage: 10
  });

  // Update filter params when debounced search or filters change
  useEffect(() => {
    console.log('🔄 Updating filter params:', {
      search: debouncedSearchTerm,
      status: filters.status
    });
    
    setFilterParams({
      search: debouncedSearchTerm,
      is_active: filters.status !== 'all' ? (filters.status === 'active' ? 1 : 0) : undefined,
      page: pagination.currentPage,
      perPage: pagination.itemsPerPage
    });
  }, [debouncedSearchTerm, filters.status, pagination.currentPage, pagination.itemsPerPage]);

  const { data: allStudentsResponse, isLoading: allStudentsLoading, error: allStudentsError } = useAllStudents();
  const { data: studentsResponse, isLoading: studentsLoading, error: studentsError } = useStudents(filterParams);

  const { exportToCSV, exportToExcel, exportToPDF } = useExportStudents();

  const createStudentMutation = useCreateStudent();
  const updateStudentStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();
  const bulkUploadMutation = useBulkUploadStudents();

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

  // Extract data from API responses
  const allStudents = Array.isArray(allStudentsResponse) ? allStudentsResponse : [];
  const filteredStudents = studentsResponse?.data || [];

  // FIX: Use allStudents as the main data source, and only use filteredStudents when actually filtering
  const displayStudents = debouncedSearchTerm || filters.status !== 'all' ? filteredStudents : allStudents;

  // Pagination logic
  const totalItems = displayStudents.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedStudents = displayStudents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, filters.status]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setPagination({
      currentPage: 1,
      itemsPerPage: parseInt(value)
    });
  };

  // Enhanced debug effect to see both data structures
  useEffect(() => {
    console.log('=== 🔍 COMPLETE DATA STRUCTURE ANALYSIS ===');
    
    console.log('📋 ALL STUDENTS (from /account/allstudents):');
    console.log('Response:', allStudentsResponse);
    console.log('Array:', allStudents);
    console.log('Count:', allStudents.length);
    
    if (allStudents.length > 0) {
      console.log('🎯 First student structure:', allStudents[0]);
      console.log('🎯 Student keys:', Object.keys(allStudents[0]));
    }
    
    console.log('🔍 FILTERED STUDENTS (from /admin/get-students):');
    console.log('Response:', studentsResponse);
    console.log('Array:', filteredStudents);
    console.log('Count:', filteredStudents.length);
    
    if (filteredStudents.length > 0) {
      console.log('🎯 First filtered student structure:', filteredStudents[0]);
      console.log('🎯 Filtered student keys:', Object.keys(filteredStudents[0]));
    }

    console.log('🎯 DISPLAY STUDENTS (what user sees):');
    console.log('Array:', displayStudents);
    console.log('Count:', displayStudents.length);
    console.log('Using filtered data?', debouncedSearchTerm || filters.status !== 'all');

    console.log('📄 PAGINATION INFO:');
    console.log('Current page:', pagination.currentPage);
    console.log('Items per page:', pagination.itemsPerPage);
    console.log('Total pages:', totalPages);
    console.log('Showing items:', startIndex + 1, 'to', endIndex, 'of', totalItems);
    
    console.log('⚡ Loading States - All:', allStudentsLoading, 'Filtered:', studentsLoading);
    console.log('❌ Error States - All:', allStudentsError, 'Filtered:', studentsError);
    console.log('🎛️ Filter Params:', filterParams);
    console.log('🔍 Search Term:', searchTerm);
    console.log('⏰ Debounced Search Term:', debouncedSearchTerm);
    console.log('=== 🔍 END ANALYSIS ===');
  }, [allStudentsResponse, studentsResponse, allStudentsLoading, studentsLoading, allStudentsError, studentsError, filterParams, searchTerm, debouncedSearchTerm, displayStudents, allStudents, filteredStudents, pagination, totalPages, startIndex, endIndex, totalItems]);

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
      },
      onError: () => {
        // Error handling is done in the mutation
      }
    });
  };

  const handleSuspendStudent = (studentId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateStudentStatusMutation.mutate({ id: studentId, is_active: newStatus }, {
      onError: () => {
        // Error handling is done in the mutation
      }
    });
  };

  const handleDeleteStudent = (studentId: number) => {
    deleteStudentMutation.mutate(studentId, {
      onError: () => {
        // Error handling is done in the mutation
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    const studentsToExport = allStudents.length > 0 ? allStudents : displayStudents;
    
    if (studentsToExport.length === 0) {
      toast.error('No students available to export');
      return;
    }

    try {
      const filename = `students_${filters.status === 'all' ? 'all_status' : filters.status}`;
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
      toast.error('Failed to export students. Please try again.');
      console.error('Export error:', error);
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'first_name',
      'last_name',
      'email',
      'username',
      'phone',
      'password',
      'parent_first_name',
      'parent_last_name',
      'parent_email',
      'parent_phone_number'
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
      bulkUploadMutation.mutate(file, {
        onSuccess: () => {
          setIsBulkUploadDialogOpen(false);
          // Reset file input
          if (event.target) {
            event.target.value = '';
          }
        }
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleStatusFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  // Manual API test function
 

  const isLoading = studentsLoading || allStudentsLoading;

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

  if (studentsError || allStudentsError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-destructive">
          <div>Failed to load students</div>
          <div className="text-sm text-muted-foreground mt-2">
            Please try again later
          </div>
         
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
            <p className="text-muted-foreground">Manage all students and their information</p>
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
              <div className=" relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or phone..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {debouncedSearchTerm ? `Searching for: "${debouncedSearchTerm}"` : 'Type to search...'}
                </div>
              </div>
              <Select 
                value={filters.status} 
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Filter by status" />
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
                <SelectTrigger className="w-full md:w-[300px]">
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
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {totalItems} students found
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
              <div className="text-sm">
                Showing: {filters.status === 'all' ? 'All status' : filters.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>
              {totalItems} students in the system
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
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
                    <TableCell className="font-medium">
                      {student.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.username || 'No username'}
                        </div>
                        {/* Show admission number if available from nested structure */}
                        {student.admission_no && (
                          <div className="text-xs text-blue-600 mt-1">
                            Admission: {student.admission_no}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
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
                      <div className="text-sm text-muted-foreground">
                        {formatDate(student.last_login_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSuspendStudent(student.id, student.is_active)}
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
                {paginatedStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {debouncedSearchTerm ? `No students found matching "${debouncedSearchTerm}"` : 'No students found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
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
              <DialogDescription>
                Enter the student's details and parent information to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newStudent.username}
                  onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                  placeholder="Enter username (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_first_name">Parent First Name *</Label>
                <Input
                  id="parent_first_name"
                  value={newStudent.parent_first_name}
                  onChange={(e) => setNewStudent({...newStudent, parent_first_name: e.target.value})}
                  placeholder="Enter parent first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_last_name">Parent Last Name *</Label>
                <Input
                  id="parent_last_name"
                  value={newStudent.parent_last_name}
                  onChange={(e) => setNewStudent({...newStudent, parent_last_name: e.target.value})}
                  placeholder="Enter parent last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_email">Parent Email *</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={newStudent.parent_email}
                  onChange={(e) => setNewStudent({...newStudent, parent_email: e.target.value})}
                  placeholder="Enter parent email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_phone_number">Parent Phone *</Label>
                <Input
                  id="parent_phone_number"
                  value={newStudent.parent_phone_number}
                  onChange={(e) => setNewStudent({...newStudent, parent_phone_number: e.target.value})}
                  placeholder="Enter parent phone number"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStudent}
                disabled={createStudentMutation.isPending || !newStudent.first_name || !newStudent.last_name || !newStudent.email || !newStudent.phone || !newStudent.parent_first_name || !newStudent.parent_last_name || !newStudent.parent_email || !newStudent.parent_phone_number}
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
                  disabled={bulkUploadMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
                {bulkUploadMutation.isPending && (
                  <p className="text-sm text-blue-500">Uploading students...</p>
                )}
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