import { Category, Course } from '@/lib/services/teacher/category-service';
import { create } from 'zustand';

interface CategoryState {
    // State
    parentCategories: Category[]; // All parent categories
    subCategories: Category[]; // Subcategories of selected parent
    selectedParentId: number | null;
    selectedSubcategoryId: number | null;
    courses: Course[];
    isLoading: boolean;
    isCoursesLoading: boolean;
    error: string | null;
    view: 'grid' | 'list';

    // Actions
    setParentCategories: (categories: Category[]) => void;
    setSubCategories: (categories: Category[]) => void;
    setSelectedParentId: (id: number | null) => void;
    setSelectedSubcategoryId: (id: number | null) => void;
    setCourses: (courses: Course[]) => void;
    setLoading: (loading: boolean) => void;
    setCoursesLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setView: (view: 'grid' | 'list') => void;
    reset: () => void;
}

const initialState = {
    parentCategories: [],
    subCategories: [],
    selectedParentId: null,
    selectedSubcategoryId: null,
    courses: [],
    isLoading: false,
    isCoursesLoading: false,
    error: null,
    view: 'grid' as const,
};

export const useCategoryStore = create<CategoryState>((set) => ({
    ...initialState,

    setParentCategories: (parentCategories) => set({ parentCategories }),
    setSubCategories: (subCategories) => set({ subCategories }),
    setSelectedParentId: (selectedParentId) => set({
        selectedParentId,
        selectedSubcategoryId: null, // Reset subcategory when parent changes
        subCategories: [], // Clear subcategories when parent changes
        courses: [], // Clear courses when parent changes
    }),
    setSelectedSubcategoryId: (selectedSubcategoryId) => set({ selectedSubcategoryId }),
    setCourses: (courses) => set({ courses }),
    setLoading: (isLoading) => set({ isLoading }),
    setCoursesLoading: (isCoursesLoading) => set({ isCoursesLoading }),
    setError: (error) => set({ error }),
    setView: (view) => set({ view }),
    reset: () => set(initialState),
}));