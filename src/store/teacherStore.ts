import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
    id: number;
    name: string;
    children?: Category[];
}

export interface Course {
    id: number;
    fullname: string;
    shortname: string;
    category: number;
    visible: number;
    startdate: number;
    summary: string;
}

// API Response Type
export interface TeacherSubjectAssignment {
    id: number;
    subject: {
        id: number;
        name: string;
    };
    teacher: {
        id: number;
        name: string;      // From API
        email: string;     // From API
        first_name?: string; // Optional for transformation
        last_name?: string;  // Optional for transformation
    };
}

// Store Type (what we want to use internally)
export interface TeacherSubject {
    id: number;
    subject: {
        id: number;
        name: string;
    };
    teacher: {
        id: number;
        first_name: string;
        last_name: string;
        email?: string;    // Optional since we might not always have it
        full_name?: string; // For convenience
    };
}

interface TeacherStore {
    categories: Category[];
    courses: Course[];
    teacherSubjects: TeacherSubject[];

    // Actions
    setCategories: (categories: Category[]) => void;
    setCourses: (courses: Course[]) => void;
    setTeacherSubjects: (subjects: TeacherSubject[]) => void;

    // Transformation method
    transformAndSetTeacherSubjects: (assignments: TeacherSubjectAssignment[]) => void;

    // Getters
    getTopLevelCategories: () => Category[];
    getFlattenedCategories: () => Category[];
    getCoursesByCategoryId: (categoryId: number) => Course[];
    getTeacherAssignedSubjects: (teacherId: number) => TeacherSubject[];

    // Helpers
    findCategoryById: (id: number) => Category | undefined;
    findCourseById: (id: number) => Course | undefined;
}

// Helper function to transform API data to store format
const transformTeacherSubjectAssignment = (
    assignment: TeacherSubjectAssignment
): TeacherSubject => {
    // Parse name into first_name and last_name
    const teacherName = assignment.teacher.name || '';
    const nameParts = teacherName.split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    return {
        id: assignment.id,
        subject: assignment.subject,
        teacher: {
            id: assignment.teacher.id,
            first_name,
            last_name,
            email: assignment.teacher.email,
            full_name: teacherName,
        },
    };
};

export const useTeacherStore = create<TeacherStore>()(
    persist(
        (set, get) => ({
            categories: [],
            courses: [],
            teacherSubjects: [],

            setCategories: (categories) => set({ categories }),
            setCourses: (courses) => set({ courses }),
            setTeacherSubjects: (teacherSubjects) => set({ teacherSubjects }),

            transformAndSetTeacherSubjects: (assignments: TeacherSubjectAssignment[]) => {
                const transformed = assignments.map(transformTeacherSubjectAssignment);
                set({ teacherSubjects: transformed });
            },

            getTopLevelCategories: () => {
                const { categories } = get();
                return categories.filter(cat =>
                    !categories.some(parent =>
                        parent.children?.some(child => child.id === cat.id)
                    )
                );
            },

            getCategoriesByParentId: (parentId: number) => {
                const { categories } = get();
                const parent = categories.find(cat => cat.id === parentId);
                if (!parent) return [];

                const allCategories: Category[] = [parent];
                if (parent.children) {
                    allCategories.push(...parent.children);
                }
                return allCategories;
            },
            getFlattenedCategories: () => {
                const { categories } = get();
                const flattened: Category[] = [];

                const flatten = (cats: Category[]) => {
                    cats.forEach(cat => {
                        flattened.push(cat);
                        if (cat.children) {
                            flatten(cat.children);
                        }
                    });
                };

                flatten(categories);
                return flattened;
            },

            getCoursesByCategoryId: (categoryId: number) => {
                const { courses } = get();
                return courses.filter(course => course.category === categoryId);
            },

            getTeacherAssignedSubjects: (teacherId: number) => {
                const { teacherSubjects } = get();
                return teacherSubjects.filter(subject => subject.teacher.id === teacherId);
            },

            findCategoryById: (id: number) => {
                const { categories } = get();

                const findRecursive = (cats: Category[]): Category | undefined => {
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

            findCourseById: (id: number) => {
                const { courses } = get();
                return courses.find(course => course.id === id);
            },
        }),
        {
            name: 'teacher-store',
            partialize: (state) => ({
                categories: state.categories,
                courses: state.courses,
                teacherSubjects: state.teacherSubjects,
            }),
        }
    )
);