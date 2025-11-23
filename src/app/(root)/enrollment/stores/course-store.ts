import { create } from 'zustand';
import { CourseState, CourseActions, Category, SubCategory, Enrollment, Course, PaidCategory } from '../types/course.types';

type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>((set, get) => ({
    // Initial state
    categories: [],
    enrolledCourses: [],
    paidCategories: [],
    selectedCategory: null,
    selectedSubCategory: null,
    showAllCategories: false,
    isLoading: false,
    view: 'dashboard',

    // Actions
    setCategories: (categories: Category[]) => set({ categories }),
    setEnrolledCourses: (enrolledCourses: Enrollment[]) => set({ enrolledCourses }),
    setPaidCategories: (paidCategories: PaidCategory[]) => set({ paidCategories }),

    selectCategory: (category: Category) =>
        set({
            selectedCategory: category,
            selectedSubCategory: null,
            view: 'subcategories'
        }),

    selectSubCategory: (subCategory: SubCategory) =>
        set({
            selectedSubCategory: subCategory,
            view: 'courses'
        }),

    toggleShowAllCategories: () =>
        set((state) => ({
            showAllCategories: !state.showAllCategories,
            view: state.showAllCategories ? 'dashboard' : 'categories'
        })),

    setLoading: (isLoading: boolean) => set({ isLoading }),

    resetSelection: () =>
        set({
            selectedCategory: null,
            selectedSubCategory: null,
            view: 'dashboard'
        }),

    setView: (view: CourseState['view']) => set({ view }),

    enrollInCourse: (courseId: string) => {
        const { categories, enrolledCourses } = get();

        // Find the course in all categories
        let courseToEnroll: Course | undefined;

        categories.forEach(category => {
            category.subCategories.forEach(subCategory => {
                const course = subCategory.courses.find(c => c.id === courseId);
                if (course) {
                    courseToEnroll = course;
                }
            });
        });

        if (courseToEnroll && !enrolledCourses.find(e => e.courseId === courseId)) {
            const newEnrollment: Enrollment = {
                id: `enroll-${Date.now()}`,
                courseId: courseToEnroll.id,
                course: courseToEnroll,
                enrolledAt: new Date().toISOString(),
                progress: 0,
                completed: false
            };

            set({
                enrolledCourses: [...enrolledCourses, newEnrollment],
                view: 'dashboard'
            });
        }
    },

    unenrollFromCourse: (courseId: string, courseGroupId: number) => {
        const { enrolledCourses } = get();
        const updatedEnrollments = enrolledCourses.filter(
            enrollment => enrollment.courseId !== courseId
        );
        set({ enrolledCourses: updatedEnrollments });
    },

    clearCache: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('testEmptyState');
            setTimeout(() => window.location.reload(), 100);
        }
    },
}));
