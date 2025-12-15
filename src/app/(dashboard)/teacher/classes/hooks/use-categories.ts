import { useEffect } from 'react';
import { useCategoryStore } from '../store/category-store';
import { categoryService } from '@/lib/services/teacher/category-service';

export const useCategories = () => {
    const {
        // State
        courses,
        isCoursesLoading,
        error,
        view,

        // Actions
        setCourses,
        setCoursesLoading,
        setError,
        setView,
    } = useCategoryStore();

    // Fetch courses when subcategory is selected
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                setError(null);
                const data = await categoryService.getCoursesBySubcategory();
                // console.log('Fetched courses for subcategory', selectedSubcategoryId, data); // Debug
                setCourses(data);
            } catch (err) {
                setError('Failed to fetch courses');
                console.error(err);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, [setCourses, setCoursesLoading, setError]);

    return {
        // State
        courses: courses || [],
        isCoursesLoading,
        error,
        view,

        // Actions
        setView,
    };
};
