import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '@/lib/services/classService';
import { Class, Subject } from '@/types';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getClasses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClassMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: classService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useSubjects = (classId?: number) => {
  return useQuery({
    queryKey: ['subjects', classId],
    queryFn: () => classService.getSubjects(classId),
    enabled: !!classId,
  });
};