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
export interface VerifyPaymentResponse {
    transAmount: string;
    reference: string;
    transRef: string;
    processorFee: string;
    errorMessage: string;
    currency: string;
    gateway: string;
    status: string;
    message?: string;
    error?: [];
}

// Update EnrollmentApiResponse to match actual API structure
export interface EnrollmentApiResponse {
    status: string;
    message: string;
    user: EnrolledCourseUser;
    courses: Array<{
        course_id: number;
        course_name: string;
        short_name: string;
        course_group_id: number;
        course_group: string;
    }>;
}

// Simplify Enrollment interface - remove duplicate fields that are in Course
export interface Enrollment {
    id: string;
    courseId: string;
    course: Course;
    enrolledAt: string;
    progress: number;
    completed: boolean;
}

// Simplify Course interface - keep only the API fields that actually come from the response
export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    rating: number;
    studentsEnrolled: number;
    imageUrl: string;

    // API fields from enrollment response
    course_group: string;
    course_group_id: number;
    course_id: number;
    course_name: string;
    short_name: string;

    // Optional API fields from courses endpoint
    apiId?: number;
    shortname?: string;
    visible?: number;
    startdate?: number;
    summary?: string;
}

export interface EnrolledCourseUser {
    id: number;
    email: string;
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

export interface PaidCategory {
    course_group_id: number;
    course_group: string;
}

export interface CourseActions {
    setCategories: (categories: Category[]) => void;
    setEnrolledCourses: (enrollments: Enrollment[]) => void;
    setPaidCategories: (categories: PaidCategory[]) => void; // Updated
    selectCategory: (category: Category) => void;
    selectSubCategory: (subCategory: SubCategory) => void;
    toggleShowAllCategories: () => void;
    setLoading: (loading: boolean) => void;
    resetSelection: () => void;
    setView: (view: CourseState['view']) => void;
    enrollInCourse: (courseId: string) => void;
    unenrollFromCourse: (courseId: string, courseGroupId: number) => void; // Add this
    clearCache: () => void;
}

export interface CourseState {
    categories: Category[];
    enrolledCourses: Enrollment[];
    paidCategories: PaidCategory[]; // Updated
    selectedCategory: Category | null;
    selectedSubCategory: SubCategory | null;
    showAllCategories: boolean;
    isLoading: boolean;
    view: 'dashboard' | 'categories' | 'subcategories' | 'courses' | 'payment';
}