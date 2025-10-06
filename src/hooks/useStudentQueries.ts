import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/lib/services/studentService';
import { toast } from 'sonner';

export const useStudentQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardData = () => {
    return useQuery({
      queryKey: ['student', 'dashboard'],
      queryFn: () => studentService.getDashboardData(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Classes
  const useClasses = (filters?: {
    academicYear?: string;
    term?: string;
    teacher?: string;
    subject?: string;
  }) => {
    return useQuery({
      queryKey: ['student', 'classes', filters],
      queryFn: () => studentService.getClasses(filters),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Results
  const useResults = (filters?: {
    academicYear?: string;
    term?: string;
  }) => {
    return useQuery({
      queryKey: ['student', 'results', filters],
      queryFn: () => studentService.getResults(filters),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Gamification
  const useGamificationData = () => {
    return useQuery({
      queryKey: ['student', 'gamification'],
      queryFn: () => studentService.getGamificationData(),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Settings
  const useSettings = () => {
    return useQuery({
      queryKey: ['student', 'settings'],
      queryFn: () => studentService.getSettings(),
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  // Mutations
  const useUpdateSettings = () => {
    return useMutation({
      mutationFn: studentService.updateSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['student', 'settings'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        toast.success('Settings updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update settings');
      }
    });
  };

  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: studentService.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'settings'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'gamification'] });
        toast.success('Profile updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile');
      }
    });
  };

  const useRedeemReward = () => {
    return useMutation({
      mutationFn: studentService.redeemReward,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['student', 'gamification'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        toast.success('Reward redeemed successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to redeem reward');
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
    useDashboardData,
    useClasses,
    useResults,
    useGamificationData,
    useSettings,
    
    // Mutations
    useUpdateSettings,
    useUpdateProfile,
    useRedeemReward,
    useChangePassword,
    useExportData,
  };
};