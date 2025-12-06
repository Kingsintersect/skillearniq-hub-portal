import { generateMockGradeData } from '@/lib/dummy-grade-data';
import { Student } from '@/types/grades';
// import { generateMockGradeData } from './mockData';

export async function fetchGradeData(courseId: string): Promise<Student[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would make an actual API call:
    // const response = await fetch(`/api/grades/${courseId}`);
    // if (!response.ok) throw new Error('Failed to fetch grade data');
    // return response.json();

    // For demo purposes, return mock data
    return generateMockGradeData(courseId);
}

export async function fetchCourseCategories() {
    // Simulate API call for course categories
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
        { id: 'science', name: 'Science' },
        { id: 'mathematics', name: 'Mathematics' },
        { id: 'humanities', name: 'Humanities' },
        { id: 'technology', name: 'Technology' },
        { id: 'business', name: 'Business' },
    ];
}