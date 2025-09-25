import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/lib/services/studentService';
import { Student, Attendance } from '@/types';

export const useStudents = (classId?: number) => {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: () => studentService.getStudents(classId),
    enabled: classId !== undefined,
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudent(id),
    enabled: !!id,
  });
};

export const useAttendance = (studentId: number, options?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['attendance', studentId, options],
    queryFn: () => studentService.getAttendance(studentId, options?.startDate, options?.endDate),
    enabled: !!studentId,
  });
};

export const useBulkStudentImport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, file }: { classId: number; file: File }) => 
      studentService.bulkImportStudents(classId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students', variables.classId] });
    },
  });
};