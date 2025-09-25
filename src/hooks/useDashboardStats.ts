'use client'
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/lib/services/analyticsService';
import { useAuth } from './use-auth';

export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
   queryFn: () => analyticsService.getTeacherDashboardStats(Number(user?.id) || 1),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};