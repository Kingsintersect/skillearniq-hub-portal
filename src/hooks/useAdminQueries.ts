import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/lib/services/adminService';
import { toast } from 'sonner';
import { PaginationParams } from '@/types/auth';

export const useAdminQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['admin', 'dashboard', 'stats'],
      queryFn: () => adminService.getDashboardStats(),
    });
  };

  // Students
  const useStudents = (params?: PaginationParams & { search?: string; class?: string; status?: string }) => {
    return useQuery({
      queryKey: ['admin', 'students', params],
      queryFn: () => adminService.getStudents(params),
    });
  };

  const useCreateStudent = () => {
    return useMutation({
      mutationFn: adminService.createStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
        toast.success('Student created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create student');
      }
    });
  };

  const useUpdateStudentStatus = () => {
    return useMutation({
      mutationFn: ({ studentId, status }: { studentId: number; status: 'active' | 'suspended' }) => 
        adminService.updateStudentStatus(studentId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
        toast.success('Student status updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update student status');
      }
    });
  };

  const useDeleteStudent = () => {
    return useMutation({
      mutationFn: adminService.deleteStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
        toast.success('Student deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete student');
      }
    });
  };

  // Teachers
  const useTeachers = (params?: PaginationParams & { search?: string; subject?: string; status?: string }) => {
    return useQuery({
      queryKey: ['admin', 'teachers', params],
      queryFn: () => adminService.getTeachers(params),
    });
  };

  const useCreateTeacher = () => {
    return useMutation({
      mutationFn: adminService.createTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
        toast.success('Teacher created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create teacher');
      }
    });
  };

  const useAssignTeacher = () => {
    return useMutation({
      mutationFn: ({ teacherId, class: className, subjects }: { teacherId: number; class: string; subjects: string[] }) => 
        adminService.assignTeacher(teacherId, className, subjects),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
        toast.success('Teacher assigned successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to assign teacher');
      }
    });
  };

  const useDeleteTeacher = () => {
    return useMutation({
      mutationFn: adminService.deleteTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
        toast.success('Teacher deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete teacher');
      }
    });
  };

  // Parents
  const useParents = (params?: PaginationParams & { search?: string; status?: string }) => {
    return useQuery({
      queryKey: ['admin', 'parents', params],
      queryFn: () => adminService.getParents(params),
    });
  };

  const useCreateParent = () => {
    return useMutation({
      mutationFn: adminService.createParent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'parents'] });
        toast.success('Parent created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create parent');
      }
    });
  };

  const useDeleteParent = () => {
    return useMutation({
      mutationFn: adminService.deleteParent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'parents'] });
        toast.success('Parent deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete parent');
      }
    });
  };

  // Payments
  const usePayments = (params?: { 
    academicYear?: string; 
    term?: string; 
    class?: string; 
    student?: string; 
    status?: string;
    search?: string;
  }) => {
    return useQuery({
      queryKey: ['admin', 'payments', params],
      queryFn: () => adminService.getPayments(params),
    });
  };

  // Reports
  const useReports = (params?: { 
    academicYear?: string; 
    term?: string; 
    class?: string; 
    student?: string;
  }) => {
    return useQuery({
      queryKey: ['admin', 'reports', params],
      queryFn: () => adminService.getReports(params),
    });
  };

  // Messages
  const useSendMessage = () => {
    return useMutation({
      mutationFn: adminService.sendMessage,
      onSuccess: () => {
        toast.success('Message sent successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to send message');
      }
    });
  };

  return {
    // Dashboard
    useDashboardStats,
    
    // Students
    useStudents,
    useCreateStudent,
    useUpdateStudentStatus,
    useDeleteStudent,
    
    // Teachers
    useTeachers,
    useCreateTeacher,
    useAssignTeacher,
    useDeleteTeacher,
    
    // Parents
    useParents,
    useCreateParent,
    useDeleteParent,
    
    // Payments
    usePayments,
    
    // Reports
    useReports,
    
    // Messages
    useSendMessage,
  };
};