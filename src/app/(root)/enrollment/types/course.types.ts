// types/course.types.ts
export interface ApiCategory {
    id: number;
    name: string;
    parent: number;
    sortorder: number;
}

export interface ApiCourse {
    id: number;
    fullname: string;
    shortname: string;
    category: number;
    visible: number;
    startdate: number;
    summary: string;
}

// Base course interface with all required properties
export interface Course {
    id: string;
    title: string;
    description: string;
    // price: number;
    // duration: string;
    // level: 'beginner' | 'intermediate' | 'advanced';
    instructor: string;
    rating: number;
    studentsEnrolled: number;
    imageUrl: string;
    // API fields (optional)
    apiId?: number;
    shortname?: string;
    visible?: number;
    startdate?: number;
    summary?: string;
}

export interface SubCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    courseCount: number;
    courses: Course[];
    // API fields
    apiId?: number;
    parent?: number;
    sortorder?: number;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    subCategories: SubCategory[];
    // API fields
    apiId?: number;
    parent?: number;
    sortorder?: number;
}

export interface Enrollment {
    id: string;
    courseId: string;
    course: Course;
    enrolledAt: string;
    progress: number;
    completed: boolean;
}

export interface CourseState {
    categories: Category[];
    enrolledCourses: Enrollment[];
    selectedCategory: Category | null;
    selectedSubCategory: SubCategory | null;
    showAllCategories: boolean;
    isLoading: boolean;
    view: 'dashboard' | 'categories' | 'subcategories' | 'courses' | 'payment';
}

export interface CourseActions {
    setCategories: (categories: Category[]) => void;
    setEnrolledCourses: (enrollments: Enrollment[]) => void;
    selectCategory: (category: Category) => void;
    selectSubCategory: (subCategory: SubCategory) => void;
    toggleShowAllCategories: () => void;
    setLoading: (loading: boolean) => void;
    resetSelection: () => void;
    setView: (view: CourseState['view']) => void;
    enrollInCourse: (courseId: string) => void;
    clearCache: () => void;
}

export interface PaymentData {
    amount: number;
    authorizationUrl: string;
    credoReference: string;
    crn: string;
    debitAmount: number;
    fee: number;
    reference: string;
}