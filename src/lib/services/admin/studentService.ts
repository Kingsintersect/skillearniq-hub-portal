import { ApiError, PaginationParams, ApiResponse } from "@/types/auth";
import { apiClient } from "../client";

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
  // Additional fields from the nested structure
  admission_no?: string;
  enrollment_status?: string;
  registration_date?: string;
  user_id?: number;
  current_class_id?: number | null;
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

export interface StudentsResponse {
  message: string;
  data: Student[];
}

// Helper function to extract students from different response structures
const extractStudentsFromResponse = (response: any): Student[] => {
  let students: Student[] = [];

  if (!response || typeof response !== 'object') {
    return students;
  }

  // Case 1: Simple structure from /account/allstudents - { message: "success", data: [...] }
  if (response.message === 'success' && Array.isArray(response.data)) {
    console.log('📊 Extracting from simple success structure');
    students = response.data;
  }
  // Case 2: Nested structure from /admin/get-students - { data: [{ user: {...}, admission_no: "...", ... }] }
  else if (Array.isArray(response.data)) {
    console.log('📊 Extracting from nested structure with user objects');
    students = response.data.map((item: any) => {
      if (item.user) {
        // Merge user data with student record data
        return {
          ...item.user,
          admission_no: item.admission_no,
          enrollment_status: item.enrollment_status,
          registration_date: item.registration_date,
          user_id: item.user_id,
          current_class_id: item.current_class_id,
          id: item.user.id // Use user id as the main id
        };
      }
      return item;
    }).filter(Boolean);
  }
  // Case 3: Direct array response
  else if (Array.isArray(response)) {
    console.log('📊 Extracting from direct array');
    students = response;
  }

  console.log(`📊 Extracted ${students.length} students`);
  return students;
};

export const studentService = {
  // Get all students - uses /account/allstudents (simple structure)
  getAllStudents: async (): Promise<Student[]> => {
    try {
      console.log('📡 Fetching all students from /account/allstudents...');
      
      const response = await apiClient.get<any>('/account/allstudents');
      console.log('✅ Raw API Response from /account/allstudents:', response);

      const students = extractStudentsFromResponse(response);
      
      console.log(`🎯 Final students from /account/allstudents: ${students.length}`);
      return students;
    } catch (error: any) {
      console.error('❌ Failed to fetch all students:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.statusCode,
        data: error.data
      });
      return [];
    }
  },

  // Get students with filtering - uses /admin/get-students (nested structure)
  getStudents: async (params?: StudentFilterParams): Promise<ApiResponse<Student[]>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.is_active !== undefined) queryParams.set('is_active', params.is_active.toString());
      if (params?.search) queryParams.set('search', params.search);
      if (params?.role) queryParams.set('role', params.role);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('perPage', params.perPage.toString());
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const url = `/admin/get-students${queryParams.toString() ? `?${queryParams}` : ''}`;
      console.log('📡 Fetching filtered students from:', url);
      
      const response = await apiClient.get<any>(url);
      console.log('✅ Filtered students API Response from /admin/get-students:', response);

      const students = extractStudentsFromResponse(response);

      console.log(`📊 Filtered students count: ${students.length}`);
      if (students.length > 0) {
        console.log('📊 Sample filtered student structure:', students[0]);
      }

      return {
        data: students,
        message: response?.message || 'Success',
        status: 200
      };
    } catch (error: any) {
      console.error('❌ Failed to fetch filtered students:', error);
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
      console.log('📡 Creating student with payload:', payload);
      const response = await apiClient.post<Student>('/admin/create-student', payload);
      return response;
    } catch (error) {
      console.error('❌ Failed to create student:', error);
      throw error as ApiError;
    }
  },

  // Update student status
  updateStudentStatus: async (id: number, is_active: number): Promise<ApiResponse<Student>> => {
    try {
      const response = await apiClient.patch<Student>(`/admin/students/${id}/status`, { is_active });
      return response;
    } catch (error) {
      console.error('❌ Failed to update student status:', error);
      throw error as ApiError;
    }
  },

  // Delete a student
  deleteStudent: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<void>(`/admin/students/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Failed to delete student:', error);
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
      console.error('❌ Failed to bulk upload students:', error);
      throw error as ApiError;
    }
  }
};