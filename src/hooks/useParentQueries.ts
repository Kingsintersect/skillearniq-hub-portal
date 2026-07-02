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
    selectedStudentId,
    setSelectedStudentId,
    setDashboardStats,
    setMessages,
    setMessagesLoading,
    setMessagesError
  } = useParentStore();

  // Dashboard stats
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['parent', 'dashboard', 'stats'],
      queryFn: async () => {
        try {
          const stats = await parentService.getDashboardStats();
          setDashboardStats(stats);
          return stats;
        } catch (error: any) {
          console.error('Error in dashboard stats query:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  // Children list
  const useChildren = () => {
    return useQuery({
      queryKey: ['parent', 'children'],
      queryFn: async () => {
        try {
          const children = await parentService.getChildren();
          
          console.log('Children fetched:', children);
          
          // Update store with children data
          setChildren(children);
          
          // If no child is selected, select the first one
          if (children.length > 0 && !selectedChild) {
            const firstChild = children[0];
            setSelectedChild(firstChild);
            setSelectedStudentId(firstChild.id.toString());
          }
          
          return children;
        } catch (error: any) {
          console.error('Error in children query:', error);
          throw error;
        }
      },
      staleTime: 10 * 60 * 1000,
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
            const report = data.find(r => r.id.toString() === childId) || data[0];
            setSelectedReport(report);
          } else if (data.length > 0 && !selectedChild) {
            // If no child selected but we have data, use first one
            const report = data[0];
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
      enabled: true,
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

  // // Payment history
  // const usePaymentHistory = () => {
  //   return useQuery<{ payments: Payment[]; summary: any }, Error>({
  //     queryKey: ['parent', 'payments'],
  //     queryFn: async () => {
  //       setPaymentsLoading(true);
  //       setPaymentsError(null);
        
  //       try {
  //         const { payments, summary } = await parentService.getPaymentHistory();
  //         setPayments(payments);
  //         setPaymentSummary(summary);
  //         return { payments, summary };
  //       } catch (error: any) {
  //         setPaymentsError(error.message);
  //         throw error;
  //       } finally {
  //         setPaymentsLoading(false);
  //       }
  //     },
  //     staleTime: 5 * 60 * 1000,
  //     retry: 2,
  //   });
  // };

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
      queryFn: async () => {
        setMessagesLoading(true);
        setMessagesError(null);
        
        try {
          const messages = await parentService.getTeacherMessages();
          setMessages(messages);
          return messages;
        } catch (error: any) {
          setMessagesError(error.message);
          throw error;
        } finally {
          setMessagesLoading(false);
        }
      },
      staleTime: 2 * 60 * 1000,
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
    //usePaymentHistory,
    useGradeReports,
    useTeacherMessages,
    
    // Helpers
    invalidateQueries,
  };
};