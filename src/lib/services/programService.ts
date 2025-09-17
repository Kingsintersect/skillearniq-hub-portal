// import { GetAllProgram } from "@/api/program";
import { ApiError } from "@/types/auth";
import { apiClient } from "./client";

export interface ProgramItem {
    id: number;
    name: string;
    parent: number;
}

export interface ProgramApiRespinse {
    success: {
        data: ProgramItem[];
        message: string;
        status: boolean;
    };
}

export const programService = {
    fetchPrograms: async (): Promise<ProgramItem[]> => {
        try {
            const response = await apiClient.get<ProgramItem[]>(`/application/login`);
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to create session');
            }
            return response.data;
        } catch (error) {
            console.error('Failed to Load accademic programs:', error);
            throw error as ApiError;
        }
    },

    getLmsPrograms: async (parent_id: string | number): Promise<ProgramItem[]> => {
        // const res = await GetAllProgram();
        // const res = await apiClient.get(`/odl/our-programs?parent_id=${parent_id}`);
        // return res?.data || [];
        const response = await fetch(`https://ubs-portal-api.qverselearning.org/api/v1/odl/our-programs?parent_id=${parent_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        const data = await response.json();
        return data;
    }
};
