// hooks/useChildAcademicData.ts
import { useQuery } from '@tanstack/react-query';
import { parentService } from '@/lib/services/parentService';
import { useParentStore } from '@/store/parentStore';

export const useChildAcademicData = (childId?: string) => {
  const {
    allReports,
    selectedReport,
    selectedReportId,
    isReportsLoading,
    reportsError,
    setAllReports,
    setSelectedReport,
    setSelectedReportId,
    setReportsLoading,
    setReportsError,
    selectedChild
  } = useParentStore();

  const query = useQuery({
    queryKey: ['parent', 'academic-data', childId || selectedChild?.id || 'all'],
    queryFn: async () => {
      setReportsLoading(true);
      setReportsError(null);
      
      try {
        const targetChildId = childId || selectedChild?.id;
        const data = await parentService.getChildAcademicData(targetChildId);
        setAllReports(data);
        
        // Set selected report
        if (data.length > 0) {
          const report = targetChildId 
            ? data.find(r => r.id.toString() === targetChildId) || data[0]
            : data[0];
          setSelectedReport(report);
          setSelectedReportId(report.id.toString());
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
    enabled: !!selectedChild || !!childId,
  });

  return {
    ...query,
    allReports,
    selectedReport,
    selectedReportId,
    isReportsLoading,
    reportsError
  };
};