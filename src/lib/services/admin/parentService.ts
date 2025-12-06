import { ApiError, PaginationParams, ApiResponse } from "@/types/auth";
import { apiClient } from "@/core/client";
import { dummyParentsData } from "@/lib/dummy-data";

export interface Parent {
  id: number;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  phone: string;
  role: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  is_active: number;
  email_verified: number;
  phone_verified: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  meta?: any;
  children?: number[];
}

export interface CreateParentPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  children: number[];
}

export interface ParentFilterParams extends PaginationParams {
  search?: string;
  status?: string;
}

export const parentService = {
  // Get all parents
  getAllParents: async (): Promise<Parent[]> => {
    try {
      // const response = await apiClient.get<any>('/account/allparents'); ///parents/get-all-parents
      // console.log('response', response)
      // return response.data || [];
      return dummyParentsData
    } catch (error) {
      console.error('Failed to fetch all parents:', error);
      return [];
    }
  },

  // Get parents with filtering and pagination
  getParents: async (params?: ParentFilterParams): Promise<ApiResponse<Parent[]>> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.set('search', params.search);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('per_page', params.perPage.toString());
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const url = `/admin/parents${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<any>(url);

      return {
        data: response.data || [],
        message: response.message || 'Success',
        status: 200
      };
    } catch (error: any) {
      console.error('Failed to fetch filtered parents:', error);
      return {
        data: [],
        message: 'No parents found',
        status: 200
      };
    }
  },

  // Create a new parent with children
  createParent: async (payload: CreateParentPayload): Promise<ApiResponse<Parent>> => {
    try {
      const response = await apiClient.post<any>('/admin/parent/create', payload);
      return response;
    } catch (error) {
      console.error('Failed to create parent:', error);
      throw error as ApiError;
    }
  },

  // Delete a parent
  deleteParent: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<any>(`/admin/delete-user/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete parent:', error);
      throw error as ApiError;
    }
  }
};