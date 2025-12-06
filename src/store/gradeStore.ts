import { create } from 'zustand';
import { GradeStore, Student } from '@/types/grades';
import { fetchGradeData } from '@/lib/services/admin/gradeServices';

const initialCategories = [
    { id: 'science', name: 'Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'humanities', name: 'Humanities' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
];

const initialCourses = {
    science: [
        { id: 'physics101', name: 'Physics 101', category: 'science' },
        { id: 'chemistry101', name: 'Chemistry 101', category: 'science' },
        { id: 'biology101', name: 'Biology 101', category: 'science' },
    ],
    mathematics: [
        { id: 'algebra101', name: 'Algebra 101', category: 'mathematics' },
        { id: 'calculus101', name: 'Calculus 101', category: 'mathematics' },
        { id: 'statistics101', name: 'Statistics 101', category: 'mathematics' },
    ],
    humanities: [
        { id: 'history101', name: 'History 101', category: 'humanities' },
        { id: 'literature101', name: 'Literature 101', category: 'humanities' },
        { id: 'philosophy101', name: 'Philosophy 101', category: 'humanities' },
    ],
    technology: [
        { id: 'cs101', name: 'Computer Science 101', category: 'technology' },
        { id: 'webdev101', name: 'Web Development 101', category: 'technology' },
        { id: 'datascience101', name: 'Data Science 101', category: 'technology' },
    ],
    business: [
        { id: 'marketing101', name: 'Marketing 101', category: 'business' },
        { id: 'finance101', name: 'Finance 101', category: 'business' },
        { id: 'management101', name: 'Management 101', category: 'business' },
    ],
};

export const useGradeStore = create<GradeStore>((set, get) => ({
    // Initial State
    courseCategories: initialCategories,
    courses: [],
    selectedCategory: '',
    selectedCourse: '',
    gradeData: [],
    isLoading: false,
    error: null,

    // Actions
    setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
        const courses = initialCourses[category as keyof typeof initialCourses] || [];
        set({ courses });

        // Reset selected course if it doesn't belong to the new category
        const currentCourse = get().selectedCourse;
        if (currentCourse && !courses.find(c => c.id === currentCourse)) {
            set({ selectedCourse: '' });
        }
    },

    setSelectedCourse: (course: string) => {
        set({ selectedCourse: course });
    },

    setGradeData: (data: Student[]) => {
        set({ gradeData: data });
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    fetchGradeData: async () => {
        const { selectedCourse } = get();

        if (!selectedCourse) {
            set({ error: 'Please select a course first' });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const data = await fetchGradeData(selectedCourse);
            set({ gradeData: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch grade data',
                isLoading: false
            });
        }
    },

    resetState: () => {
        set({
            selectedCategory: '',
            selectedCourse: '',
            courses: [],
            gradeData: [],
            error: null,
        });
    },
}));