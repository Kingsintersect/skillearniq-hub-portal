// admin/teachers/hooks/useTeacherData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { teacherService } from '@/lib/services/admin/teacherService';
import { useTeacherStore, type TeacherSubjectAssignment } from '@/store/teacherStore';

export const teacherQueryKeys = {
    all: ['teachers'] as const,
    categories: () => [...teacherQueryKeys.all, 'categories'] as const,
    courses: () => [...teacherQueryKeys.all, 'courses'] as const,
    teacherSubjects: () => [...teacherQueryKeys.all, 'subjects'] as const,
    teachers: (filters?: any) => [...teacherQueryKeys.all, 'list', filters] as const,
};

export const useTeacherData = () => {
    const {
        setCategories,
        setCourses,
        transformAndSetTeacherSubjects,
        setTeachers,
    } = useTeacherStore();
    const queryClient = useQueryClient();

    // Fetch all necessary data on mount
    const fetchAllData = async () => {
        try {
            console.log('🔄 Fetching all teacher data...');
            
            const [categoriesResponse, coursesResponse, subjectsResponse, teachersResponse] = await Promise.all([
                teacherService.getCategories({ page: 1, perPage: 50 }),
                teacherService.getCourses({ page: 1, perPage: 50 }),
                teacherService.getTeacherSubjects(),
                teacherService.getAllTeachers(),
            ]);
            
            console.log('📊 Categories Response:', categoriesResponse);
            console.log('📊 Categories data:', categoriesResponse?.data);
            console.log('📊 Is categories data an array?', Array.isArray(categoriesResponse?.data));
            
            return {
                categories: categoriesResponse?.data || [],
                courses: coursesResponse?.data || [],
                teacherSubjects: subjectsResponse?.data || [],
                teachers: teachersResponse || [],
            };
        } catch (error) {
            console.error('❌ Failed to fetch teacher data:', error);
            throw error;
        }
    };

    // Main query that fetches and stores all data
    const allDataQuery = useQuery({
        queryKey: teacherQueryKeys.all,
        queryFn: fetchAllData,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    // Individual queries for specific needs
    const categoriesQuery = useQuery({
        queryKey: teacherQueryKeys.categories(),
        queryFn: () => teacherService.getCategories({ page: 1, perPage: 50 }),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const coursesQuery = useQuery({
        queryKey: teacherQueryKeys.courses(),
        queryFn: () => teacherService.getCourses({ page: 1, perPage: 50 }),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const teacherSubjectsQuery = useQuery({
        queryKey: teacherQueryKeys.teacherSubjects(),
        queryFn: () => teacherService.getTeacherSubjects(),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    // Store data when loaded
    useEffect(() => {
        if (allDataQuery.data) {
            const { categories, courses, teacherSubjects, teachers } = allDataQuery.data;
            
            console.log('💾 Storing categories:', categories);
            console.log('💾 Is categories an array?', Array.isArray(categories));
            
            setCategories(categories);
            setCourses(courses);
            setTeachers(teachers || []);
            
            if (teacherSubjects && teacherSubjects.length > 0) {
                transformAndSetTeacherSubjects(teacherSubjects as TeacherSubjectAssignment[]);
            }
        }
    }, [allDataQuery.data, setCategories, setCourses, setTeachers, transformAndSetTeacherSubjects]);

    // Fallback: Store data from individual queries
    useEffect(() => {
        if (categoriesQuery.data?.data && !allDataQuery.data) {
            console.log('💾 Storing categories from individual query:', categoriesQuery.data.data);
            setCategories(categoriesQuery.data.data);
        }
    }, [categoriesQuery.data, allDataQuery.data, setCategories]);

    useEffect(() => {
        if (coursesQuery.data?.data && !allDataQuery.data) {
            setCourses(coursesQuery.data.data);
        }
    }, [coursesQuery.data, allDataQuery.data, setCourses]);

    useEffect(() => {
        if (teacherSubjectsQuery.data?.data && !allDataQuery.data) {
            if (teacherSubjectsQuery.data.data.length > 0) {
                transformAndSetTeacherSubjects(
                    teacherSubjectsQuery.data.data as TeacherSubjectAssignment[]
                );
            }
        }
    }, [teacherSubjectsQuery.data, allDataQuery.data, transformAndSetTeacherSubjects]);

    return {
        allDataQuery,
        categoriesQuery,
        coursesQuery,
        teacherSubjectsQuery,
        invalidateAll: () => queryClient.invalidateQueries({ queryKey: teacherQueryKeys.all }),
        invalidateCategories: () => queryClient.invalidateQueries({ queryKey: teacherQueryKeys.categories() }),
        invalidateCourses: () => queryClient.invalidateQueries({ queryKey: teacherQueryKeys.courses() }),
        invalidateTeacherSubjects: () => queryClient.invalidateQueries({ queryKey: teacherQueryKeys.teacherSubjects() }),
        isLoading: allDataQuery.isLoading || categoriesQuery.isLoading ||
            coursesQuery.isLoading || teacherSubjectsQuery.isLoading,
        isError: allDataQuery.isError || categoriesQuery.isError ||
            coursesQuery.isError || teacherSubjectsQuery.isError,
        error: allDataQuery.error || categoriesQuery.error ||
            coursesQuery.error || teacherSubjectsQuery.error,
    };
};