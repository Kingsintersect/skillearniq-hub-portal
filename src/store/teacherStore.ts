import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    name: string;
    email: string;
  };
}

// Store Type
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
    email?: string;
    full_name?: string;
  };
}

interface TeacherStore {
  categories: Category[];
  courses: Course[];
  teacherSubjects: TeacherSubject[];
  teachers: any[];

  // Actions
  setCategories: (categories: Category[]) => void;
  setCourses: (courses: Course[]) => void;
  setTeacherSubjects: (subjects: TeacherSubject[]) => void;
  setTeachers: (teachers: any[]) => void;

  // Transformation method
  transformAndSetTeacherSubjects: (
    assignments: TeacherSubjectAssignment[],
  ) => void;

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
  assignment: TeacherSubjectAssignment,
): TeacherSubject => {
  // Parse name into first_name and last_name
  const teacherName = assignment.teacher.name || "";
  const nameParts = teacherName.split(" ");
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";

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
      teachers: [],

      setCategories: (categories) => set({ categories }),
      setCourses: (courses) => set({ courses }),
      setTeacherSubjects: (teacherSubjects) => set({ teacherSubjects }),
      setTeachers: (teachers) => set({ teachers }),

      transformAndSetTeacherSubjects: (
        assignments: TeacherSubjectAssignment[],
      ) => {
        const transformed = assignments.map(transformTeacherSubjectAssignment);
        set({ teacherSubjects: transformed });
      },

      getTopLevelCategories: () => {
        const { categories } = get();
        // Ensure categories is an array
        if (!Array.isArray(categories)) return [];
        
        return categories.filter(
          (cat) =>
            !categories.some((parent) =>
              parent.children?.some((child) => child.id === cat.id),
            ),
        );
      },

      getFlattenedCategories: () => {
        const { categories } = get();
        // Ensure categories is an array
        if (!Array.isArray(categories)) return [];
        
        const flattened: Category[] = [];

        const flatten = (cats: Category[]) => {
          // Ensure cats is an array
          if (!Array.isArray(cats)) return;
          
          cats.forEach((cat) => {
            flattened.push(cat);
            if (cat.children && Array.isArray(cat.children)) {
              flatten(cat.children);
            }
          });
        };

        flatten(categories);
        return flattened;
      },

      getCoursesByCategoryId: (categoryId: number) => {
        const { courses } = get();
        // Ensure courses is an array
        if (!Array.isArray(courses)) return [];
        return courses.filter((course) => course.category === categoryId);
      },

      getTeacherAssignedSubjects: (teacherId: number) => {
        const { teacherSubjects } = get();
        // Ensure teacherSubjects is an array
        if (!Array.isArray(teacherSubjects)) return [];
        return teacherSubjects.filter(
          (subject) => subject.teacher.id === teacherId,
        );
      },

      findCategoryById: (id: number) => {
        const { categories } = get();
        // Ensure categories is an array
        if (!Array.isArray(categories)) return undefined;

        const findRecursive = (cats: Category[]): Category | undefined => {
          // Ensure cats is an array
          if (!Array.isArray(cats)) return undefined;
          
          for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children && Array.isArray(cat.children)) {
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
        // Ensure courses is an array
        if (!Array.isArray(courses)) return undefined;
        return courses.find((course) => course.id === id);
      },
    }),
    {
      name: "teacher-store",
      partialize: (state) => ({
        categories: state.categories,
        courses: state.courses,
        teacherSubjects: state.teacherSubjects,
        teachers: state.teachers,
      }),
    },
  ),
);