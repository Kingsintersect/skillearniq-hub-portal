import { apiClient } from "./client";

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

export const courseService = {
    getCourseCategories: async () => await apiClient.get<CourseCategory[]>('/odl/categories'),

    getCourses: async () => await apiClient.get<CategoryCourse[]>('/student/courses'),

};