'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/lib/services/assignmentService';
import { Assignment, Grade } from '@/types';

export const useAssignments = (filters?: { classId?: number; subjectId?: number; teacherId?: number }) => {
  return useQuery({
    queryKey: ['assignments', filters],
    queryFn: () => assignmentService.getAssignments(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAssignment = (id: number) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignment(id),
    enabled: !!id,
  });
};

export const useAssignmentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useGrades = (assignmentId: number) => {
  return useQuery({
    queryKey: ['grades', assignmentId],
    queryFn: () => assignmentService.getGrades(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useGradeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assignmentService.submitGrade,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grades', variables.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['student-performance'] });
    },
  });
};

export const useBulkGradeUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: number; file: File }) => 
      assignmentService.bulkUploadGrades(assignmentId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grades', variables.assignmentId] });
    },
  });
};