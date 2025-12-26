// hooks/useStudentQueries.ts - Complete Updated Version
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, GamificationData } from '@/lib/services/studentService';
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

  // Gamification data query
  const useGamificationData = () => {
    return useQuery({
      queryKey: ['student', 'gamification'],
      queryFn: async () => {
        const response = await studentService.getGamificationData();
        console.log('Gamification response in hook:', response);
        return response;
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  // Enrolled courses query
  const useEnrolledCourses = () => {
    return useQuery({
      queryKey: ['student', 'enrolled-courses'],
      queryFn: () => studentService.getEnrolledCourses(),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Course grades query
  const useStudentCourseGrades = (courseId: number | null) => {
    return useQuery({
      queryKey: ['student', 'course-grades', courseId],
      queryFn: () => {
        if (!courseId) return Promise.resolve({
          status: 400,
          message: 'Course ID is required',
          data: {
            course_id: 0,
            course_code: '',
            course_name: '',
            course_image_url: '',
            instructors: [],
            students: []
          }
        });
        return studentService.getCourseGrades(courseId);
      },
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Redeem reward mutation
  const useRedeemReward = () => {
    return useMutation({
      mutationFn: async (rewardId: number) => {
        const response = await studentService.redeemReward(rewardId);
        return response;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['student', 'gamification'] });
        
        if (data.message) {
          toast.success(data.message);
        } else {
          toast.success('Reward redeemed successfully!');
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to redeem reward');
      },
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

  // Export results mutation
  const useExportResults = () => {
    return useMutation({
      mutationFn: (format: 'csv' | 'excel' | 'pdf') => 
        studentService.exportResults(format),
      onSuccess: () => {
        toast.success('Results exported successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to export results');
      }
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
    useGamificationData,
    useEnrolledCourses,
    useStudentCourseGrades,
    useRedeemReward,

    // Mutations
    useUpdateProfile,
    useChangePassword,
    useExportData,
    useExportResults,
  };
};