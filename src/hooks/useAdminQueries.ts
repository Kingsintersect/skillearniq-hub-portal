// hooks/useAdminQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  teacherService, 
  Teacher, 
  CreateTeacherPayload, 
  UpdateTeacherPayload,
  AssignTeacherPayload,
  TeacherFilterParams,
  Category,
  Course
} from '@/lib/services/admin/teacherService';

import { 
  gradeService,
  CourseCategory,
  CourseGradesResponse
} from '@/lib/services/admin/gradeService';

import { 
  studentService, 
  Student, 
  CreateStudentPayload, 
  StudentFilterParams 
} from '@/lib/services/admin/studentService';
import { 
  parentService, 
  Parent, 
  CreateParentPayload, 
  ParentFilterParams 
} from '@/lib/services/admin/parentService';
import { 
  paymentService, 
 
  PaymentFilterParams 
} from '@/lib/services/admin/paymentService';
import { Payment, PaymentWithDetails } from '@/types/auth';
import { 
  dashboardService, 
  DashboardStats 
} from '@/lib/services/admin/dashboardService';
import { toast } from 'sonner';

export const useAdminQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['dashboard-stats'],
      queryFn: dashboardService.getDashboardStats,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Teachers - Fixed to accept parameters properly
  const useTeachers = (params?: TeacherFilterParams) => {
    return useQuery({
      queryKey: ['teachers', params],
      queryFn: () => teacherService.getTeachers(params),
      staleTime: 5 * 60 * 1000,
    });
  };

 // Grade Reports Queries
  const useCourseCategories = () => {
    return useQuery({
      queryKey: ['course-categories'],
      queryFn: () => gradeService.getCourseCategories(),
      staleTime: 10 * 60 * 1000,
    });
  };

  const useSubCategories = (parentId: number | null) => {
    return useQuery({
      queryKey: ['sub-categories', parentId],
      queryFn: () => {
        if (!parentId) return Promise.resolve({
          status: 400,
          message: 'Parent ID is required',
          data: []
        });
        return gradeService.getSubCategories(parentId);
      },
      enabled: !!parentId,
      staleTime: 10 * 60 * 1000,
    });
  };

  const useCoursesByCategory = (categoryId: number | null) => {
    return useQuery({
      queryKey: ['courses-by-category', categoryId],
      queryFn: () => {
        if (!categoryId) return Promise.resolve({
          status: 400,
          message: 'Category ID is required',
          data: []
        });
        return gradeService.getCoursesByCategory(categoryId);
      },
      enabled: !!categoryId,
      staleTime: 10 * 60 * 1000,
    });
  };

  const useAllCourses = () => {
    return useQuery({
      queryKey: ['all-courses'],
      queryFn: () => gradeService.getAllCourses(),
      staleTime: 10 * 60 * 1000,
    });
  };

  const useCourseGrades = (courseId: number | null) => {
    return useQuery({
      queryKey: ['course-grades', courseId],
      queryFn: () => {
        if (!courseId) return Promise.resolve({
          status: 400,
          message: 'Course ID is required',
          data: {
            course_id: 0,
            course_code: '',
            course_name: '',
            course_image_url: '',
            instructors: [],
            students: []
          }
        });
        return gradeService.getCourseGrades(courseId);
      },
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useAllTeachers = () => {
    return useQuery({
      queryKey: ['all-teachers'],
      queryFn: teacherService.getAllTeachers,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useTeacher = (id: number) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherService.getTeacher(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get teacher subjects
const useTeacherSubjects = () => {
  return useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: teacherService.getTeacherSubjects,
    staleTime: 5 * 60 * 1000,
  });
};

  // Categories - Fixed to accept parameters
  const useCategories = (params?: any) => {
    return useQuery({
      queryKey: ['categories', params],
      queryFn: () => teacherService.getCategories(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Courses - Fixed to accept parameters
  const useCourses = (params?: any) => {
    return useQuery({
      queryKey: ['courses', params],
      queryFn: () => teacherService.getCourses(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useCreateTeacher = () => {
    return useMutation({
      mutationFn: teacherService.createTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['all-teachers'] });
        toast.success('Teacher created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create teacher');
      },
    });
  };

  const useUpdateTeacher = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: UpdateTeacherPayload }) =>
        teacherService.updateTeacher(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['all-teachers'] });
        toast.success('Teacher updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update teacher');
      },
    });
  };

  const useAssignTeacher = () => {
    return useMutation({
      mutationFn: teacherService.assignTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        toast.success('Teacher assigned successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to assign teacher');
      },
    });
  };

  const useDeleteTeacher = () => {
    return useMutation({
      mutationFn: teacherService.deleteTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['all-teachers'] });
        toast.success('Teacher deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete teacher');
      },
    });
  };

  const useBulkUploadTeachers = () => {
    return useMutation({
      mutationFn: teacherService.bulkUploadTeachers,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['all-teachers'] });
        toast.success('Teachers uploaded successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to upload teachers');
      },
    });
  };

  // Students
  const useStudents = (params?: StudentFilterParams) => {
    return useQuery({
      queryKey: ['students', params],
      queryFn: () => studentService.getStudents(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useAllStudents = () => {
    return useQuery({
      queryKey: ['all-students'],
      queryFn: studentService.getAllStudents,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useCreateStudent = () => {
    return useMutation({
      mutationFn: studentService.createStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['all-students'] });
        toast.success('Student created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create student');
      },
    });
  };

  const useUpdateStudentStatus = () => {
    return useMutation({
      mutationFn: ({ id, is_active }: { id: number; is_active: number }) =>
        studentService.updateStudentStatus(id, is_active),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['all-students'] });
        toast.success('Student status updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update student status');
      },
    });
  };

  const useDeleteStudent = () => {
    return useMutation({
      mutationFn: studentService.deleteStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['all-students'] });
        toast.success('Student deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete student');
      },
    });
  };

  const useBulkUploadStudents = () => {
    return useMutation({
      mutationFn: studentService.bulkUploadStudents,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['all-students'] });
        toast.success('Students uploaded successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to upload students');
      },
    });
  };

  // Parents
  const useParents = (params?: ParentFilterParams) => {
    return useQuery({
      queryKey: ['parents', params],
      queryFn: () => parentService.getParents(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useAllParents = () => {
    return useQuery({
      queryKey: ['all-parents'],
      queryFn: parentService.getAllParents,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useCreateParent = () => {
    return useMutation({
      mutationFn: parentService.createParent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parents'] });
        queryClient.invalidateQueries({ queryKey: ['all-parents'] });
        toast.success('Parent created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create parent');
      },
    });
  };

  const useDeleteParent = () => {
    return useMutation({
      mutationFn: parentService.deleteParent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parents'] });
        queryClient.invalidateQueries({ queryKey: ['all-parents'] });
        toast.success('Parent deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete parent');
      },
    });
  };

  // Payments - Fixed to use the correct endpoint
  const usePayments = (params?: PaymentFilterParams) => {
    return useQuery({
      queryKey: ['payments', params],
      queryFn: () => paymentService.getAllPayments(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const usePaymentDetails = (params?: PaymentFilterParams) => {
    return useQuery({
      queryKey: ['payment-details', params],
      queryFn: () => paymentService.getPaymentsWithDetails(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // Dashboard
    useDashboardStats,
    
    // Teachers
    useTeachers,
    useTeacher,
    useTeacherSubjects,
    useAllTeachers,
    useCategories,
    useCourses,
    useCreateTeacher,
    useUpdateTeacher,
    useAssignTeacher,
    useDeleteTeacher,
    useBulkUploadTeachers,
    
    // Students
    useStudents,
    useAllStudents,
    useCreateStudent,
    useUpdateStudentStatus,
    useDeleteStudent,
    useBulkUploadStudents,
    
    // Parents
    useParents,
    useAllParents,
    useCreateParent,
    useDeleteParent,
    
    // Payments
    usePayments,
    usePaymentDetails,

     // Grade Reports
     useCourseCategories,
    useCoursesByCategory,
    useAllCourses,
    useCourseGrades,
    useSubCategories
  };
};