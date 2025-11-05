import { create } from 'zustand';
import { CourseState, CourseActions, Category, SubCategory, Enrollment, Course } from '../types/course.types';

// Add new interface for enrolled categories
export interface EnrolledCategory {
    id: string;
    name: string;
    course_group_id: number;
    course_group: string;
    courseCount: number;
    enrolledAt: string;
    progress: number;
    completed: boolean;
}

type CourseStore = CourseState & CourseActions & {
    enrolledCategories: EnrolledCategory[];
    setEnrolledCategories: (categories: EnrolledCategory[]) => void;
    addEnrolledCategory: (category: Omit<EnrolledCategory, 'id' | 'enrolledAt' | 'progress' | 'completed'>) => void;
    updateEnrolledCategoryProgress: (categoryId: string, progress: number) => void;
    markEnrolledCategoryCompleted: (categoryId: string) => void;
    buildEnrolledCategoriesFromCourses: (enrollments: Enrollment[], existingCategories: EnrolledCategory[]) => EnrolledCategory[];
    unenrollFromCourse: (courseId: string, courseGroupId: number) => void;
};

export const useCourseStore = create<CourseStore>((set, get) => ({
    // Initial state
    categories: [],
    enrolledCourses: [],
    enrolledCategories: [],
    selectedCategory: null,
    selectedSubCategory: null,
    showAllCategories: false,
    isLoading: false,
    view: 'dashboard',

    // Actions
    setCategories: (categories: Category[]) => set({ categories }),

    setEnrolledCourses: (enrolledCourses: Enrollment[]) => {
        // When enrolled courses are set, also update enrolled categories
        const enrolledCategories = get().enrolledCategories;
        const updatedCategories = get().buildEnrolledCategoriesFromCourses(enrolledCourses, enrolledCategories);
        set({ enrolledCourses, enrolledCategories: updatedCategories });
    },

    setEnrolledCategories: (enrolledCategories: EnrolledCategory[]) => set({ enrolledCategories }),

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
        const { categories, enrolledCourses, enrolledCategories } = get();

        // Find the course in all categories
        let courseToEnroll: Course | undefined;

        // Search through all categories and subcategories to find the course
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

            const updatedEnrollments = [...enrolledCourses, newEnrollment];
            const updatedCategories = get().buildEnrolledCategoriesFromCourses(updatedEnrollments, enrolledCategories);

            set({
                enrolledCourses: updatedEnrollments,
                enrolledCategories: updatedCategories,
                view: 'dashboard'
            });
        }
    },

    unenrollFromCourse: (courseId: string, courseGroupId: number) => {
        const { enrolledCourses, enrolledCategories } = get();

        // Remove the course from enrolled courses
        const updatedEnrollments = enrolledCourses.filter(
            enrollment => enrollment.courseId !== courseId
        );

        // Update enrolled categories
        const updatedCategories = get().buildEnrolledCategoriesFromCourses(updatedEnrollments, enrolledCategories);

        set({
            enrolledCourses: updatedEnrollments,
            enrolledCategories: updatedCategories
        });
    },

    addEnrolledCategory: (categoryData: Omit<EnrolledCategory, 'id' | 'enrolledAt' | 'progress' | 'completed'>) => {
        const { enrolledCategories } = get();

        const newCategory: EnrolledCategory = {
            ...categoryData,
            id: `enrolled-cat-${Date.now()}`,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completed: false
        };

        // Check if category already exists
        const existingCategoryIndex = enrolledCategories.findIndex(
            cat => cat.course_group_id === categoryData.course_group_id
        );

        if (existingCategoryIndex === -1) {
            set({ enrolledCategories: [...enrolledCategories, newCategory] });
        }
    },

    updateEnrolledCategoryProgress: (categoryId: string, progress: number) => {
        const { enrolledCategories } = get();

        const updatedCategories = enrolledCategories.map(category =>
            category.id === categoryId
                ? {
                    ...category,
                    progress: Math.min(100, Math.max(0, progress)),
                    completed: progress >= 100
                }
                : category
        );

        set({ enrolledCategories: updatedCategories });
    },

    markEnrolledCategoryCompleted: (categoryId: string) => {
        const { enrolledCategories } = get();

        const updatedCategories = enrolledCategories.map(category =>
            category.id === categoryId
                ? { ...category, progress: 100, completed: true }
                : category
        );

        set({ enrolledCategories: updatedCategories });
    },

    // Helper method to build enrolled categories from courses
    buildEnrolledCategoriesFromCourses: (enrollments: Enrollment[], existingCategories: EnrolledCategory[]): EnrolledCategory[] => {
        // Group enrollments by course_group_id
        const enrollmentsByGroup = enrollments.reduce((acc, enrollment) => {
            const groupId = enrollment.course.course_group_id;
            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push(enrollment);
            return acc;
        }, {} as Record<number, Enrollment[]>);

        // Create or update enrolled categories
        const categoriesFromCourses = Object.entries(enrollmentsByGroup).map(([groupId, groupEnrollments]) => {
            const firstEnrollment = groupEnrollments[0];
            const courseCount = groupEnrollments.length;

            // Calculate average progress for the category
            const averageProgress = groupEnrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / courseCount;
            const allCompleted = groupEnrollments.every(enrollment => enrollment.completed);

            return {
                id: `enrolled-cat-${groupId}`,
                name: firstEnrollment.course.course_group,
                course_group_id: firstEnrollment.course.course_group_id,
                course_group: firstEnrollment.course.course_group,
                courseCount,
                enrolledAt: firstEnrollment.enrolledAt,
                progress: Math.round(averageProgress),
                completed: allCompleted
            };
        });

        // Merge with existing categories, preserving any that aren't in the current enrollments
        const existingCategoriesMap = new Map(existingCategories.map(cat => [cat.course_group_id, cat]));
        const newCategoriesMap = new Map(categoriesFromCourses.map(cat => [cat.course_group_id, cat]));

        // Combine both maps, preferring new data but keeping existing categories that aren't in new data
        const combinedCategories = [
            ...Array.from(existingCategoriesMap.entries())
                .filter(([groupId]) => !newCategoriesMap.has(groupId))
                .map(([, cat]) => cat),
            ...categoriesFromCourses
        ];

        return combinedCategories;
    },

    clearCache: () => {
        // Clear service cache to force fresh API calls
        if (typeof window !== 'undefined') {
            localStorage.removeItem('testEmptyState');
            // You can also call courseService.clearCache() if needed
            setTimeout(() => window.location.reload(), 100);
        }
    },
}));

