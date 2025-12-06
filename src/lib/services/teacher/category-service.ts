import { apiClient } from '@/core/client';

export interface Category {
    id: number;
    name: string;
    children?: Category[];
}

export interface Course {
    id: number;
    name: string;
    code: string;
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

    async getCoursesBySubcategory(subcategoryId: number): Promise<Course[]> {
        const response = await apiClient.get<Course[]>('/teacher/my-tutor-assigned-courses', {
            params: { subcategoryId }
        });
        return response as unknown as Course[];
    }

    async getCoursesByParentCategory(parentId: number): Promise<Course[]> {
        const response = await apiClient.get<Course[]>('/teacher/my-tutor-assigned-courses', {
            params: { parentCategoryId: parentId }
        });
        return response as unknown as Course[];
    }
}

export const categoryService = new CategoryService();