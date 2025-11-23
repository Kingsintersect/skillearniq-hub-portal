import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  studentService, 
  Student, 
  CreateStudentPayload, 
  StudentFilterParams 
} from '@/lib/services/admin/studentService';
import { toast } from 'sonner';

export const useStudentQueries = () => {
  const queryClient = useQueryClient();

  // Get all students (for exports, etc.)
  const useAllStudents = () => {
    return useQuery({
      queryKey: ['all-students'],
      queryFn: async () => {
        try {
          const students = await studentService.getAllStudents();
          console.log('🎯 Students in hook:', students);
          console.log('🎯 Number of students in hook:', students.length);
          return students || []; // Ensure we always return an array
        } catch (error) {
          console.error('❌ Error in students hook:', error);
          // Return empty array instead of throwing to prevent UI errors
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });
  };

  // Get students with filtering
  const useStudents = (params?: StudentFilterParams) => {
    return useQuery({
      queryKey: ['students', params],
      queryFn: async () => {
        try {
          const response = await studentService.getStudents(params);
          console.log('🎯 Filtered students in hook:', response.data);
          console.log('🎯 Number of filtered students in hook:', response.data.length);
          return response;
        } catch (error) {
          console.error('❌ Error in filtered students hook:', error);
          // Return empty response structure
          return {
            data: [],
            message: 'No students found',
            status: 200
          };
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Create student mutation
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

  // Update student status mutation
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

  // Delete student mutation
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

  // Bulk upload mutation
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

  return {
    useAllStudents,
    useStudents,
    useCreateStudent,
    useUpdateStudentStatus,
    useDeleteStudent,
    useBulkUploadStudents,
  };
};