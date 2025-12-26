// lib/services/admin/gradeService.ts
import { ApiResponse } from "@/types/auth";
import { apiClient } from "@/core/client";

export interface CourseCategory {
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

export interface CourseGradesResponse {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url: string;
  instructors: Instructor[];
  students: StudentGrade[];
}

export const gradeService = {
  // FIXED: getCourseCategories function
  getCourseCategories: async (): Promise<ApiResponse<CourseCategory[]>> => {
    try {
      const response = await apiClient.get<any>('/odl/categories');
      
      // Handle different response structures
      let categoriesData: CourseCategory[] = [];
      
      if (Array.isArray(response.data)) {
        // Direct array response
        categoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Nested data property
        categoriesData = response.data.data;
      } else if (response.data?.data) {
        // Single object response
        categoriesData = [response.data.data];
      }
      
      return {
        status: 200,
        message: 'Success',
        data: categoriesData
      };
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch categories',
        data: []
      };
    }
  },

  // FIXED: getCoursesByCategory function
  getCoursesByCategory: async (categoryId: number): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await apiClient.get<any>('/odl/courses');
      
      // Handle different response structures
      let coursesData: Course[] = [];
      
      if (Array.isArray(response.data)) {
        // Direct array response
        coursesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Nested data property
        coursesData = response.data.data;
      } else if (response.data?.data) {
        // Single object response
        coursesData = [response.data.data];
      }
      
      // Filter courses by category
      const filteredCourses = coursesData.filter((course: Course) => 
        Number(course.category) === Number(categoryId)
      );
      
      return {
        status: 200,
        message: 'Success',
        data: filteredCourses
      };
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch courses',
        data: []
      };
    }
  },

  // NEW: getAllCourses function
  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await apiClient.get<any>('/odl/courses');
      
      let coursesData: Course[] = [];
      
      if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (response.data?.data) {
        coursesData = [response.data.data];
      }
      
      return {
        status: 200,
        message: 'Success',
        data: coursesData
      };
    } catch (error: any) {
      console.error('Error fetching all courses:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch courses',
        data: []
      };
    }
  },

  // NEW: getSubCategories function
  getSubCategories: async (parentId: number): Promise<ApiResponse<CourseCategory[]>> => {
    try {
      const response = await apiClient.get<any>(`/odl/categories/${parentId}/subcategories`);
      
      let subCategoriesData: CourseCategory[] = [];
      
      if (Array.isArray(response.data)) {
        subCategoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        subCategoriesData = response.data.data;
      } else if (response.data?.data) {
        subCategoriesData = [response.data.data];
      }
      
      return {
        status: 200,
        message: 'Success',
        data: subCategoriesData
      };
    } catch (error: any) {
      console.error('Error fetching subcategories:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch subcategories',
        data: []
      };
    }
  },

  // FIXED: getCourseGrades function
  getCourseGrades: async (courseId: number): Promise<ApiResponse<CourseGradesResponse>> => {
    try {
      const response = await apiClient.get<any>(`/admin/course/course-gradings/${courseId}`);
      
      // Handle different response structures
      let courseData: any = {};
      
      if (response.data && typeof response.data === 'object') {
        if (response.data.data) {
          courseData = response.data.data;
        } else {
          courseData = response.data;
        }
      }
      
      const formattedData: CourseGradesResponse = {
        course_id: courseData.course_id || courseId,
        course_code: courseData.course_code || '',
        course_name: courseData.course_name || '',
        course_image_url: courseData.course_image_url || '',
        instructors: Array.isArray(courseData.instructors) ? courseData.instructors : [],
        students: Array.isArray(courseData.students) ? courseData.students : []
      };
      
      return {
        status: 200,
        message: 'Success',
        data: formattedData
      };
    } catch (error: any) {
      console.error('Error fetching course grades:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch course grades',
        data: {
          course_id: courseId,
          course_code: '',
          course_name: '',
          course_image_url: '',
          instructors: [],
          students: []
        }
      };
    }
  }
};