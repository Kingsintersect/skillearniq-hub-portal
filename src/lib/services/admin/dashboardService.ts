import { apiClient } from "@/core/client";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  activeClasses: number;
  attendanceRate: number;
  feeCollection: number;
}

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // In a real implementation, you might have a dedicated endpoint for dashboard stats
      // For now, we'll simulate by fetching counts from different endpoints
      const [studentsRes, teachersRes, parentsRes] = await Promise.allSettled([
        apiClient.get<any>('/account/allstudents'),
        apiClient.get<any>('/account/allteachers'),
        apiClient.get<any>('/account/allparents')
      ]);

      const totalStudents = studentsRes.status === 'fulfilled' ? (studentsRes.value.data?.length || 0) : 0;
      const totalTeachers = teachersRes.status === 'fulfilled' ? (teachersRes.value.data?.length || 0) : 0;
      const totalParents = parentsRes.status === 'fulfilled' ? (parentsRes.value.data?.length || 0) : 0;

      return {
        totalStudents,
        totalTeachers,
        totalParents,
        activeClasses: 12, // This would come from your classes API
        attendanceRate: 87, // This would come from your attendance API
        feeCollection: 75, // This would come from your payments API
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalParents: 0,
        activeClasses: 0,
        attendanceRate: 0,
        feeCollection: 0,
      };
    }
  }
};