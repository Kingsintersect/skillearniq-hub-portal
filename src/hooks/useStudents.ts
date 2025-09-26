import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/lib/services/studentService';
import { Student, Enrollment, StudentGroup } from '@/types';

export const useStudentEnrollments = (filters?: { academicYear?: string; term?: string; classId?: number }) => {
  return useQuery({
    queryKey: ['student-enrollments', filters],
    queryFn: () => studentService.getStudentEnrollments(filters),
  });
};

export const useGroups = (classId?: number) => {
  return useQuery({
    queryKey: ['groups', classId],
    queryFn: () => studentService.getGroups(classId!),
    enabled: !!classId,
  });
};

export const useGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useGroupUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, updates }: { groupId: number; updates: Partial<StudentGroup> }) =>
      studentService.updateGroup(groupId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useGroupDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useGroupStudentManagement = () => {
  const queryClient = useQueryClient();
  
  const addStudent = useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: number; studentId: number }) =>
      studentService.addStudentToGroup(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const removeStudent = useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: number; studentId: number }) =>
      studentService.removeStudentFromGroup(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  return { addStudent, removeStudent };
};