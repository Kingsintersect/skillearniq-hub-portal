import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { teacherService } from '@/lib/services/admin/teacherService';
import { useTeacherStore } from '@/store/teacherStore';
import type { TeacherSubjectAssignment } from '@/store/teacherStore';

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
        setTeacherSubjects
    } = useTeacherStore();
    const queryClient = useQueryClient();

    // Fetch all necessary data on mount
    const fetchAllData = async () => {
        try {
            const [categoriesResponse, coursesResponse, subjectsResponse] = await Promise.all([
                teacherService.getCategories({ page: 1, perPage: 50 }),
                teacherService.getCourses({ page: 1, perPage: 50 }),
                teacherService.getTeacherSubjects(),
            ]);
            console.log("categoriesResponse", categoriesResponse)

            return {
                categories: categoriesResponse.data || [],
                courses: coursesResponse.data || [],
                teacherSubjects: subjectsResponse.data || [],
            };
        } catch (error) {
            console.error('Failed to fetch teacher data:', error);
            throw error;
        }
    };

    // Main query that fetches and stores all data
    const allDataQuery = useQuery({
        queryKey: teacherQueryKeys.all,
        queryFn: fetchAllData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Individual queries for specific needs
    const categoriesQuery = useQuery({
        queryKey: teacherQueryKeys.categories(),
        queryFn: () => teacherService.getCategories({ page: 1, perPage: 50 }),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
    });

    const coursesQuery = useQuery({
        queryKey: teacherQueryKeys.courses(),
        queryFn: () => teacherService.getCourses({ page: 1, perPage: 50 }),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
    });

    const teacherSubjectsQuery = useQuery({
        queryKey: teacherQueryKeys.teacherSubjects(),
        queryFn: () => teacherService.getTeacherSubjects(),
        enabled: !allDataQuery.data,
        staleTime: 5 * 60 * 1000,
    });

    // Use useEffect to handle side effects when data changes
    useEffect(() => {
        if (allDataQuery.data) {
            const { categories, courses, teacherSubjects } = allDataQuery.data;
            setCategories(categories);
            setCourses(courses);
            // Use the transformation method for teacher subjects
            transformAndSetTeacherSubjects(teacherSubjects as TeacherSubjectAssignment[]);
        }
    }, [
        allDataQuery.data,
        setCategories,
        setCourses,
        transformAndSetTeacherSubjects
    ]);

    useEffect(() => {
        if (categoriesQuery.data?.data && !allDataQuery.data) {
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
            // Use the transformation method for teacher subjects
            transformAndSetTeacherSubjects(
                teacherSubjectsQuery.data.data as TeacherSubjectAssignment[]
            );
        }
    }, [
        teacherSubjectsQuery.data,
        allDataQuery.data,
        transformAndSetTeacherSubjects
    ]);

    // Invalidate queries
    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: teacherQueryKeys.all });
    };

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: teacherQueryKeys.categories() });
    };

    const invalidateCourses = () => {
        queryClient.invalidateQueries({ queryKey: teacherQueryKeys.courses() });
    };

    const invalidateTeacherSubjects = () => {
        queryClient.invalidateQueries({ queryKey: teacherQueryKeys.teacherSubjects() });
    };

    return {
        // Queries
        allDataQuery,
        categoriesQuery,
        coursesQuery,
        teacherSubjectsQuery,

        // Invalidation methods
        invalidateAll,
        invalidateCategories,
        invalidateCourses,
        invalidateTeacherSubjects,

        // Loading states
        isLoading: allDataQuery.isLoading || categoriesQuery.isLoading ||
            coursesQuery.isLoading || teacherSubjectsQuery.isLoading,
        isError: allDataQuery.isError || categoriesQuery.isError ||
            coursesQuery.isError || teacherSubjectsQuery.isError,
        error: allDataQuery.error || categoriesQuery.error ||
            coursesQuery.error || teacherSubjectsQuery.error,
    };
};