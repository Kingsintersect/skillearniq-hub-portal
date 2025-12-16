import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';
import { useEffect } from 'react';

export const useChildAcademicData = () => {
    const {
        setAllReports,
        setSelectedReportId,
        setSelectedReport,
        setReportsLoading,
        setReportsError,
        allReports,
        selectedReportId,
        selectedStudentId
    } = useParentStore();

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['parent', 'academic-data'],
        queryFn: () => parentService.getChildAcademicData(),
        staleTime: 1 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Sync React Query state with Zustand store
    // useEffect(() => {
    //     setReportsLoading(query.isLoading);
    //     setReportsError(query.error ? 'Failed to load academic data' : null);
    //     if (query.data?.data) {
    //         setAllReports(query.data.data);
    //     }
    // }, [
    //     query.data,
    //     query.isLoading,
    //     query.error,
    //     setAllReports,
    //     setReportsLoading,
    //     setReportsError,
    // ]);

    // Sync selected report with selectedStudentId
    useEffect(() => {
        if (selectedStudentId && allReports.length > 0) {
            const reportForSelectedStudent = allReports.find(report => report.id === selectedStudentId);
            if (reportForSelectedStudent) {
                setSelectedReport(reportForSelectedStudent);
            } else {
                // If no report found for selected student, clear the selection
                setSelectedReport(null);
                setSelectedReportId(null);
            }
        } else if (!selectedStudentId) {
            // Clear report selection when no student is selected
            setSelectedReport(null);
            setSelectedReportId(null);
        }
    }, [selectedStudentId, allReports, setSelectedReport, setSelectedReportId]);

    // Auto-select first report when data loads and no student is selected
    useEffect(() => {
        if (allReports.length > 0 && !selectedStudentId && !selectedReportId) {
            setSelectedReportId(allReports[0].id.toString());
            setSelectedReport(allReports[0]);
        }
    }, [allReports, selectedStudentId, selectedReportId, setSelectedReport, setSelectedReportId]);

    // Helper functions
    const refetchAcademicData = () => {
        queryClient.invalidateQueries({ queryKey: ['parent', 'academic-data'] });
    };

    const selectReportById = (id: string) => {
        const report = allReports.find(report => report.id === id);
        if (report) {
            setSelectedReport(report);
            // Also update the selectedStudentId to maintain consistency
            useParentStore.getState().setSelectedStudentId(id);
        }
    };

    const getSelectedReport = () => {
        return useParentStore.getState().selectedReport;
    };

    const getReportByStudentId = (studentId: string) => {
        return allReports.find(report => report.id === studentId);
    };

    return {
        // React Query data
        ...query,

        // Zustand state
        allReports,
        selectedReport: useParentStore.getState().selectedReport,
        selectedReportId,
        selectedStudentId,
        isReportsLoading: useParentStore.getState().isReportsLoading,
        reportsError: useParentStore.getState().reportsError,

        // Actions
        refetchAcademicData,
        selectReportById,
        getSelectedReport,
        getReportByStudentId,
        setSelectedReport: useParentStore.getState().setSelectedReport,
        setSelectedReportId: useParentStore.getState().setSelectedReportId,
    };
};