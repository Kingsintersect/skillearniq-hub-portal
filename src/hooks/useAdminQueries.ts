import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  teacherService, 
  Teacher, 
  CreateTeacherPayload, 
  AssignTeacherPayload, 
  TeacherFilterParams,
  Category,
  Course
} from '@/lib/services/admin/teacherService';
import { toast } from 'sonner';

export const useAdminQueries = () => {
  const queryClient = useQueryClient();

  // Get categories
  const useCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        try {
          const categories = await teacherService.getCategories();
          console.log('Categories in hook:', categories);
          return categories;
        } catch (error) {
          console.error('Error in categories hook:', error);
          return [];
        }
      },
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Get courses
  const useCourses = () => {
    return useQuery({
      queryKey: ['courses'],
      queryFn: async () => {
        try {
          const courses = await teacherService.getCourses();
          console.log('Courses in hook:', courses);
          return courses;
        } catch (error) {
          console.error('Error in courses hook:', error);
          return [];
        }
      },
      staleTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Get teachers with filtering
  const useTeachers = (params?: TeacherFilterParams) => {
    return useQuery({
      queryKey: ['teachers', params],
      queryFn: () => teacherService.getTeachers(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get all teachers (for exports, etc.)
  const useAllTeachers = () => {
    return useQuery({
      queryKey: ['all-teachers'],
      queryFn: teacherService.getAllTeachers,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Create teacher mutation
  const useCreateTeacher = () => {
    return useMutation({
      mutationFn: teacherService.createTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        toast.success('Teacher created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create teacher');
      },
    });
  };

  // Update teacher mutation
  const useUpdateTeacher = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: any }) => 
        teacherService.updateTeacher(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        toast.success('Teacher updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update teacher');
      },
    });
  };

  // Assign teacher mutation
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

  // Delete teacher mutation
  const useDeleteTeacher = () => {
    return useMutation({
      mutationFn: teacherService.deleteTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        toast.success('Teacher deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete teacher');
      },
    });
  };

  // Bulk upload mutation
  const useBulkUploadTeachers = () => {
    return useMutation({
      mutationFn: teacherService.bulkUploadTeachers,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        toast.success('Teachers uploaded successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to upload teachers');
      },
    });
  };

  return {
    useCategories,
    useCourses,
    useTeachers,
    useAllTeachers,
    useCreateTeacher,
    useUpdateTeacher,
    useAssignTeacher,
    useDeleteTeacher,
    useBulkUploadTeachers,
  };
};