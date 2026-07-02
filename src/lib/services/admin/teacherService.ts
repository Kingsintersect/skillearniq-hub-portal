import { ApiError, PaginationParams, ApiResponse } from "@/types/auth";
import { apiClient } from "@/core/client";

export interface Category {
  id: number;
  name: string;
  parent: number;
  sortorder: number;
  children?: Category[]; // Add children for hierarchy
}

export interface Course {
  id: number;
  fullname: string;
  shortname: string;
  category: number;
  visible: number;
  startdate: number;
  summary: string;
}

export interface Teacher {
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
  teacher?: {
    id: number;
    user_id: number;
    employee_no: string;
    hire_date: string;
    subjects: string[];
    meta: any;
    created_at: string;
    updated_at: string;
  };
}

export interface TeacherSubjectAssignment {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateTeacherPayload {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  teacher: {
    employee_no: string;
    hire_date: string;
    subjects: string[];
  };
}

export interface UpdateTeacherPayload {
  email_verified?: number;
  meta?: string[];
  teacher?: {
    subjects?: string[];
  };
}

export interface AssignTeacherPayload {
  class_group_id: number;
  subject_id: number;
  teacher_id: number;
  start_date: string;
  end_date: string;
  meta?: {
    semester?: string;
    room?: string;
  };
}

export interface TeacherFilterParams extends PaginationParams {
  id?: number;
  employee_no?: string;
  search?: string;
  category?: string;
  status?: string;
}

export const teacherService = {
  // Get all categories with pagination - FIXED
  getCategories: async (params?: PaginationParams): Promise<ApiResponse<Category[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('per_page', params.perPage.toString());

      const url = `/odl/our-programs${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<any>(url);
      
      console.log('📡 Categories API URL:', url);
      console.log('📡 Categories Raw Response:', response);
      console.log('📡 Categories Response Data:', response.data);
      
      // Handle different response structures
      let categoriesData: Category[] = [];
      
      // Case 1: response.data is an array directly
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } 
      // Case 2: response.data has a data property that is an array
      else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } 
      // Case 3: response.data has a data property that is an object with categories
      else if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
        categoriesData = response.data.data.categories;
      }
      // Case 4: response.data is an object with categories property
      else if (response.data?.categories && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      }
      // Case 5: Try to extract from response.data if it's an object but not in expected format
      else if (response.data && typeof response.data === 'object') {
        // Try to find any array property that might contain categories
        for (const key in response.data) {
          if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
            // Check if the first item has id and name properties (likely a category)
            if (response.data[key][0]?.id && response.data[key][0]?.name) {
              categoriesData = response.data[key];
              console.log(`📡 Found categories in property "${key}":`, categoriesData);
              break;
            }
          }
        }
      }
      
      console.log('✅ Processed categories:', categoriesData);
      console.log('✅ Is categories an array?', Array.isArray(categoriesData));
      console.log('✅ Categories count:', categoriesData.length);
      
      return {
        data: categoriesData,
        message: 'Success',
        status: 200,
        meta: response.meta
      };
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      throw error as ApiError;
    }
  },

  // Get all courses with pagination
  getCourses: async (params?: PaginationParams): Promise<ApiResponse<Course[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('per_page', params.perPage.toString());

      const url = `/odl/courses${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<any>(url);
      
      console.log('📡 Courses API Response:', response);
      
      let coursesData: Course[] = [];
      
      if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (response.data?.data) {
        coursesData = [response.data.data];
      }
      
      console.log('✅ Processed courses:', coursesData);

      return {
        data: coursesData,
        message: 'Success',
        status: 200,
        meta: response.meta
      };
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw error as ApiError;
    }
  },

  // Get all teachers (simple list)
  getAllTeachers: async (): Promise<Teacher[]> => {
    try {
      const response = await apiClient.get<any>('/account/allteachers');
      console.log('📡 Teachers API Response:', response);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch all teachers:', error);
      throw error as ApiError;
    }
  },

  // Get teachers with filtering and pagination
  getTeachers: async (params?: TeacherFilterParams): Promise<ApiResponse<Teacher[]>> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.id) queryParams.set('id', params.id.toString());
      if (params?.employee_no) queryParams.set('employee_no', params.employee_no);
      if (params?.search) queryParams.set('search', params.search);
      if (params?.category) queryParams.set('category', params.category);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('per_page', params.perPage.toString());
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const url = `/admin/teacher${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<any>(url);

      return {
        data: response.data || [],
        message: response.message || 'Success',
        status: 200
      };
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      throw error as ApiError;
    }
  },

  getTeacher: async (id: number): Promise<ApiResponse<Teacher>> => {
    try {
      const response = await apiClient.get<any>(`/admin/teacher?id=${id}`);
      return {
        data: response.data?.[0] || null,
        message: response.message || 'Success',
        status: 200
      };
    } catch (error) {
      console.error('Failed to fetch teacher:', error);
      throw error as ApiError;
    }
  },

  // Get teacher subjects assignments
  getTeacherSubjects: async (): Promise<ApiResponse<TeacherSubjectAssignment[]>> => {
    try {
      const response = await apiClient.get<any>('/admin/teacher/subjects');
      console.log('📡 Teacher Subjects API Response:', response);
      
      let subjectsData: TeacherSubjectAssignment[] = [];
      
      if (Array.isArray(response.data)) {
        subjectsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        subjectsData = response.data.data;
      } else if (response.data?.data) {
        subjectsData = [response.data.data];
      }
      
      return {
        data: subjectsData,
        message: response.message || 'Success',
        status: 200,
        meta: { count: subjectsData.length }
      };
    } catch (error) {
      console.error('Failed to fetch teacher subjects:', error);
      throw error as ApiError;
    }
  },
  
  // Create a new teacher
  createTeacher: async (payload: CreateTeacherPayload): Promise<ApiResponse<Teacher>> => {
    try {
      const response = await apiClient.post<any>('/admin/teacher', payload);
      return response;
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error as ApiError;
    }
  },

  // Update a teacher - PUT request as specified
  updateTeacher: async (id: number, payload: UpdateTeacherPayload): Promise<ApiResponse<Teacher>> => {
    try {
      const response = await apiClient.put<any>(`/admin/users/${id}`, payload);
      return response;
    } catch (error) {
      console.error('Failed to update teacher:', error);
      throw error as ApiError;
    }
  },

  // Assign teacher to course
  assignTeacher: async (payload: AssignTeacherPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post<any>('/admin/teacher/subject-assignment', payload);
      return response;
    } catch (error) {
      console.error('Failed to assign teacher:', error);
      throw error as ApiError;
    }
  },

  // Delete a teacher
  deleteTeacher: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<any>(`/admin/delete-user/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      throw error as ApiError;
    }
  },

  // Bulk upload teachers
  bulkUploadTeachers: async (file: File): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.upload<any>('/admin/teacher/bulk-upload', formData);
      return response;
    } catch (error) {
      console.error('Failed to bulk upload teachers:', error);
      throw error as ApiError;
    }
  }
};