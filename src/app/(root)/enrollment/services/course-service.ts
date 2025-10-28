// services/course-service.ts
import { Category, Enrollment, ApiCategory, ApiCourse, Course, SubCategory, PaymentData } from '../types/course.types';
import { mockCategories, mockEnrollments, mockEmptyEnrollments, mockCourses, mockSubCategories } from '../data/mock-data';
import { apiClient } from '@/core/client';
import { ApiError } from '@/types/auth';


export interface CourseCategory {
    id: number;
    name: string;
    parent: number;
    sortorder: string;
}

export interface CategoryCourse {
    id: number;
    category: string;
    sortorder: string;

    fullname: string,
    shortname: string,
    idnumber: string,
    summary: string,
}


class CourseService {
    // Cache for API data
    private apiCategoriesCache: ApiCategory[] | null = null;
    private apiCoursesCache: ApiCourse[] | null = null;

    // getCategories = async (): Promise<Category[]> => {
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     return mockCategories;
    // }

    getEnrollments = async (studentEmail: string): Promise<Enrollment[]> => {
        console.log('studentEmail', studentEmail)
        await new Promise(resolve => setTimeout(resolve, 800));
        // const result = await apiClient.get(`/admin/course/grading?student_email=${studentEmail}`)
        // console.log('result', result);

        // Check URL parameter for demo purposes
        const urlParams = new URLSearchParams(window.location.search);
        const emptyState = urlParams.get('empty') === 'true';

        if (emptyState || localStorage.getItem('testEmptyState') === 'true') {
            return mockEmptyEnrollments;
        }

        // return mockEnrollments;
        return [];
    }

    fetchApiCategories = async (): Promise<ApiCategory[]> => {
        if (this.apiCategoriesCache) return this.apiCategoriesCache;

        try {
            const results = await apiClient.get<ApiCategory[]>("/odl/categories");
            this.apiCategoriesCache = results.data;
            return this.apiCategoriesCache as ApiCategory[];
        } catch (error) {
            console.error('Failed to fetch categories from API:', error);
            return [];
        }
    }

    fetchApiCourses = async (): Promise<ApiCourse[]> => {
        if (this.apiCoursesCache) return this.apiCoursesCache;

        try {
            const results = await apiClient.get<ApiCourse[]>("/odl/courses");
            this.apiCoursesCache = results.data;
            return this.apiCoursesCache as ApiCourse[];
        } catch (error) {
            console.error('Failed to fetch courses from API:', error);
            return [];
        }
    }

    getMergedCategoriesWithCourses = async (): Promise<Category[]> => {
        try {
            // Fetch data from API only - we'll augment with mock data
            const [apiCategories, apiCourses] = await Promise.all([
                this.fetchApiCategories(),
                this.fetchApiCourses()
            ]);

            return this.buildAugmentedCategories(apiCategories, apiCourses);
        } catch (error) {
            console.error('Error in getMergedCategoriesWithCourses:', error);
            // Fallback to mock data if API calls fail
            return mockCategories;
        }
    }

    private buildAugmentedCategories = (
        apiCategories: ApiCategory[],
        apiCourses: ApiCourse[]
    ): Category[] => {
        // If API data is empty, return mock data as fallback
        if (apiCategories.length === 0 || apiCourses.length === 0) {
            console.warn('API data is empty, using mock data as fallback');
            // return mockCategories;
            return [];
        }

        // Filter out only visible courses (visible === 1) and exclude category 0
        const visibleApiCourses = apiCourses.filter(course => course.visible === 1 && course.category !== 0);

        // Build the category tree from API data
        const rootCategories = apiCategories.filter(cat => cat.parent === 0);
        const subCategories = apiCategories.filter(cat => cat.parent !== 0);

        // Map API categories to our enhanced Category structure
        return rootCategories.map(apiCategory => {
            // Find a mock category template to augment missing fields
            const mockCategoryTemplate = mockCategories.find(mockCat =>
                this.getCategoryType(apiCategory.id) === mockCat.id
            ) || mockCategories[0];

            // Get subcategories for this root category
            const categorySubCategories = subCategories.filter(sub => sub.parent === apiCategory.id);

            // Build enhanced subcategories
            const enhancedSubCategories = categorySubCategories.map(apiSubCategory => {
                // Find a mock subcategory template to augment missing fields
                const mockSubTemplate = mockSubCategories.find(mockSub =>
                    this.getSubCategoryType(apiSubCategory.id) === mockSub.id
                ) || mockSubCategories[0];

                // Get courses for this subcategory
                const subCategoryCourses = visibleApiCourses.filter(course => course.category === apiSubCategory.id);

                // Build enhanced courses
                const enhancedCourses = subCategoryCourses.map((apiCourse, index) => {
                    // Find a mock course template (cycle through available ones)
                    const mockCourseTemplate = mockCourses[index % mockCourses.length] || mockCourses[0];

                    return this.augmentCourse(apiCourse, mockCourseTemplate);
                });

                // Augment the subcategory with mock data for missing fields
                return this.augmentSubCategory(apiSubCategory, mockSubTemplate, enhancedCourses);
            });

            // Augment the category with mock data for missing fields
            return this.augmentCategory(apiCategory, mockCategoryTemplate, enhancedSubCategories);
        });
    }

