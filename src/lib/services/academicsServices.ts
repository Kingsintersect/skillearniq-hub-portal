import { ApiError, PaginationParams } from "@/types/auth";
import { apiClient } from "./client";

export type AccademicSessions = {
    id: number;
    name: string;
    // startYear: string;
    // endYear: string;
    status: "ACTIVE" | "INACTIVE";
};
export type AccademicSemesters = {
    id: number;
    name: string;
    status: "ACTIVE" | "INACTIVE";
};
export const academicsServices = {
    getAcademicSessions: async (params?: PaginationParams): Promise<AccademicSessions[]> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.set('page', params.page.toString());
            if (params?.perPage) queryParams.set('perPage', params.perPage.toString());
            if (params?.search) queryParams.set('search', params.search);
            if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
            if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

            // const url = `/all-sessions${queryParams.toString() ? `?${queryParams}` : ''}`;
            const url = `/all-sessions`;
            const response = await apiClient.get<AccademicSessions[]>(url);

            // Your API client automatically handles the response structure
            return response.status && response.data ? response.data : [];
        } catch (error) {
            console.error('Failed to fetch academic sessions:', error);
            // The error is already transformed by your handleError method
            throw error as ApiError;
        }
    },

    // getNextSession: async () => {
    //     await new Promise(resolve => setTimeout(resolve, 300));
    //     return {
    //         academicYear: '2024/2025',
    //         semester: 'First Semester'
    //     };
    // },
    getCurrentSession: async (): Promise<AccademicSessions> => {
        const allAcademicSessions = await academicsServices.getAcademicSessions();
        if (!allAcademicSessions || allAcademicSessions.length === 0) {
            throw new Error('No current academic session found');
        }
        const currentSession = allAcademicSessions.filter((item) => item.status === "ACTIVE")[0]; // Get the first active session
        return currentSession
    },
    getCurrentSemester: async (): Promise<AccademicSemesters> => {
        try {
            const response = await apiClient.get<AccademicSemesters[]>('/academic-semester');
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to get current  session');
            }
            const currentSemester: AccademicSemesters = response.data.filter((item: AccademicSemesters) => item.status === "ACTIVE")[0];
            return currentSemester
        } catch (error) {
            console.error('Failed to load current semester:', error);
            throw error as ApiError;
        }
    },
}