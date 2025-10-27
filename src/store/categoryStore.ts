import { create } from 'zustand';
import { Category, ApiResponse, CategoryStore } from '../types/category';

const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    categoryTree: [],
    parentCategories: [],
    isLoading: false,
    error: null,

    fetchCategories: async (): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch('http://prep-school.qverselearning.org/api/v1/odl/categories');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiData: ApiResponse = await response.json();
            const categories = apiData.data;

            // Build category tree recursively
            const buildCategoryTree = (parentId: number = 0): Category[] => {
                return categories
                    .filter((category: Category) => category.parent === parentId)
                    .sort((a: Category, b: Category) => a.sortorder - b.sortorder)
                    .map((category: Category) => ({
                        ...category,
                        children: buildCategoryTree(category.id)
                    }));
            };

            const categoryTree = buildCategoryTree();
            const parentCategories = categories.filter((cat: Category) => cat.parent === 0);

            set({
                categories,
                categoryTree,
                parentCategories,
                isLoading: false,
                error: null
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
            set({
                isLoading: false,
                error: errorMessage,
                categories: [],
                categoryTree: [],
                parentCategories: []
            });
        }
    },

    getChildren: (parentId: number): Category[] => {
        const { categories } = get();
        return categories
            .filter((cat: Category) => cat.parent === parentId)
            .sort((a: Category, b: Category) => a.sortorder - b.sortorder);
    },

    getCategoryById: (id: number): Category | undefined => {
        const { categories } = get();
        return categories.find((cat: Category) => cat.id === id);
    },

    getAllDescendants: (parentId: number): Category[] => {
        const { categories } = get();
        const descendants: Category[] = [];

        const findDescendants = (id: number): void => {
            const children = categories.filter((cat: Category) => cat.parent === id);
            descendants.push(...children);
            children.forEach((child: Category) => findDescendants(child.id));
        };

        findDescendants(parentId);
        return descendants;
    },

    clearCategories: (): void => {
        set({
            categories: [],
            categoryTree: [],
            parentCategories: [],
            error: null
        });
    }
}));

export default useCategoryStore;