    private getCategoryType = (apiCategoryId: number): string => {
        // Map API category IDs to mock category IDs
        const categoryMap: { [key: number]: string } = {
            1: 'cat-1', // JUNIOR SECONDARY -> Frontend Development
            2: 'cat-2', // SENIOR SECONDARY -> Backend & DevOps
        };
        return categoryMap[apiCategoryId] || 'cat-1';
    }

    private getSubCategoryType = (apiSubCategoryId: number): string => {
        // Map API subcategory IDs to mock subcategory IDs
        const subCategoryMap: { [key: number]: string } = {
            1: 'sub-1', // JUNIOR SECONDARY -> React
            8: 'sub-4', // SCIENCE STUDIES -> Node.js
            9: 'sub-5', // ART STUDIES -> Python & Data Science
            10: 'sub-6', // COMMERCIAL STUDIES -> DevOps
        };
        return subCategoryMap[apiSubCategoryId] || 'sub-1';
    }

    private augmentCategory = (
        apiCategory: ApiCategory,
        mockCategory: Category,
        subCategories: SubCategory[]
    ): Category => {
        return {
            id: `cat-${apiCategory.id}`,
            name: apiCategory.name,
            description: mockCategory.description, // Use mock description
            icon: mockCategory.icon, // Use mock icon
            color: mockCategory.color, // Use mock color
            subCategories: subCategories,
            // API fields
            apiId: apiCategory.id,
            parent: apiCategory.parent,
            sortorder: apiCategory.sortorder
        };
    }

    private augmentSubCategory = (
        apiSubCategory: ApiCategory,
        mockSubCategory: SubCategory,
        courses: Course[]
    ): SubCategory => {
        return {
            id: `sub-${apiSubCategory.id}`,
            name: apiSubCategory.name,
            description: mockSubCategory.description, // Use mock description
            icon: mockSubCategory.icon, // Use mock icon
            courseCount: courses.length,
            courses: courses,
            // API fields
            apiId: apiSubCategory.id,
            parent: apiSubCategory.parent,
            sortorder: apiSubCategory.sortorder
        };
    }

    private augmentCourse = (
        apiCourse: ApiCourse,
        mockCourse: Course
    ): Course => {
        return {
            id: `course-${apiCourse.id}`,
            title: apiCourse.fullname,
            description: apiCourse.summary || mockCourse.description, // Use API summary or mock description
            // price: mockCourse.price, // Use mock price
            // duration: mockCourse.duration, // Use mock duration
            // level: mockCourse.level, // Use mock level
            instructor: mockCourse.instructor, // Use mock instructor
            rating: mockCourse.rating, // Use mock rating
            studentsEnrolled: mockCourse.studentsEnrolled, // Use mock students count
            imageUrl: mockCourse.imageUrl, // Use mock image
            // API fields
            apiId: apiCourse.id,
            shortname: apiCourse.shortname,
            visible: apiCourse.visible,
            startdate: apiCourse.startdate,
            summary: apiCourse.summary
        };
    }

    // processPayment = async (courseId: string, paymentData: unknown): Promise<{ success: boolean; enrollmentId: string }> => {
    processPayment = async (courseId: string, paymentData: Record<string, unknown> | null): Promise<PaymentData> => {
        // // Simulate payment processing
        // await new Promise(resolve => setTimeout(resolve, 2000));

        // // Simulate successful payment
        // return {
        //     success: true,
        //     enrollmentId: `enroll-${Date.now()}`
        // };
        try {
            const response = await apiClient.post<PaymentData>('/student/enroll-course', {
                "department": "SKILLEARN",
                "course_id": courseId,
                "amount": paymentData?.amount,
            });

            if (response.status !== 200) {
                throw new Error(response.message || 'Failed to initialize payment');
            }

            if (!response.data) {
                throw new Error('No payment data received');
            }

            // Return just the payment data part
            return response.data;
        } catch (error) {
            console.error('error', error);
            throw error as ApiError;
        }
    }

    // Utility method to clear cache (useful for testing or force refresh)
    clearCache = (): void => {
        this.apiCategoriesCache = null;
        this.apiCoursesCache = null;
    }

    // Method to get cache status (useful for debugging)
    getCacheStatus = (): { categoriesCached: boolean; coursesCached: boolean } => {
        return {
            categoriesCached: this.apiCategoriesCache !== null,
            coursesCached: this.apiCoursesCache !== null
        };
    }
}

// Export a singleton instance
export const courseService = new CourseService();
