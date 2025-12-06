export interface Student {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    assignment: number;
    quiz: number;
    exam: number;
    total: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface Course {
    id: string;
    name: string;
    category: string;
}

export interface CourseCategory {
    id: string;
    name: string;
}

export interface GradeDistribution {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
}

export interface PerformanceSummary {
    excellent: number;
    good: number;
    average: number;
    belowAverage: number;
    fail: number;
}

export interface GradeStore {
    // State
    courseCategories: CourseCategory[];
    courses: Course[];
    selectedCategory: string;
    selectedCourse: string;
    gradeData: Student[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setSelectedCategory: (category: string) => void;
    setSelectedCourse: (course: string) => void;
    setGradeData: (data: Student[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    fetchGradeData: () => Promise<void>;
    resetState: () => void;
}