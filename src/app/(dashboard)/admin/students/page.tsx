'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Download,
  Upload,
  Ban,
  Trash2,
  Mail,
  Phone,
  Sheet,
  FileDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';
import { CreateStudentPayload } from '@/lib/services/admin/studentService';

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

// Pagination Component
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-border/50 mt-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
        <span className="font-medium text-foreground">{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 border-border/50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 border-border/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 py-1 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`h-8 w-8 p-0 ${currentPage === page ? '' : 'border-border/50'}`}
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
          className="h-8 w-8 p-0 border-border/50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 border-border/50"
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
  } = useAdminQueries();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: allStudentsResponse, isLoading, error, refetch } = useAllStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();

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

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.is_active === 1).length;
  const inactiveStudents = students.filter(s => s.is_active === 0).length;
  const verifiedStudents = students.filter(s => s.email_verified === 1).length;

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
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteStudentMutation.mutate(studentId, {
        onSuccess: () => {
          toast.success('Student deleted successfully!');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to delete student');
        }
      });
    }
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
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">Loading students...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error loading students</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
              <RefreshCw size={16} />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">User Management</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Students</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Manage all students and their information. View, add, suspend, and track student records.
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="varsecondary" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border/70 rounded-2xl">
                <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
                  <Sheet className="h-4 w-4" /> CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
                  <FileDown className="h-4 w-4" /> Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                  <FileText className="h-4 w-4" /> PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="secondary" className="gap-2">
              <Plus size={16} />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{activeStudents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <UserCheck size={18} />
              </div>
            </div>
            <Progress value={(activeStudents / totalStudents) * 100 || 0} className="h-1 mt-2" />
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Inactive</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{inactiveStudents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <UserX size={18} />
              </div>
            </div>
            <Progress value={(inactiveStudents / totalStudents) * 100 || 0} className="h-1 mt-2" />
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Verified</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{verifiedStudents}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <Mail size={18} />
              </div>
            </div>
            <Progress value={(verifiedStudents / totalStudents) * 100 || 0} className="h-1 mt-2" />
          </div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search students by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>
          <Select value={filters.status} onValueChange={(value) => setFilters({ status: value })}>
            <SelectTrigger className="w-full md:w-[180px] rounded-xl bg-background border-input">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/70 rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={pagination.itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-full md:w-[160px] rounded-xl bg-background border-input">
              <SelectValue placeholder="Show per page" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/70 rounded-xl">
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {filteredStudents.length} students found
          {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-3xl border border-border/70 bg-card/95 overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="p-5 border-b border-border/50">
          <div>
            <p className="text-sm font-semibold text-card-foreground">All Students</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredStudents.length} students in the system
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-foreground font-semibold">Name</TableHead>
                <TableHead className="text-foreground font-semibold">Contact</TableHead>
                <TableHead className="text-foreground font-semibold">Status</TableHead>
                <TableHead className="text-foreground font-semibold hidden md:table-cell">Verification</TableHead>
                <TableHead className="text-foreground font-semibold hidden lg:table-cell">Last Login</TableHead>
                <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{student.first_name} {student.last_name}</div>
                      <div className="text-xs text-muted-foreground">{student.username || 'No username'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{student.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.is_active ? 'default' : 'secondary'} className={student.is_active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={student.email_verified ? 'default' : 'outline'} className={`text-xs ${student.email_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}`}>
                        Email
                      </Badge>
                      <Badge variant={student.phone_verified ? 'default' : 'outline'} className={`text-xs ${student.phone_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}`}>
                        Phone
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(student.last_login_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuspendStudent(student.id, student.is_active)}
                        className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        title={student.is_active ? 'Suspend' : 'Activate'}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

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

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-base font-medium text-foreground">No students found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {debouncedSearchTerm ? 'Try adjusting your search or filters' : 'Add your first student to get started'}
            </p>
            {!debouncedSearchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 gap-2">
                <Plus size={16} />
                Add Student
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Student Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the student details and parent information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">First Name *</Label>
              <Input
                value={newStudent.first_name}
                onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                className="rounded-xl"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Last Name *</Label>
              <Input
                value={newStudent.last_name}
                onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                className="rounded-xl"
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email *</Label>
              <Input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="rounded-xl"
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Username *</Label>
              <Input
                value={newStudent.username}
                onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                className="rounded-xl"
                placeholder="johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Phone *</Label>
              <Input
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="rounded-xl"
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Password</Label>
              <Input
                type="password"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Parent First Name *</Label>
              <Input
                value={newStudent.parent_first_name}
                onChange={(e) => setNewStudent({ ...newStudent, parent_first_name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Parent Last Name *</Label>
              <Input
                value={newStudent.parent_last_name}
                onChange={(e) => setNewStudent({ ...newStudent, parent_last_name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Parent Email *</Label>
              <Input
                type="email"
                value={newStudent.parent_email}
                onChange={(e) => setNewStudent({ ...newStudent, parent_email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Parent Phone *</Label>
              <Input
                value={newStudent.parent_phone_number}
                onChange={(e) => setNewStudent({ ...newStudent, parent_phone_number: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreateStudent} disabled={createStudentMutation.isPending} className="rounded-xl gap-2">
              {createStudentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Student'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}