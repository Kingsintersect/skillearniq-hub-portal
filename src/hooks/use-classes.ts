import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { classService } from '@/lib/services/classService';
import { Class, ClassStudent } from '@/types';

export const useTeacherClasses = (teacherId: number, filters?: { academicYear?: string; term?: string }) => {
  return useQuery({
    queryKey: ['teacher-classes', teacherId, filters],
    queryFn: () => classService.getTeacherClasses(teacherId, filters),
  });
};

export const useClassStudents = (classId: number) => {
  return useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => classService.getClassStudents(classId),
    enabled: !!classId,
  });
};

export const useAcademicYears = (teacherId: number) => {
  return useQuery({
    queryKey: ['academic-years', teacherId],
    queryFn: () => classService.getAcademicYears(teacherId),
  });
};

export const useClassStudentsInfinite = (classId: number, search?: string) => {
  return useInfiniteQuery({
    queryKey: ['class-students-infinite', classId, search],
    queryFn: ({ pageParam = 1 }) => 
      classService.getClassStudentsPaginated(classId, pageParam, 10, search),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!classId,
  });
};

export const useClassAssessments = (classId: number) => {
  return useQuery({
    queryKey: ['class-assessments', classId],
    queryFn: () => classService.getClassAssessments(classId),
    enabled: !!classId,
  });
};

export const useStudentPerformance = (classId: number) => {
  return useQuery({
    queryKey: ['student-performance', classId],
    queryFn: () => classService.getStudentPerformance(classId),
    enabled: !!classId,
  });
};

export const useExportClassData = () => {
  return useMutation({
    mutationFn: ({ classId, format }: { classId: number; format: 'csv' | 'pdf' }) =>
      classService.exportClassData(classId, format),
  });
};