import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GradeSummary, useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';
import { useEffect } from 'react';

export const useGradeReports = () => {
    const {
        setGradeReports,
        setSelectedGradeReportId,
        setSelectedGradeReport,
        setGradeSummary,
        setGradeReportsLoading,
        setGradeReportsError,
        gradeReports,
        selectedGradeReportId,
        selectedStudentId
    } = useParentStore();

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['parent', 'grade-reports'],
        queryFn: () => parentService.getGradeReports(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Sync React Query state with Zustand store
    // useEffect(() => {
    //     setGradeReportsLoading(query.isLoading);
    //     setGradeReportsError(query.error ? 'Failed to load grade reports' : null);
    //     if (query.data?.data) {
    //         setGradeReports(query.data.data);
    //     }
    // }, [
    //     query.data,
    //     query.isLoading,
    //     query.error,
    //     setGradeReports,
    //     setGradeReportsLoading,
    //     setGradeReportsError,
    // ]);

    // Sync selected grade report with selectedStudentId
    useEffect(() => {
        if (selectedStudentId && gradeReports.length > 0) {
            const reportForSelectedStudent = gradeReports.find(report => report.studentId === selectedStudentId);
            if (reportForSelectedStudent) {
                setSelectedGradeReport(reportForSelectedStudent);
                setSelectedGradeReportId(reportForSelectedStudent.id);

                // Calculate summary
                const currentTerm = reportForSelectedStudent.terms[reportForSelectedStudent.terms.length - 1];
                const previousTerm = reportForSelectedStudent.terms.length > 1
                    ? reportForSelectedStudent.terms[reportForSelectedStudent.terms.length - 2]
                    : null;

                const summary: GradeSummary = {
                    studentId: reportForSelectedStudent.studentId,
                    studentName: reportForSelectedStudent.studentName,
                    class: reportForSelectedStudent.class,
                    currentTerm: currentTerm.term,
                    currentAverage: currentTerm.summary.average,
                    currentGrade: currentTerm.summary.grade,
                    currentPosition: currentTerm.summary.position,
                    classSize: currentTerm.summary.classSize,
                    improvement: previousTerm
                        ? (currentTerm.summary.average > previousTerm.summary.average ? 'improved' :
                            currentTerm.summary.average < previousTerm.summary.average ? 'declined' : 'maintained')
                        : 'maintained',
                    trend: previousTerm
                        ? ((currentTerm.summary.average - previousTerm.summary.average) / previousTerm.summary.average) * 100
                        : 0
                };
                setGradeSummary(summary);
            } else {
                setSelectedGradeReport(null);
                setSelectedGradeReportId(null);
                setGradeSummary(null);
            }
        } else if (!selectedStudentId) {
            setSelectedGradeReport(null);
            setSelectedGradeReportId(null);
            setGradeSummary(null);
        }
    }, [selectedStudentId, gradeReports, setSelectedGradeReport, setSelectedGradeReportId, setGradeSummary]);

    // Helper functions
    const refetchGradeReports = () => {
        queryClient.invalidateQueries({ queryKey: ['parent', 'grade-reports'] });
    };

    const selectReportById = (id: string) => {
        const report = gradeReports.find(report => report.id === id);
        if (report) {
            setSelectedGradeReport(report);
            setSelectedGradeReportId(id);
        }
    };

    const getSelectedReport = () => {
        return useParentStore.getState().selectedGradeReport;
    };

    const getReportByStudentId = (studentId: string) => {
        return gradeReports.find(report => report.studentId === studentId);
    };

    return {
        // React Query data
        ...query,

        // Zustand state
        gradeReports,
        selectedGradeReport: useParentStore.getState().selectedGradeReport,
        selectedGradeReportId,
        gradeSummary: useParentStore.getState().gradeSummary,
        selectedStudentId,
        isGradeReportsLoading: useParentStore.getState().isGradeReportsLoading,
        gradeReportsError: useParentStore.getState().gradeReportsError,

        // Actions
        refetchGradeReports,
        selectReportById,
        getSelectedReport,
        getReportByStudentId,
    };
};