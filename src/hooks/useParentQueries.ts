import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parentService } from '@/lib/services/parentService';

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

  return {
    useDashboardStats,
    useChildren,
  };
};