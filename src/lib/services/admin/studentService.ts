// lib/services/admin/studentService.ts
import { ApiError, PaginationParams, ApiResponse } from "@/types/auth";
import { apiClient } from "@/core/client";

export interface Student {
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
  meta: any;
}

export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_phone_number: string;
}

export interface StudentFilterParams extends PaginationParams {
  is_active?: number;
  search?: string;
  role?: string;
}

export interface CourseGradesResponse {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url: string;
  instructors: Instructor[];
  students: StudentGrade[];
}

export interface Instructor {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface StudentActivity {
  activity_name: string;
  type: 'quiz' | 'assign' | 'exam' | 'other';
  grade: number;
  max_grade: number;
}

export interface StudentGrade {
  student_id: number;
  student_email: string;
  student_username: string;
  final_grade: number;
  letter_grade: string;
  quality_points: number;
  credit_load: number;
  activities: StudentActivity[];
}


export const studentService = {
  // Get all students (simple list)
  getAllStudents: async (): Promise<Student[]> => {
    try {
      const response = await apiClient.get<any>('/account/allstudents');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch all students:', error);
      return [];
    }
  },

  // Get students with filtering and pagination
  getStudents: async (params?: StudentFilterParams): Promise<ApiResponse<Student[]>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.is_active !== undefined) queryParams.set('is_active', params.is_active.toString());
      if (params?.search) queryParams.set('search', params.search);
      if (params?.role) queryParams.set('role', params.role);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('per_page', params.perPage.toString());
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const url = `/admin/get-students${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<any>(url);

      return {
        data: response.data || [],
        message: response.message || 'Success',
        status: 200
      };
    } catch (error: any) {
      console.error('Failed to fetch filtered students:', error);
      return {
        data: [],
        message: 'No students found',
        status: 200
      };
    }
  },

  // Create a new student
  createStudent: async (payload: CreateStudentPayload): Promise<ApiResponse<Student>> => {
    try {
      const response = await apiClient.post<any>('/admin/create-student', payload);
      return response;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error as ApiError;
    }
  },

  // Update student status
  updateStudentStatus: async (id: number, is_active: number): Promise<ApiResponse<Student>> => {
    try {
      const response = await apiClient.patch<any>(`/admin/students/${id}/status`, { is_active });
      return response;
    } catch (error) {
      console.error('Failed to update student status:', error);
      throw error as ApiError;
    }
  },

  // Delete a student
  deleteStudent: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<any>(`/admin/delete-user/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error as ApiError;
    }
  },

  // Bulk upload students
  bulkUploadStudents: async (file: File): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.upload<any>('/admin/students/bulk-upload', formData);
      return response;
    } catch (error) {
      console.error('Failed to bulk upload students:', error);
      throw error as ApiError;
    }
  }
};

