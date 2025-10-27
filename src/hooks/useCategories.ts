import { useEffect } from 'react';
import useCategoryStore from '../store/categoryStore';

export const useCategories = () => {
    const {
        categories,
        categoryTree,
        parentCategories,
        isLoading,
        error,
        fetchCategories,
        getChildren,
        getCategoryById,
        getAllDescendants,
        clearCategories
    } = useCategoryStore();

    // Auto-fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        categoryTree,
        parentCategories,
        isLoading,
        error,
        fetchCategories,
        getChildren,
        getCategoryById,
        getAllDescendants,
        clearCategories
    };
};