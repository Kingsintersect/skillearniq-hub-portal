import { initializeCourseEnrolmentPaymentResponse, paymentServices } from "@/lib/services/paymentServices";
import { useMutation } from "@tanstack/react-query";


export function useInitializeCoursePurchase() {
    return useMutation<initializeCourseEnrolmentPaymentResponse, Error>({
        mutationFn: () => paymentServices.initializeCourseEnrolmentPayment(),
    });
}
