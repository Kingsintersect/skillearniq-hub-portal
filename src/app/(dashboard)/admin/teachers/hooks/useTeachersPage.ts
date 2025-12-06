// src/hooks/useTeachersPage.ts
import { useState, useCallback, useMemo } from 'react';
import { useTeacherStore } from '@/store/teacherStore';
import { useTeacherData } from './useTeacherData';
import { useCategoryHierarchy } from './useCategoryHierarchy';

export const useTeachersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'all',
        status: 'all',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
    });

    const categoryHierarchy = useCategoryHierarchy();
    const { allDataQuery, isLoading, isError, error } = useTeacherData();
    const store = useTeacherStore();

    // Use useMemo for stable references
    const categories = useMemo(() => store.categories, [store.categories]);
    const courses = useMemo(() => store.courses, [store.courses]);
    const teacherSubjects = useMemo(() => store.teacherSubjects, [store.teacherSubjects]);
    const flattenedCategories = useMemo(
        () => store.getFlattenedCategories(),
        [store.categories] // Only depend on categories, not the entire store
    );

    // Use stable callbacks
    const getCoursesForCategory = useCallback(
        (categoryId: number) => {
            const category = store.findCategoryById(categoryId);
            if (!category) return [];

            const allCategoryIds: number[] = [categoryId];

            const collectChildIds = (cat: typeof category) => {
                if (cat.children) {
                    cat.children.forEach(child => {
                        allCategoryIds.push(child.id);
                        collectChildIds(child);
                    });
                }
            };

            collectChildIds(category);

            return store.courses.filter(course =>
                allCategoryIds.includes(course.category)
            );
        },
        [store.courses, store.findCategoryById]
    );

    const getTeacherAssignedSubjects = useCallback(
        (teacherId: number) => {
            return store.getTeacherAssignedSubjects(teacherId);
        },
        [store.teacherSubjects, store.getTeacherAssignedSubjects]
    );

    // Memoize the entire return object for stability
    const pageData = useMemo(() => ({
        // State
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        pagination,
        setPagination,

        // Data
        categories,
        courses,
        teacherSubjects,
        flattenedCategories,

        // Category hierarchy
        topLevelCategories: categoryHierarchy.topLevelCategories,
        getSubcategories: categoryHierarchy.getSubcategories,
        getAllCategoryIds: categoryHierarchy.getAllCategoryIds,
        findCategoryById: categoryHierarchy.findCategoryById,
        isParentCategory: categoryHierarchy.isParentCategory,
        getParentCategory: categoryHierarchy.getParentCategory,

        // Store methods
        store,

        // Derived data methods
        getCoursesForCategory,
        getTeacherAssignedSubjects,

        // Query states
        isLoading,
        isError,
        error,
        refetch: allDataQuery.refetch,
    }), [
        searchTerm,
        filters,
        pagination,
        categories,
        courses,
        teacherSubjects,
        flattenedCategories,
        categoryHierarchy,
        store,
        getCoursesForCategory,
        getTeacherAssignedSubjects,
        isLoading,
        isError,
        error,
        allDataQuery.refetch,
    ]);

    return pageData;
};