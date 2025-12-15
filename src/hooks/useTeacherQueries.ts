// hooks/useTeacherQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationSettings, Preferences, StudentGroup, TeacherProfile, teacherService, Course, AssessmentsData } from '@/lib/services/teacherService';
import { toast } from 'sonner';

export const useTeacherQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardData = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'dashboard', teacherId],
      queryFn: () => teacherService.getDashboardData(teacherId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
    });
  };

  // Classes
  const useClasses = (teacherId: number, filters?: { term?: string }) => {
    return useQuery<Course[], Error>({
      queryKey: ['teacher', 'classes', teacherId, filters],
      queryFn: () => teacherService.getClasses(teacherId, filters),
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    });
  };

  // Assessments - with better error handling
  const useAssessments = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
    type?: string;
  }) => {
    return useQuery<AssessmentsData | null, Error>({
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
          // Handle the "PRO FEATURE ONLY" response or other errors
          console.warn('Error fetching assessments:', error.message || error);
          
          // Return empty assessments structure for user-friendly display
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
      retry: 1, // Only retry once since we handle errors gracefully
      enabled: !!teacherId && !!filters?.classId,
    });
  };

  // Attendance
  const useAttendance = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'attendance', teacherId, filters],
      queryFn: () => teacherService.getAttendance(teacherId, filters),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  // Students
  const useStudents = (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'students', teacherId, filters],
      queryFn: () => teacherService.getStudents(teacherId, filters),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Messages
  // const useMessages = (teacherId: number) => {
  //   return useQuery({
  //     queryKey: ['teacher', 'messages', teacherId],
  //     queryFn: () => teacherService.getMessages(teacherId),
  //     staleTime: 2 * 60 * 1000, // 2 minutes
  //     retry: 2,
  //   });
  // };

  // Mutations
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

  // Groups
  const useGroups = (teacherId: number, classId?: number) => {
    return useQuery({
      queryKey: ['teacher', 'groups', teacherId, classId],
      queryFn: () => teacherService.getGroups(teacherId, classId),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Group Mutations
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

  const useUpdateGroup = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<StudentGroup> }) =>
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

  // const useAddStudentToGroup = () => {
  //   return useMutation({
  //     mutationFn: teacherService.addStudentToGroup,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
  //       toast.success('Student added to group');
  //     },
  //     onError: (error: any) => {
  //       toast.error(error.message || 'Failed to add student to group');
  //     }
  //   });
  // };

  // const useRemoveStudentFromGroup = () => {
  //   return useMutation({
  //     mutationFn: teacherService.removeStudentFromGroup,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
  //       toast.success('Student removed from group');
  //     },
  //     onError: (error: any) => {
  //       toast.error(error.message || 'Failed to remove student from group');
  //     }
  //   });
  // };

  // Profile
  const useProfile = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'profile', teacherId],
      queryFn: () => teacherService.getProfile(teacherId),
      staleTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
    });
  };

  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: Partial<TeacherProfile> }) =>
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

  // Notification Settings
  const useNotificationSettings = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'notifications', teacherId],
      queryFn: () => teacherService.getNotificationSettings(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  const useUpdateNotificationSettings = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: NotificationSettings }) =>
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

  // Security Settings
  const useSecuritySettings = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'security', teacherId],
      queryFn: () => teacherService.getSecuritySettings(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  // Preferences
  const usePreferences = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'preferences', teacherId],
      queryFn: () => teacherService.getPreferences(teacherId),
      staleTime: 30 * 60 * 1000,
      retry: 2,
    });
  };

  const useUpdatePreferences = () => {
    return useMutation({
      mutationFn: ({ teacherId, data }: { teacherId: number; data: Preferences }) =>
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
    useClasses,
    useAssessments,
    useAttendance,
    useStudents,
    //useMessages,
    useGroups,
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
    // useAddStudentToGroup,
    // useRemoveStudentFromGroup,
    useUpdateProfile,
    useUpdateNotificationSettings,
    useUpdatePreferences,
    useChangePassword,
  };
};