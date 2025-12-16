// hooks/useParentQueries.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parentService } from '@/lib/services/parentService';
import { useParentStore } from '@/store/parentStore';
import { ChildAcademicData, Payment, StudentGradeReport } from '@/store/parentStore';

export const useParentQueries = () => {
  const queryClient = useQueryClient();
  const {
    setChildren,
    setSelectedChild,
    selectedChild,
    setAllReports,
    setSelectedReport,
    setPayments,
    setPaymentSummary,
    setGradeReports,
    setSelectedGradeReport,
    setReportsLoading,
    setReportsError,
    setPaymentsLoading,
    setPaymentsError,
    setGradeReportsLoading,
    setGradeReportsError,
    selectedStudentId
  } = useParentStore();

  // Dashboard stats
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['parent', 'dashboard', 'stats'],
      queryFn: () => parentService.getDashboardStats(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    });
  };

  // Children list
  const useChildren = () => {
    return useQuery({
      queryKey: ['parent', 'children'],
      queryFn: async () => {
        const children = await parentService.getChildren();
        
        // Update store with children data
        setChildren(children);
        
        // If no child is selected, select the first one
        if (children.length > 0 && !selectedChild) {
          setSelectedChild(children[0]);
        }
        
        return children;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    });
  };

  // Child academic data (performance report)
  const useChildAcademicData = (childId?: string) => {
    return useQuery<ChildAcademicData[], Error>({
      queryKey: ['parent', 'academic-data', childId || 'all'],
      queryFn: async () => {
        setReportsLoading(true);
        setReportsError(null);
        
        try {
          const data = await parentService.getChildAcademicData(childId);
          setAllReports(data);
          
          // Set selected report if childId is provided
          if (childId && data.length > 0) {
            const report = data.find(r => r.id === childId) || data[0];
            setSelectedReport(report);
          }
          
          return data;
        } catch (error: any) {
          setReportsError(error.message);
          throw error;
        } finally {
          setReportsLoading(false);
        }
      },
      staleTime: 10 * 60 * 1000,
      retry: 2,
      enabled: !!childId || true,
    });
  };

  // Course gradings for specific student
  const useCourseGradings = (studentEmail: string) => {
    return useQuery({
      queryKey: ['parent', 'course-gradings', studentEmail],
      queryFn: () => parentService.getCourseGradings(studentEmail),
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: !!studentEmail,
    });
  };

  // Payment history
  const usePaymentHistory = () => {
    return useQuery<{ payments: Payment[]; summary: any }, Error>({
      queryKey: ['parent', 'payments'],
      queryFn: async () => {
        setPaymentsLoading(true);
        setPaymentsError(null);
        
        try {
          const { payments, summary } = await parentService.getPaymentHistory();
          setPayments(payments);
          setPaymentSummary(summary);
          return { payments, summary };
        } catch (error: any) {
          setPaymentsError(error.message);
          throw error;
        } finally {
          setPaymentsLoading(false);
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  // Grade reports
  const useGradeReports = () => {
    return useQuery<StudentGradeReport[], Error>({
      queryKey: ['parent', 'grade-reports'],
      queryFn: async () => {
        setGradeReportsLoading(true);
        setGradeReportsError(null);
        
        try {
          const reports = await parentService.getGradeReports();
          setGradeReports(reports);
          
          // Set selected grade report based on selected student
          if (selectedStudentId && reports.length > 0) {
            const report = reports.find(r => r.studentId === selectedStudentId) || reports[0];
            setSelectedGradeReport(report);
          }
          
          return reports;
        } catch (error: any) {
          setGradeReportsError(error.message);
          throw error;
        } finally {
          setGradeReportsLoading(false);
        }
      },
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Teacher messages
  const useTeacherMessages = () => {
    return useQuery({
      queryKey: ['parent', 'messages'],
      queryFn: () => parentService.getTeacherMessages(),
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 2,
    });
  };

  // Invalidate queries helper
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['parent'] });
  };

  return {
    // Queries
    useDashboardStats,
    useChildren,
    useChildAcademicData,
    useCourseGradings,
    usePaymentHistory,
    useGradeReports,
    useTeacherMessages,
    
    // Helpers
    invalidateQueries,
  };
};