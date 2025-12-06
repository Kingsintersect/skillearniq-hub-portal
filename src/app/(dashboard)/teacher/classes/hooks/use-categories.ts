import { useEffect } from 'react';
import { useCategoryStore } from '../store/category-store';
import { categoryService } from '@/lib/services/teacher/category-service';

export const useCategories = () => {
    const {
        // State
        parentCategories,
        subCategories,
        selectedParentId,
        selectedSubcategoryId,
        courses,
        isLoading,
        isCoursesLoading,
        error,
        view,

        // Actions
        setParentCategories,
        setSubCategories,
        setSelectedParentId,
        setSelectedSubcategoryId,
        setCourses,
        setLoading,
        setCoursesLoading,
        setError,
        setView,
    } = useCategoryStore();

    // Fetch all categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await categoryService.getCategories();

                // All categories from API are parent categories
                setParentCategories(data);

                // console.log('Fetched parent categories:', data); // Debug
            } catch (err) {
                setError('Failed to fetch categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [setParentCategories, setLoading, setError]);

    // When a parent category is selected, load its subcategories
    useEffect(() => {
        if (!selectedParentId) {
            setSubCategories([]);
            return;
        }

        const loadSubcategories = () => {
            // Find the selected parent category
            const selectedParent = parentCategories.find(cat => cat.id === selectedParentId);

            if (selectedParent?.children) {
                // If parent has children, set them as subcategories
                setSubCategories(selectedParent.children);
                // console.log('Loaded subcategories:', selectedParent.children); // Debug
            } else {
                // If parent has no children, clear subcategories
                setSubCategories([]);
            }
        };

        loadSubcategories();
    }, [selectedParentId, parentCategories, setSubCategories]);

    // Fetch courses when subcategory is selected
    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedSubcategoryId) {
                setCourses([]);
                return;
            }

            try {
                setCoursesLoading(true);
                setError(null);
                const data = await categoryService.getCoursesBySubcategory(selectedSubcategoryId);
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
    }, [selectedSubcategoryId, setCourses, setCoursesLoading, setError]);

    // Check if selected parent has children
    const selectedParentHasChildren = subCategories.length > 0;

    return {
        // State
        parentCategories: parentCategories || [],
        subCategories: subCategories || [],
        selectedParentId,
        selectedSubcategoryId,
        selectedParentHasChildren,
        courses: courses || [],
        isLoading,
        isCoursesLoading,
        error,
        view,

        // Actions
        selectParentCategory: (id: number | null) => {
            setSelectedParentId(id);
        },
        selectSubcategory: setSelectedSubcategoryId,
        setView,
    };
};