// hooks/useStudentQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/lib/services/studentService';
import { toast } from 'sonner';

export const useStudentQueries = () => {
  const queryClient = useQueryClient();

  // Profile
  const useProfile = () => {
    return useQuery({
      queryKey: ['student', 'profile'],
      queryFn: () => studentService.getProfile(),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Dashboard Summary
  const useDashboardSummary = () => {
    return useQuery({
      queryKey: ['student', 'dashboard', 'summary'],
      queryFn: () => studentService.getDashboardSummary(),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Payment Stats
  const usePaymentStats = () => {
    return useQuery({
      queryKey: ['student', 'payment', 'stats'],
      queryFn: () => studentService.getPaymentStats(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Assessments
  const useAssessments = () => {
    return useQuery({
      queryKey: ['student', 'assessments'],
      queryFn: () => studentService.getAssessments(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Attendance
  const useAttendance = () => {
    return useQuery({
      queryKey: ['student', 'attendance'],
      queryFn: () => studentService.getAttendance(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Classes
  const useClasses = () => {
    return useQuery({
      queryKey: ['student', 'classes'],
      queryFn: () => studentService.getClasses(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Moodle Courses
  const useCourses = () => {
    return useQuery({
      queryKey: ['student', 'courses'],
      queryFn: () => studentService.getCourses(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Student Courses with Progress
  const useStudentCourses = () => {
    return useQuery({
      queryKey: ['student', 'courses', 'progress'],
      queryFn: () => studentService.getStudentCourses(),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Mutations
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: studentService.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        toast.success('Profile updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile');
      }
    });
  };

  const useChangePassword = () => {
    return useMutation({
      mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
        studentService.changePassword(currentPassword, newPassword),
      onSuccess: () => {
        toast.success('Password changed successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to change password');
      }
    });
  };

  const useExportData = () => {
    return useMutation({
      mutationFn: studentService.exportData,
      onSuccess: () => {
        toast.success('Data exported successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to export data');
      }
    });
  };

  return {
    // Queries
    useProfile,
    useDashboardSummary,
    usePaymentStats,
    useAssessments,
    useAttendance,
    useClasses,
    useCourses,
    useStudentCourses,

    // Mutations
    useUpdateProfile,
    useChangePassword,
    useExportData,
  };
};