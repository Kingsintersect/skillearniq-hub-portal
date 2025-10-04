import { academicsServices } from "@/lib/services/academicsServices";
import { courseService } from "@/lib/services/courseServices";
import { useAuthContext } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";


export const useCurrentSession = () => {
    return useQuery({
        queryKey: ['academic-info-currentSession'],
        queryFn: academicsServices.getCurrentSession,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    });
};

export const useCurrentSemester = () => {
    return useQuery({
        queryKey: ['academic-info-currentSemester'],
        queryFn: academicsServices.getCurrentSemester,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    });
};

export const useCourseCategories = () => {
    return useQuery({
        queryKey: ['course-categories'],
        queryFn: async () => {
            const response = await courseService.getCourseCategories();
            return response.data; // Extract here
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    });
};

export const useCategoriesCourse = () => {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category');
    const { access_token } = useAuthContext()
    return useQuery({
        queryKey: ['categories-course', access_token],
        queryFn: async () => {
            const response = await courseService.getCourses();
            const filteredCourses = response.data.filter(course => Number(course.id) === Number(categoryId));
            return filteredCourses;
        },
        enabled: !!access_token,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    });
};
