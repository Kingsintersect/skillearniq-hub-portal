// hooks/use-course-queries.ts
import { useQuery, useMutation, useQueryClient, queryOptions, UseQueryOptions } from '@tanstack/react-query';
import { courseService } from '../services/course-service';
import { useCourseStore } from '../stores/course-store';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Enrollment } from '../types/course.types';
import { createQuery } from '@/core/queryHooks';
import { useAuthContext } from '@/providers/AuthProvider';

export const useCourseQueries = (userId: string) => {
    const { setCategories, setEnrolledCourses, setLoading } = useCourseStore();
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    // Merged categories with courses query
    const mergedCategoriesQuery = getMergedCategoriesQuery();
    // Handle merged categories side effects
    useEffect(() => {
        if (mergedCategoriesQuery.data) {
            setCategories(mergedCategoriesQuery.data);
        }
    }, [mergedCategoriesQuery.data, setCategories]);

    // Enrollments query with useEffect for side effects
    const enrollmentsQuery = getStudentEnrollmentsQuery(user?.email, {
        enabled: !!user?.email
    });

    // Handle all side effects
    useEffect(() => {
        if (mergedCategoriesQuery.data) {
            setCategories(mergedCategoriesQuery.data);
        }
        if (enrollmentsQuery.data) {
            setEnrolledCourses(enrollmentsQuery.data);
        }
        // Update global loading state
        setLoading(mergedCategoriesQuery.isLoading || enrollmentsQuery.isLoading);
    }, [
        mergedCategoriesQuery.data,
        enrollmentsQuery.data,
        mergedCategoriesQuery.isLoading,
        enrollmentsQuery.isLoading,
        setCategories,
        setEnrolledCourses,
        setLoading
    ]);

    const reloadAllQueries = () => {
        mergedCategoriesQuery.refetch();
        enrollmentsQuery.refetch();
    }


    // Payment mutation
    const paymentMutation = useMutation({
        mutationFn: ({ courseId, paymentData }: { courseId: string; paymentData: Record<string, unknown> | null }) =>
            courseService.processPayment(courseId, paymentData),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            useCourseStore.getState().enrollInCourse(variables.courseId);
            // Invalidate enrollments to refresh data
            queryClient.invalidateQueries({
                queryKey: ['student-enrollments', userId]
            });
            // redirect to payment gatway
            if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
                toast.success('Redirecting to payment gateway...');
            }
        },
        onError: (error) => {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initialize payment');
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    return {
        mergedCategoriesQuery,
        reloadCategoriesAndCourses: reloadAllQueries,
        enrollmentsQuery,
        paymentMutation,
        isLoading: mergedCategoriesQuery.isLoading || enrollmentsQuery.isLoading,
        isFetching: mergedCategoriesQuery.isFetching || enrollmentsQuery.isFetching
    };
};

// UING THE GERIC QUERY TO IMPLEMENT USEQUERY FETCHING
const getStudentEnrollmentsQuery = createQuery({
    key: ['student-enrollments'],
    fn: courseService.getEnrollments, // (id: string) => Promise<Enrollment>
    defaultOptions: {
        retry: 2,
        retryDelay: 1000,
    }
});

const getMergedCategoriesQuery = createQuery({
    key: ['merged-categories'],
    fn: courseService.getMergedCategoriesWithCourses,
    defaultOptions: {
        retry: 2,
        retryDelay: 1000,
        staleTime: 60 * 60 * 1000, // 1 hour
    }
});
