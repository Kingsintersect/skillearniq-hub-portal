import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examService } from '@/lib/services/examService';

export const useExams = (classId?: number) => {
  return useQuery({
    queryKey: ['exams', classId],
    queryFn: () => examService.getExams(classId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExam = (id: number) => {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => examService.getExam(id),
    enabled: !!id,
  });
};

export const useExamMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examService.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

export const useExamSession = (examId: number) => {
  return useQuery({
    queryKey: ['exam-session', examId],
    queryFn: () => examService.startExam(examId),
    enabled: !!examId,
  });
};