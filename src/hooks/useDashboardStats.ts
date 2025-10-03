'use client'
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/lib/services/analyticsService';
import { useAuthContext } from '@/providers/AuthProvider';

export const useDashboardStats = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => analyticsService.getTeacherDashboardStats(Number(user?.id) || 1),
    enabled: !!user?.id,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};