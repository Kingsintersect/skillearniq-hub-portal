import { useMemo } from 'react';
import { useTeacherStore } from '@/store/teacherStore';

export const useCategoryHierarchy = () => {
    const store = useTeacherStore();
    const { categories } = store;

    const safeCategories = Array.isArray(categories) ? categories : [];

    const topLevelCategories = useMemo(() => {
        return safeCategories.filter(cat =>
            !safeCategories.some(parent =>
                parent.children?.some(child => child.id === cat.id)
            )
        );
    }, [safeCategories]);

    const getSubcategories = useMemo(() =>
        (parentId: number) => {
            const parent = safeCategories.find(cat => cat.id === parentId);
            return parent?.children || [];
        },
        [safeCategories]
    );

    const getAllCategoryIds = useMemo(() =>
        (parentId: number): number[] => {
            const parent = safeCategories.find(cat => cat.id === parentId);
            if (!parent) return [parentId];

            const ids = [parentId];
            parent.children?.forEach(child => ids.push(child.id));
            return ids;
        },
        [safeCategories]
    );

    const findCategoryById = useMemo(() =>
        (id: number) => {
            const findRecursive = (cats: typeof safeCategories): typeof safeCategories[0] | undefined => {
                for (const cat of cats) {
                    if (cat.id === id) return cat;
                    if (cat.children) {
                        const found = findRecursive(cat.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };
            return findRecursive(safeCategories);
        },
        [safeCategories]
    );

    const isParentCategory = useMemo(() =>
        (categoryId: number): boolean => {
            const category = findCategoryById(categoryId);
            return Boolean(category?.children?.length);
        },
        [findCategoryById]
    );

    const getParentCategory = useMemo(() =>
        (subcategoryId: number) => {
            return safeCategories.find(cat =>
                cat.children?.some(child => child.id === subcategoryId)
            );
        },
        [safeCategories]
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
