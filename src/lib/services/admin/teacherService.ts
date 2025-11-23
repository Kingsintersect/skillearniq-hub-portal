import { ApiError, PaginationParams, ApiResponse } from "@/types/auth";
import { apiClient } from "../client";

export interface Category {
  id: number;
  name: string;
  parent: number;
  sortorder: number;
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

export interface CategoriesResponse {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CoursesResponse {
  current_page: number;
  data: Course[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Teacher {
  id: number;
  teacherId: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subjects: string[];
  categories: string[];
  status: 'active' | 'inactive';
  employmentDate?: string;
  employee_no?: string;
  email_verified?: number;
  meta?: string[];
  hire_date?: string;
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
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      console.log('Fetching categories from API...');
      const response = await apiClient.get<any>('/odl/categories');
      console.log('Raw Categories API Response:', response);
      
      let categoriesData: Category[] = [];
      
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
          console.log('Extracted categories from response.data.data');
        }
        else if (Array.isArray(response.data)) {
          categoriesData = response.data;
          console.log('Extracted categories from response.data');
        }
      }
      else if (Array.isArray(response.data)) {
        categoriesData = response.data;
        console.log('Extracted categories from direct array response');
      }
      
      console.log('Final extracted categories:', categoriesData);
      return categoriesData;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    try {
      console.log('Fetching courses from API...');
      const response = await apiClient.get<any>('/odl/courses');
      console.log('Raw Courses API Response:', response);
      
      let coursesData: Course[] = [];
      
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          coursesData = response.data.data;
          console.log('Extracted courses from response.data.data');
        }
        else if (Array.isArray(response.data)) {
          coursesData = response.data;
          console.log('Extracted courses from response.data');
        }
      }
      else if (Array.isArray(response.data)) {
        coursesData = response.data;
        console.log('Extracted courses from direct array response');
      }
      
      console.log('Final extracted courses:', coursesData);
      return coursesData;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }
  },

  // Get all teachers
  getAllTeachers: async (): Promise<Teacher[]> => {
    try {
      const response = await apiClient.get<Teacher[]>('/account/allteachers');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch all teachers:', error);
      throw error as ApiError;
    }
  },

  // Get teachers with filtering - FIXED: Proper search implementation
  getTeachers: async (params?: TeacherFilterParams): Promise<ApiResponse<Teacher[]>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.id) queryParams.set('id', params.id.toString());
      if (params?.employee_no) queryParams.set('employee_no', params.employee_no);
      if (params?.search) queryParams.set('search', params.search);
      if (params?.category) queryParams.set('category', params.category);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('perPage', params.perPage.toString());
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const url = `/admin/teacher${queryParams.toString() ? `?${queryParams}` : ''}`;
      console.log('Fetching teachers from:', url);
      console.log('Search params:', params);
      
      const response = await apiClient.get<Teacher[]>(url);
      console.log('Teachers search response:', response);
      
      return response;
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      throw error as ApiError;
    }
  },

  // Create a new teacher
  createTeacher: async (payload: CreateTeacherPayload): Promise<ApiResponse<Teacher>> => {
    try {
      const response = await apiClient.post<Teacher>('/admin/teacher', payload);
      return response;
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error as ApiError;
    }
  },

  // Update a teacher
  updateTeacher: async (id: number, payload: UpdateTeacherPayload): Promise<ApiResponse<Teacher>> => {
    try {
      const response = await apiClient.patch<Teacher>(`/admin/users/${id}`, payload);
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
      console.log('Assign teacher response:', response);
      return response;
    } catch (error) {
      console.error('Failed to assign teacher:', error);
      throw error as ApiError;
    }
  },

  // Delete a teacher
  deleteTeacher: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<void>(`/admin/teacher/${id}`);
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