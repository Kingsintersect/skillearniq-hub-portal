// hooks/useGradeReports.ts
import { useQuery } from '@tanstack/react-query';
import { parentService } from '@/lib/services/parentService';
import { useParentStore } from '@/store/parentStore';

export const useGradeReports = () => {
  const {
    gradeReports,
    selectedGradeReport,
    selectedGradeReportId,
    gradeSummary,
    isGradeReportsLoading,
    gradeReportsError,
    setGradeReports,
    setSelectedGradeReport,
    setSelectedGradeReportId,
    setGradeSummary,
    setGradeReportsLoading,
    setGradeReportsError,
    selectedStudentId
  } = useParentStore();

  const query = useQuery({
    queryKey: ['parent', 'grade-reports', selectedStudentId || 'all'],
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
          setSelectedGradeReportId(report.id);
        }
        
        // Calculate summary if we have reports
        if (reports.length > 0 && selectedStudentId) {
          const studentReport = reports.find(r => r.studentId === selectedStudentId);
          if (studentReport && studentReport.terms.length > 0) {
            const latestTerm = studentReport.terms[studentReport.terms.length - 1];
            const previousTerm = studentReport.terms.length > 1 
              ? studentReport.terms[studentReport.terms.length - 2] 
              : null;
            
            const trend = previousTerm 
              ? ((latestTerm.summary.average - previousTerm.summary.average) / previousTerm.summary.average) * 100
              : 0;
            
            setGradeSummary({
              studentId: studentReport.studentId,
              studentName: studentReport.studentName,
              class: studentReport.class,
              currentTerm: latestTerm.term,
              currentAverage: latestTerm.summary.average,
              currentGrade: latestTerm.summary.grade,
              currentPosition: latestTerm.summary.position,
              classSize: latestTerm.summary.classSize,
              improvement: trend > 0 ? 'improved' : trend < 0 ? 'declined' : 'maintained',
              trend: trend
            });
          }
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
    enabled: !!selectedStudentId,
  });

  return {
    ...query,
    gradeReports,
    selectedGradeReport,
    selectedGradeReportId,
    gradeSummary,
    isGradeReportsLoading,
    gradeReportsError
  };
};