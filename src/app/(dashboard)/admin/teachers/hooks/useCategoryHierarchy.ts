// src/hooks/useCategoryHierarchy.ts
import { useMemo } from 'react';
import { useTeacherStore } from '@/store/teacherStore';

export const useCategoryHierarchy = () => {
    const store = useTeacherStore();

    // Use a stable reference to categories
    const { categories } = store;

    // Memoize all computations to prevent unnecessary re-renders
    const topLevelCategories = useMemo(() => {
        return categories.filter(cat =>
            !categories.some(parent =>
                parent.children?.some(child => child.id === cat.id)
            )
        );
    }, [categories]);

    const getSubcategories = useMemo(() =>
        (parentId: number) => {
            const parent = categories.find(cat => cat.id === parentId);
            return parent?.children || [];
        },
        [categories]
    );

    const getAllCategoryIds = useMemo(() =>
        (parentId: number): number[] => {
            const parent = categories.find(cat => cat.id === parentId);
            if (!parent) return [parentId];

            const ids = [parentId];
            if (parent.children) {
                parent.children.forEach(child => {
                    ids.push(child.id);
                });
            }
            return ids;
        },
        [categories]
    );

    const findCategoryById = useMemo(() =>
        (id: number) => {
            const findRecursive = (cats: typeof categories): typeof categories[0] | undefined => {
                for (const cat of cats) {
                    if (cat.id === id) return cat;
                    if (cat.children) {
                        const found = findRecursive(cat.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };
            return findRecursive(categories);
        },
        [categories]
    );

    const isParentCategory = useMemo(() =>
        (categoryId: number): boolean => {
            const category = findCategoryById(categoryId);
            return Boolean(category?.children && category.children.length > 0);
        },
        [findCategoryById]
    );

    const getParentCategory = useMemo(() =>
        (subcategoryId: number) => {
            return categories.find(cat =>
                cat.children?.some(child => child.id === subcategoryId)
            );
        },
        [categories]
    );

    return {
        topLevelCategories,
        getSubcategories,
        getAllCategoryIds,
        findCategoryById,
        isParentCategory,
        getParentCategory,
    };
};