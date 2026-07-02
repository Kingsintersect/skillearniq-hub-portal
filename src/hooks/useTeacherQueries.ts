import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '@/lib/services/teacherService';
import { toast } from 'sonner';

export const useTeacherQueries = () => {
  const queryClient = useQueryClient();

  // ==================== DASHBOARD ====================
  const useDashboardData = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'dashboard', teacherId],
      queryFn: () => teacherService.getDashboardData(teacherId),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  const useTeacherCourseGrades = (courseId: number | null) => {
    const getCurrentTeacherId = (): number => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            return user.id || 22;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      return 22;
    };

    const teacherId = getCurrentTeacherId();

    return useQuery({
      queryKey: ['teacher', 'course-grades', teacherId, courseId],
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
        return teacherService.getCourseGrades(courseId);
      },
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== ATTENDANCE (General) ====================
  // In your useTeacherQueries hook
  const useAttendance = (
    teacherId?: number, // Make teacherId optional
    filters?: {
      term?: string;
      classId?: number;
    }
  ) => {
    return useQuery({
      queryKey: ['teacher', 'attendance', teacherId, filters],
      queryFn: () => {
        if (!teacherId) {
          throw new Error('Teacher ID is required');
        }
        return teacherService.getAttendance(teacherId, filters);
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: !!teacherId, // Only enable when teacherId is truthy
    });
  };

  // ==================== STUDENTS ====================
  const useStudents = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'students', teacherId, filters],
      queryFn: () => teacherService.getStudentsPerCourse(teacherId, filters),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== ATTENDANCE PER COURSE ====================
  const useAttendancePerCourse = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'attendance-per-course', teacherId, filters],
      queryFn: () => teacherService.getAttendancePerCourse(teacherId, filters),
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: !!filters?.classId,
    });
  };

  // ==================== CLASSES ====================
  const useClasses = (teacherId: number, filters?: { term?: string }) => {
    return useQuery({
      queryKey: ['teacher', 'classes', teacherId, filters],
      queryFn: () => teacherService.getClasses(teacherId, filters),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== ASSESSMENTS ====================
  const useAssessments = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
    type?: string;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'assessments', teacherId, filters],
      queryFn: async () => {
        if (!filters?.classId) {
          console.log('No classId provided, skipping assessments fetch');
          return null;
        }

        try {
          const data = await teacherService.getAssessments(teacherId, filters);
          return data;
        } catch (error: any) {
          console.warn('Error fetching assessments:', error.message || error);
          return {
            assessments: {
              upcoming: [],
              completed: [],
              drafts: []
            }
          };
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: !!teacherId && !!filters?.classId,
    });
  };

  // ==================== PROFILE ====================
  const useProfile = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'profile', teacherId],
      queryFn: () => teacherService.getProfile(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== NOTIFICATION SETTINGS ====================
  const useNotificationSettings = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'notifications', teacherId],
      queryFn: () => teacherService.getNotificationSettings(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== SECURITY SETTINGS ====================
  const useSecuritySettings = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'security', teacherId],
      queryFn: () => teacherService.getSecuritySettings(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== PREFERENCES ====================
  const usePreferences = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'preferences', teacherId],
      queryFn: () => teacherService.getPreferences(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  // ==================== MUTATIONS ====================

  // Create Assessment
  const useCreateAssessment = () => {
    return useMutation({
      mutationFn: teacherService.createAssessment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] });
        toast.success('Assessment created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create assessment');
      }
    });
  };

  // Update Assessment
  const useUpdateAssessment = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) =>
        teacherService.updateAssessment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        toast.success('Assessment updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update assessment');
      }
    });
  };

  // Delete Assessment
  const useDeleteAssessment = () => {
    return useMutation({
      mutationFn: teacherService.deleteAssessment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] });
        toast.success('Assessment deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete assessment');
      }
    });
  };

  // Create Group
  const useCreateGroup = () => {
    return useMutation({
      mutationFn: teacherService.createGroup,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
        toast.success('Group created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create group');
      }
    });
  };

  // Update Group
  const useUpdateGroup = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) =>
        teacherService.updateGroup(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
        toast.success('Group updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update group');
      }
    });
  };

  // Delete Group
  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: teacherService.deleteGroup,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
        toast.success('Group deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete group');
      }
    });
  };

  // Update Profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: any }) =>
        teacherService.updateProfile(teacherId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'profile'] });
        toast.success('Profile updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile');
      }
    });
  };

  // Update Notification Settings
  const useUpdateNotificationSettings = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: any }) =>
        teacherService.updateNotificationSettings(teacherId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'notifications'] });
        toast.success('Notification settings updated');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update notification settings');
      }
    });
  };

  // Update Preferences
  const useUpdatePreferences = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: any }) =>
        teacherService.updatePreferences(teacherId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'preferences'] });
        toast.success('Preferences updated');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update preferences');
      }
    });
  };

  // Change Password
  const useChangePassword = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: any }) =>
        teacherService.changePassword(teacherId, data),
      onSuccess: () => {
        toast.success('Password changed successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to change password');
      }
    });
  };

  return {
    // Queries
    useDashboardData,
    useTeacherCourseGrades,
    useClasses,
    useAssessments,
    useAttendance,
    useAttendancePerCourse,
    useStudents,
    useProfile,
    useNotificationSettings,
    useSecuritySettings,
    usePreferences,

    // Mutations
    useCreateAssessment,
    useUpdateAssessment,
    useDeleteAssessment,
    useCreateGroup,
    useUpdateGroup,
    useDeleteGroup,
    useUpdateProfile,
    useUpdateNotificationSettings,
    useUpdatePreferences,
    useChangePassword,
  };
};