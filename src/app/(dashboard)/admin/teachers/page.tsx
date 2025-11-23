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
import { Plus, Search, Download, Upload, Trash2, BookOpen, Sheet, FileDown, FileText } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';
import { CreateTeacherPayload, AssignTeacherPayload, Category, Course } from '@/lib/services/admin/teacherService';

type Assignment = {
  category_id: number;
  course_id: number;
  start_date: string;
  end_date: string;
  meta: {
    semester: string;
    room: string;
  };
};

type ExportFormat = 'csv' | 'excel' | 'pdf';

// Custom hook for export functionality
const useExportTeachers = () => {
  const exportToCSV = (teachers: any[], filename: string = 'teachers') => {
    if (!teachers.length) return;
    
    const headers = [
      'Teacher ID',
      'Username',
      'First Name',
      'Last Name',
      'Email', 
      'Phone', 
      'Categories',
      'Subjects',
      'Status',
      'Employment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...teachers.map(teacher => [
        teacher.employee_no || teacher.teacherId,
        `"${teacher.username}"`,
        `"${teacher.first_name}"`,
        `"${teacher.last_name}"`,
        `"${teacher.email}"`,
        `"${teacher.phone || 'N/A'}"`,
        `"${teacher.categories?.join('; ') || ''}"`,
        `"${teacher.subjects?.join('; ') || ''}"`,
        teacher.status,
        `"${teacher.employmentDate || teacher.hire_date || 'N/A'}"`
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
      'Username',
      'First Name',
      'Last Name',
      'Email', 
      'Phone', 
      'Categories',
      'Subjects',
      'Status',
      'Employment Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...teachers.map(teacher => [
        teacher.employee_no || teacher.teacherId,
        `"${teacher.username}"`,
        `"${teacher.first_name}"`,
        `"${teacher.last_name}"`,
        `"${teacher.email}"`,
        `"${teacher.phone || 'N/A'}"`,
        `"${teacher.categories?.join('; ') || ''}"`,
        `"${teacher.subjects?.join('; ') || ''}"`,
        teacher.status,
        `"${teacher.employmentDate || teacher.hire_date || 'N/A'}"`
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
          <td>${teacher.employee_no || teacher.teacherId}</td>
          <td>${teacher.username}</td>
          <td>${teacher.first_name} ${teacher.last_name}</td>
          <td>${teacher.email}</td>
          <td>${teacher.phone || 'N/A'}</td>
          <td>${teacher.categories?.join(', ') || ''}</td>
          <td>${teacher.subjects?.join(', ') || ''}</td>
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
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Categories</th>
                  <th>Subjects</th>
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

// Improved Debounce hook with better TypeScript
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

export default function TeachersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  });
  
  const { 
    useCategories,
    useCourses,
    useTeachers, 
    useCreateTeacher, 
    useAssignTeacher, 
    useDeleteTeacher,
    useBulkUploadTeachers 
  } = useAdminQueries();

  // FIXED: Use debounce for search with proper typing
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // FIXED: Properly handle filter changes with useEffect
  const [filterParams, setFilterParams] = useState({
    search: '',
    category: undefined as string | undefined,
    status: undefined as string | undefined
  });

  // Update filter params when debounced search or filters change
  useEffect(() => {
    console.log('Filter params updated:', {
      search: debouncedSearchTerm,
      category: filters.category !== 'all' ? filters.category : undefined,
      status: filters.status !== 'all' ? filters.status : undefined
    });
    
    setFilterParams({
      search: debouncedSearchTerm,
      category: filters.category !== 'all' ? filters.category : undefined,
      status: filters.status !== 'all' ? filters.status : undefined
    });
  }, [debouncedSearchTerm, filters.category, filters.status]);

  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: coursesResponse, isLoading: coursesLoading, error: coursesError } = useCourses();
  
  // FIXED: Use the filterParams state that gets updated properly
  const { data: teachersResponse, isLoading: teachersLoading, error: teachersError, refetch } = useTeachers(filterParams);

  const { exportToCSV, exportToExcel, exportToPDF } = useExportTeachers();

  const createTeacherMutation = useCreateTeacher();
  const assignTeacherMutation = useAssignTeacher();
  const deleteTeacherMutation = useDeleteTeacher();
  const bulkUploadMutation = useBulkUploadTeachers();

  const [newTeacher, setNewTeacher] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    password: 'P@55word',
    employee_no: '',
    hire_date: '',
    subjects: [] as string[]
  });

  const [assignment, setAssignment] = useState<Assignment>({
    category_id: 0,
    course_id: 0,
    start_date: '',
    end_date: '',
    meta: {
      semester: 'First',
      room: ''
    }
  });

  // Extract data from API responses
  const categories = categoriesResponse || [];
  const courses = coursesResponse || [];
  const teachers = teachersResponse?.data || [];

  // Filter only parent categories (parent = 0)
  const parentCategories = useMemo(() => {
    const parents = categories.filter(category => category.parent === 0);
    console.log('Parent categories:', parents);
    return parents;
  }, [categories]);

  // FIXED: Get all child categories for a given parent category
  const getChildCategories = useMemo(() => {
    const childMap: { [key: number]: Category[] } = {};
    categories.forEach(category => {
      if (category.parent !== 0) {
        if (!childMap[category.parent]) {
          childMap[category.parent] = [];
        }
        childMap[category.parent].push(category);
      }
    });
    console.log('Child categories map:', childMap);
    return childMap;
  }, [categories]);

  // FIXED: Filter courses by selected category - include both parent and child categories
  const filteredCourses = useMemo(() => {
    if (assignment.category_id === 0) {
      console.log('No category selected for course filtering');
      return [];
    }
    
    // Get all category IDs to include (parent + children)
    const categoryIdsToInclude = [assignment.category_id];
    const childCategories = getChildCategories[assignment.category_id] || [];
    childCategories.forEach(child => categoryIdsToInclude.push(child.id));
    
    console.log('Filtering courses for categories:', categoryIdsToInclude);
    
    const filtered = courses.filter(course => 
      categoryIdsToInclude.includes(course.category) && course.visible === 1
    );
    
    console.log(`Filtered courses for category ${assignment.category_id}:`, filtered);
    return filtered;
  }, [courses, assignment.category_id, getChildCategories]);

  // FIXED: Build complete category hierarchy for display
  const categoryHierarchy = useMemo(() => {
    const hierarchy: { [key: number]: Category & { children?: Category[] } } = {};
    
    // First add all parent categories
    parentCategories.forEach(category => {
      hierarchy[category.id] = { ...category, children: [] };
    });
    
    // Then add children to their parents
    categories.forEach(category => {
      if (category.parent !== 0 && hierarchy[category.parent]) {
        hierarchy[category.parent].children?.push(category);
      }
    });
    
    const result = Object.values(hierarchy);
    console.log('Category hierarchy:', result);
    return result;
  }, [categories, parentCategories]);

  // Debug search functionality
  useEffect(() => {
    console.log('=== SEARCH DEBUGGING ===');
    console.log('Search Term:', searchTerm);
    console.log('Debounced Search Term:', debouncedSearchTerm);
    console.log('Filter Params:', filterParams);
    console.log('Teachers Data:', teachers);
    console.log('Teachers Count:', teachers.length);
    console.log('=== END SEARCH DEBUGGING ===');
  }, [searchTerm, debouncedSearchTerm, filterParams, teachers]);

  // Debug categories and courses
  useEffect(() => {
    console.log('=== CATEGORIES & COURSES DEBUGGING ===');
    console.log('All Categories:', categories);
    console.log('All Courses:', courses);
    console.log('Parent Categories:', parentCategories);
    console.log('Child Categories Map:', getChildCategories);
    console.log('Currently Selected Category ID:', assignment.category_id);
    console.log('Filtered Courses:', filteredCourses);
    console.log('=== END CATEGORIES & COURSES DEBUGGING ===');
  }, [categories, courses, parentCategories, getChildCategories, assignment.category_id, filteredCourses]);

  const handleCreateTeacher = () => {
    const payload: CreateTeacherPayload = {
      first_name: newTeacher.first_name,
      last_name: newTeacher.last_name,
      email: newTeacher.email,
      username: newTeacher.username,
      phone: newTeacher.phone,
      password: newTeacher.password,
      teacher: {
        employee_no: newTeacher.employee_no,
        hire_date: newTeacher.hire_date,
        subjects: newTeacher.subjects
      }
    };

    createTeacherMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewTeacher({
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          phone: '',
          password: 'P@55word',
          employee_no: '',
          hire_date: '',
          subjects: []
        });
      },
      onError: () => {
        // Error handling is done in the mutation
      }
    });
  };

  const handleAssignTeacher = () => {
    if (selectedTeacher && assignment.category_id && assignment.course_id && assignment.start_date && assignment.end_date) {
      const payload: AssignTeacherPayload = {
        class_group_id: assignment.category_id,
        subject_id: assignment.course_id,
        teacher_id: selectedTeacher.id,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
        meta: assignment.meta
      };

      assignTeacherMutation.mutate(payload, {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
          setAssignment({
            category_id: 0,
            course_id: 0,
            start_date: '',
            end_date: '',
            meta: {
              semester: 'First',
              room: ''
            }
          });
        },
        onError: () => {
          // Error handling is done in the mutation
        }
      });
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    deleteTeacherMutation.mutate(teacherId, {
      onError: () => {
        // Error handling is done in the mutation
      }
    });
  };

  const handleExport = (format: ExportFormat) => {
    if (teachers.length === 0) {
      toast.error('No teachers available to export');
      return;
    }

    try {
      const filename = `teachers_${filters.category === 'all' ? 'all_categories' : filters.category}`;
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
      'first_name',
      'last_name',
      'email',
      'username',
      'phone',
      'employee_no',
      'hire_date'
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

  // FIXED: Handle search input change with immediate feedback
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('Search input changed:', value);
  };

  // FIXED: Handle filter changes
  const handleCategoryFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const isLoading = teachersLoading || categoriesLoading || coursesLoading;

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

  if (teachersError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-destructive">
          <div>Failed to load teachers</div>
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

        {/* Search and Filters - FIXED: Proper event handlers */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers by name, username, email, or employee number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {debouncedSearchTerm ? `Searching for: "${debouncedSearchTerm}"` : 'Type to search...'}
                </div>
              </div>
              <Select 
                value={filters.category} 
                onValueChange={handleCategoryFilterChange}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.status} 
                onValueChange={handleStatusFilterChange}
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
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
              <div className="text-sm">
                Showing: {filters.category === 'all' ? 'All categories' : filters.category} • {filters.status === 'all' ? 'All status' : filters.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>
              {teachers.length} teachers in the system
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.employee_no || teacher.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {teacher.username}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
                        <div className="text-sm text-muted-foreground">{teacher.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.categories?.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {(!teacher.categories || teacher.categories.length === 0) && (
                          <span className="text-muted-foreground text-xs">No categories</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects?.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {(!teacher.subjects || teacher.subjects.length === 0) && (
                          <span className="text-muted-foreground text-xs">No subjects</span>
                        )}
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
                {teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {debouncedSearchTerm ? `No teachers found matching "${debouncedSearchTerm}"` : 'No teachers found'}
                    </TableCell>
                  </TableRow>
                )}
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
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={newTeacher.first_name}
                  onChange={(e) => setNewTeacher({...newTeacher, first_name: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={newTeacher.last_name}
                  onChange={(e) => setNewTeacher({...newTeacher, last_name: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newTeacher.username}
                  onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_no">Employee Number</Label>
                <Input
                  id="employee_no"
                  value={newTeacher.employee_no}
                  onChange={(e) => setNewTeacher({...newTeacher, employee_no: e.target.value})}
                  placeholder="Enter employee number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={newTeacher.hire_date}
                  onChange={(e) => setNewTeacher({...newTeacher, hire_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTeacher}
                disabled={createTeacherMutation.isPending || !newTeacher.first_name || !newTeacher.last_name || !newTeacher.email || !newTeacher.username || !newTeacher.employee_no}
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
                  disabled={bulkUploadMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
                {bulkUploadMutation.isPending && (
                  <p className="text-sm text-blue-500">Uploading teachers...</p>
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

        {/* Assign Teacher Dialog - FIXED: Now properly shows courses from parent and child categories */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Teacher to Course</DialogTitle>
              <DialogDescription>
                Assign {selectedTeacher?.first_name} {selectedTeacher?.last_name} to a course within a category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={assignment.category_id.toString()} 
                  onValueChange={(value) => setAssignment({
                    ...assignment, 
                    category_id: parseInt(value),
                    course_id: 0
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.length > 0 ? (
                      parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {categoriesError && (
                  <p className="text-sm text-destructive">Failed to load categories</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Course</Label>
                <Select 
                  value={assignment.course_id.toString()} 
                  onValueChange={(value) => setAssignment({
                    ...assignment, 
                    course_id: parseInt(value)
                  })}
                  disabled={assignment.category_id === 0 || filteredCourses.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        assignment.category_id === 0 
                          ? "Select a category first" 
                          : filteredCourses.length === 0 
                            ? "No courses available" 
                            : `Select course (${filteredCourses.length} available)`
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.fullname} ({course.shortname})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        No courses available for this category
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {coursesError && (
                  <p className="text-sm text-destructive">Failed to load courses</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={assignment.start_date}
                    onChange={(e) => setAssignment({...assignment, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={assignment.end_date}
                    onChange={(e) => setAssignment({...assignment, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select 
                    value={assignment.meta.semester} 
                    onValueChange={(value) => setAssignment({
                      ...assignment, 
                      meta: {...assignment.meta, semester: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First Semester</SelectItem>
                      <SelectItem value="Second">Second Semester</SelectItem>
                      <SelectItem value="Third">Third Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    value={assignment.meta.room}
                    onChange={(e) => setAssignment({
                      ...assignment, 
                      meta: {...assignment.meta, room: e.target.value}
                    })}
                    placeholder="Room number"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignTeacher}
                disabled={
                  assignTeacherMutation.isPending || 
                  !assignment.category_id || 
                  !assignment.course_id || 
                  !assignment.start_date || 
                  !assignment.end_date ||
                  assignment.category_id === 0 ||
                  assignment.course_id === 0
                }
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