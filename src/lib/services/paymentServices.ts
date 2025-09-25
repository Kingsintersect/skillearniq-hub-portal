import { ApiError } from "@/types/auth";
import { apiClient } from "./client";

export interface initializeCourseEnrolmentPaymentResponse {
    // define your expected response structure
    status: number | string;
    message?: string;
    data?: Record<string, unknown>;
    error: [];
}
export const paymentServices = {
    initializeCourseEnrolmentPayment: async (): Promise<initializeCourseEnrolmentPaymentResponse> => {
        try {
            const response = await apiClient.get<initializeCourseEnrolmentPaymentResponse>('/application/retry-purchase');
            if (!response.status || !response.data) {
                throw new Error(response.message || 'Failed to get current  session');
            }
            return response.data
        } catch (error) {
            console.log('error', error);
            throw error as ApiError;
        }
    }
}