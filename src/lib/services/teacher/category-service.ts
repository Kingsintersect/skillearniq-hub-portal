import { apiClient } from '@/core/client';

export interface Category {
    id: number;
    name: string;
    children?: Category[];
}

export interface Course {
    id: number;
    name: string;
    shortName: string;
    description?: string;
    credits: number;
    subcategoryId?: number;
    parentCategoryId?: number;
}

class CategoryService {
    async getCategories(): Promise<Category[]> {
        const result = await apiClient.get<Category[]>('/odl/our-programs');
        return result as unknown as Category[];
    }

    async getCoursesBySubcategory(): Promise<Course[]> {
        const response = await apiClient.get<any[]>('/teacher/dashboard/classes');
        return response.data as unknown as Course[];
    }
}

export const categoryService = new CategoryService();