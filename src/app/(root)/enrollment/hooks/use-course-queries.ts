import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course-service';
import { useCourseStore } from '../stores/course-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PaidCategory, VerifyPaymentResponse } from '../types/course.types';
import { createQuery } from '@/core/queryHooks';
import { useAuthContext } from '@/providers/AuthProvider';

export const useCourseQueries = (userId: string) => {
    const [unenrollModalOpen, setUnenrollModalOpen] = useState(false);
    const [courseToUnenroll, setCourseToUnenroll] = useState<{ courseId: string, courseGroupId: number, courseName: string } | null>(null);

    const { setCategories, setEnrolledCourses, setPaidCategories, setLoading, unenrollFromCourse } = useCourseStore();
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const mergedCategoriesQuery = getMergedCategoriesQuery();
    const enrollmentsQuery = getStudentEnrollmentsQuery();
    const paidCategoriesQuery = getPaidCategoriesQuery();

    useEffect(() => {
        if (mergedCategoriesQuery.data) setCategories(mergedCategoriesQuery.data);
        if (enrollmentsQuery.data) setEnrolledCourses(enrollmentsQuery.data);
        if (paidCategoriesQuery.data) setPaidCategories(paidCategoriesQuery.data as unknown as PaidCategory[]);

        setLoading(mergedCategoriesQuery.isLoading || enrollmentsQuery.isLoading || paidCategoriesQuery.isLoading);
    }, [
        mergedCategoriesQuery.data,
        enrollmentsQuery.data,
        paidCategoriesQuery.data,
        mergedCategoriesQuery.isLoading,
        enrollmentsQuery.isLoading,
        paidCategoriesQuery.isLoading,
        setCategories,
        setEnrolledCourses,
        setPaidCategories,
        setLoading
    ]);

    const reloadAllQueries = () => {
        mergedCategoriesQuery.refetch();
        enrollmentsQuery.refetch();
        paidCategoriesQuery.refetch();
    }

    // Payment mutation
    const paymentMutation = useMutation({
        mutationFn: ({ programId, paymentData }: { programId: string; paymentData: Record<string, unknown> }) =>
            courseService.processPayment(programId, paymentData),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            // useCourseStore.getState().enrollInCourse(variables.programId);
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

    const verifyCourseGroupPurchaseQuery = verifyCourseGroupPurchase;

    const enrollmentInCourseMutation = useMutation({
        mutationFn: ({ paymentData }: { paymentData: Record<string, unknown> }) =>
            courseService.processEnrollInCourse(paymentData),
        onMutate: (variables) => {
            setLoading(true);
            // Extract courseId from paymentData
            const courseId = variables.paymentData.courseId as string;
            // Optimistically update the UI
            useCourseStore.getState().enrollInCourse(courseId);
        },
        onSuccess: (data, variables) => {
            // Optionally refresh enrollments to get server data
            queryClient.invalidateQueries({ //UNCOMMENT THIS QUERY
                queryKey: ['student-enrollments']
            });
            toast.success('Successfully enrolled in course!');
        },
        onError: (error, variables) => {
            console.error('Enrollment error:', error);
            // Roll back optimistic update on error
            queryClient.invalidateQueries({
                queryKey: ['student-enrollments']
            });
            toast.error(error.message || 'Failed to enroll in course');
        },
        onSettled: () => {
            setLoading(false);
            // setSelectedCourse(null);
        },
    });

    const unenrollFromCourseMutation = useMutation({
        mutationFn: ({ courseGroupId, courseId }: { courseGroupId: number; courseId: number }) =>
            courseService.processUnEnrollFromCourse(courseGroupId, courseId),
        onMutate: (variables) => {
            setLoading(true);
            // Optimistically update the UI
            unenrollFromCourse(variables.courseId.toString(), variables.courseGroupId);
        },
        onSuccess: (data, variables) => {
            // Refresh enrollments to get updated server data
            queryClient.invalidateQueries({
                queryKey: ['student-enrollments']
            });
            toast.success('Successfully unenrolled from course!');
        },
        onError: (error, variables) => {
            console.error('Unenrollment error:', error);
            // Roll back optimistic update on error by refreshing data
            queryClient.invalidateQueries({
                queryKey: ['student-enrollments']
            });
            toast.error(error.message || 'Failed to unenroll from course');
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    return {
        user,
        mergedCategoriesQuery,
        paidCategoriesQuery,
        reloadCategoriesAndCourses: reloadAllQueries,
        enrollmentsQuery,
        paymentMutation,
        verifyCourseGroupPurchaseQuery,
        enrollmentInCourseMutation,
        unenrollFromCourseMutation,
        isPaymentProcessing: paymentMutation.isPending,
        isEnrollmentProcessing: enrollmentInCourseMutation.isPending,
        isUnenrollmentProcessing: unenrollFromCourseMutation.isPending,
        isLoading: mergedCategoriesQuery.isLoading || enrollmentsQuery.isLoading,
        isFetching: mergedCategoriesQuery.isFetching || enrollmentsQuery.isFetching,

        // Unenrollment Modal
        unenrollModalOpen,
        setUnenrollModalOpen,
        courseToUnenroll,
        setCourseToUnenroll,
        unenrollFromCourse,
    };
};

// UING THE GERIC QUERY TO IMPLEMENT USEQUERY FETCHING
const getStudentEnrollmentsQuery = createQuery({
    key: ['student-enrollments'],
    fn: courseService.getEnrolledCourseWithCategories,
    defaultOptions: { retry: 2, retryDelay: 1000, }
});

const getPaidCategoriesQuery = createQuery({
    key: ['paid-categories'],
    fn: courseService.getPaidCategories,
    defaultOptions: { retry: 2, retryDelay: 1000, }
});

const getMergedCategoriesQuery = createQuery({
    key: ['merged-categories'],
    fn: courseService.getMergedCategoriesWithCourses,
    defaultOptions: { retry: 2, retryDelay: 1000, staleTime: 60 * 60 * 1000, }
});

const verifyCourseGroupPurchase = (verifyCredentials: VerifyPaymentResponse | null) => {
    return useQuery({
        queryKey: ['verify-course-purchase', verifyCredentials],
        queryFn: () => {
            if (!verifyCredentials) {
                throw new Error('No verification credentials provided');
            }
            return courseService.verifyCoursePayment(verifyCredentials);
        },
        enabled: !!verifyCredentials &&
            !!verifyCredentials.reference &&
            !!verifyCredentials.transRef,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
