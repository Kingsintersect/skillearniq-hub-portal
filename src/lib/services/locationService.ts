import { ApiError } from "@/types/auth";
import { apiClient } from "./client";

export interface LocationItem {
    id: number;
    name: string;
}

export const locationService = {
    async fetchCountries(): Promise<LocationItem[]> {
        try {
            const response = await apiClient.put<LocationItem[]>(`/countries`);
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to load country data');
            }
            return response.data;
        } catch (error) {
            console.error(`Failed to get countires:`, error);
            throw error as ApiError;
        }
    },

    async fetchStates(): Promise<LocationItem[]> {
        try {
            const response = await apiClient.get<LocationItem[]>(`/admin/state/all-states`);

            if (!response.status || !response.data) {
                throw new Error('Failed to load state data');
            }

            return response.data;
        } catch (error: any) {
            console.error("Failed to get state data:", error?.response?.data || error.message || error);
            throw new Error(error?.response?.data?.message || "Unable to fetch states");
        }
    },

    async fetchAllLocalGovAreas(): Promise<LocationItem[]> {
        try {
            const response = await apiClient.get<LocationItem[]>(`/admin/lga/all-lga`);
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to get local gov. area data');
            }
            return response.data;
        } catch (error) {
            console.error(`Failed to get local gov. area data:`, error);
            throw error as ApiError;
        }
    },

    async fetchLocalGovAreasInState(stateId: number): Promise<LocationItem[]> {
        try {
            const response = await apiClient.get<LocationItem[]>(`/admin/lga/all-lga?state_id=${stateId}`);
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to get local gov. area in a state data');
            }
            return response.data;
        } catch (error) {
            console.error(`Failed to get local gov. area in a state data:`, error);
            throw error as ApiError;
        }
    },

    async fetchSingleLocalGovArea(lgaId: number): Promise<LocationItem[]> {
        try {
            const response = await apiClient.get<LocationItem[]>(`/admin/lga/all-lga?state_id=${lgaId}`);
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to get all local gov. area data');
            }
            return response.data;
        } catch (error) {
            console.error(`Failed to get all local gov. area data:`, error);
            throw error as ApiError;
        }
    },
};
