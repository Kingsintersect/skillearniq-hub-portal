import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentGroup, teacherService } from '@/lib/services/teacherService';
import { toast } from 'sonner';

export const useTeacherQueries = () => {
  const queryClient = useQueryClient();

  // Dashboard
  const useDashboardData = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'dashboard', teacherId],
      queryFn: () => teacherService.getDashboardData(teacherId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Classes
  const useClasses = (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'classes', teacherId, filters],
      queryFn: () => teacherService.getClasses(teacherId, filters),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Assessments
  const useAssessments = (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
    type?: string;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'assessments', teacherId, filters],
      queryFn: () => teacherService.getAssessments(teacherId, filters),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Attendance
  const useAttendance = (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'attendance', teacherId, filters],
      queryFn: () => teacherService.getAttendance(teacherId, filters),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Students
  const useStudents = (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
  }) => {
    return useQuery({
      queryKey: ['teacher', 'students', teacherId, filters],
      queryFn: () => teacherService.getStudents(teacherId, filters),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Messages
  const useMessages = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'messages', teacherId],
      queryFn: () => teacherService.getMessages(teacherId),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Academic Years
  const useAcademicYears = (teacherId: number) => {
    return useQuery({
      queryKey: ['teacher', 'academic-years', teacherId],
      queryFn: () => teacherService.getAcademicYears(teacherId),
      staleTime: 60 * 60 * 1000, // 1 hour
    });
  };

  // Mutations
  const useCreateAssessment = () => {
    return useMutation({
      mutationFn: teacherService.createAssessment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] });
        toast.success('Assessment created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create assessment');
      }
    });
  };

  const useUpdateAssessment = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) => 
        teacherService.updateAssessment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        toast.success('Assessment updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update assessment');
      }
    });
  };

  const useDeleteAssessment = () => {
    return useMutation({
      mutationFn: teacherService.deleteAssessment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['teacher', 'assessments'] });
        queryClient.invalidateQueries({ queryKey: ['teacher', 'dashboard'] });
        toast.success('Assessment deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete assessment');
      }
    });
  };

  // Groups
const useGroups = (teacherId: number, classId?: number) => {
  return useQuery({
    queryKey: ['teacher', 'groups', teacherId, classId],
    queryFn: () => teacherService.getGroups(teacherId, classId),
    staleTime: 10 * 60 * 1000,
  });
};

// Group Mutations
const useCreateGroup = () => {
  return useMutation({
    mutationFn: teacherService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
      toast.success('Group created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create group');
    }
  });
};

const useUpdateGroup = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StudentGroup> }) => 
      teacherService.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
      toast.success('Group updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update group');
    }
  });
};

const useDeleteGroup = () => {
  return useMutation({
    mutationFn: teacherService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
      toast.success('Group deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete group');
    }
  });
};

const useAddStudentToGroup = () => {
  return useMutation({
    mutationFn: teacherService.addStudentToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
      toast.success('Student added to group');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add student to group');
    }
  });
};

const useRemoveStudentFromGroup = () => {
  return useMutation({
    mutationFn: teacherService.removeStudentFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'groups'] });
      toast.success('Student removed from group');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove student from group');
    }
  });
};

  return {
    // Queries
    useDashboardData,
    useClasses,
    useAssessments,
    useAttendance,
    useStudents,
    useMessages,
    useAcademicYears,
     useGroups,
  
  
 
    
    // Mutations
    useCreateAssessment,
    useUpdateAssessment,
    useDeleteAssessment,
     useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useAddStudentToGroup,
  useRemoveStudentFromGroup,
  };
};