import { PaymentData, paymentServices, VerifyPaymentResponse } from "@/lib/services/paymentServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useInitializeCoursePurchase() {
    return useMutation<
        PaymentData, // Now expecting just the payment data
        Error,
        { courseId: number; amount: number }
    >({
        mutationFn: ({ courseId, amount }) =>
            paymentServices.initializeCourseEnrolmentPayment(courseId, amount),
        onSuccess: (data, variables) => {

            if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
                toast.success('Redirecting to payment gateway...');
            }
        },
        onError: (error, variables, context) => {
            console.error('Payment initialization failed:', error);
            toast.error(error.message || 'Failed to initialize payment');
        }
    });
}

export const useVerifyCoursePurchase = (verifyCredentials: VerifyPaymentResponse | null) => {
    return useQuery({
        queryKey: ['verify-course-purchase', verifyCredentials],
        queryFn: () => {
            if (!verifyCredentials) {
                throw new Error('No verification credentials provided');
            }
            return paymentServices.verifyCoursePayment(verifyCredentials);
        },
        enabled: !!verifyCredentials &&
            !!verifyCredentials.reference &&
            !!verifyCredentials.transRef, // Only enable if we have essential data
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};