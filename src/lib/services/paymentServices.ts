import { ApiError } from "@/types/auth";
import { apiClient } from "./client";

export interface PaymentData {
    amount: number;
    authorizationUrl: string;
    credoReference: string;
    crn: string;
    debitAmount: number;
    fee: number;
    reference: string;
}

export interface VerifyPaymentResponse {
    transAmount: string;
    reference: string;
    transRef: string;
    processorFee: string;
    errorMessage: string;
    currency: string;
    gateway: string;
    status: string;
}

export interface VerifyPaymentResponse {
    status: string;
    message?: string;
    error?: [];
}
export const paymentServices = {
    initializeCourseEnrolmentPayment: async (courseId: number, amount: number) => {
        try {
            const response = await apiClient.post<PaymentData>('/student/enroll-course', {
                "department": "SKILLEARN",
                "course_id": courseId,
                "amount": amount,
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
    },

    verifyCoursePayment: async (verifyCredentials: VerifyPaymentResponse): Promise<VerifyPaymentResponse> => {
        try {
            // Build query string from parameters
            const queryParams = new URLSearchParams({
                transAmount: verifyCredentials.transAmount,
                reference: verifyCredentials.reference,
                transRef: verifyCredentials.transRef,
                processorFee: verifyCredentials.processorFee,
                errorMessage: verifyCredentials.errorMessage,
                currency: verifyCredentials.currency,
                gateway: verifyCredentials.gateway,
                status: verifyCredentials.status,
            }).toString();

            const response = await apiClient.get<VerifyPaymentResponse>(
                `/student/verify-payment?${queryParams}`
            );

            // Check if status is "Successful" (string)
            const responseData = response.data || response;

            // Check if status is "Successful" (string)
            if (responseData.status !== "Successful") {
                throw new Error(responseData.message || 'Payment verification failed');
            }

            return responseData;
        } catch (error) {
            throw error as ApiError;
        }
    },
}