import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentService } from '@/lib/services/parentService';
import { toast } from 'sonner';

export const useParentQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['parent', 'dashboard', 'stats'],
      queryFn: () => parentService.getDashboardStats(),
    });
  };

  const useChildren = () => {
    return useQuery({
      queryKey: ['parent', 'children'],
      queryFn: () => parentService.getChildren(),
    });
  };

  // Academic Data
  const useChildAcademicData = (childId?: string) => {
    return useQuery({
      queryKey: ['parent', 'academic-data', childId],
      queryFn: () => parentService.getChildAcademicData(childId),
    });
  };

  // Messages
  const useTeacherMessages = (childId?: string) => {
    return useQuery({
      queryKey: ['parent', 'messages', childId],
      queryFn: () => parentService.getTeacherMessages(childId),
    });
  };

  // Payments
  const usePaymentHistory = (childId?: string) => {
    return useQuery({
      queryKey: ['parent', 'payments', childId],
      queryFn: () => parentService.getPaymentHistory(childId),
    });
  };

  return {
    useDashboardStats,
    useChildren,
    useChildAcademicData,
    useTeacherMessages,
    usePaymentHistory,
  };
};