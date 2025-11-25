
import { ApiError, PaginationParams, ApiResponse, Payment, PaymentWithDetails } from "@/types/auth";
import { apiClient } from "@/core/client";

export interface PaymentFilterParams extends PaginationParams {
    student_id?: number;
    status?: string;
    search?: string;
}

export const paymentService = {
    // Get all payments
    getAllPayments: async (params?: PaymentFilterParams): Promise<ApiResponse<Payment[]>> => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params?.student_id) queryParams.set('student_id', params.student_id.toString());
            if (params?.status) queryParams.set('status', params.status);
            if (params?.search) queryParams.set('search', params.search);
            if (params?.page) queryParams.set('page', params.page.toString());
            if (params?.perPage) queryParams.set('perPage', params.perPage.toString());

            const url = `/admin/payment-history${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await apiClient.get<any>(url);
            
            return {
                data: response.data || [],
                message: response.message || 'Success',
                status: 200
            };
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            return {
                data: [],
                message: 'Failed to fetch payments',
                status: 500
            };
        }
    },

    // Get payments with student details
getPaymentsWithDetails: async (params?: PaymentFilterParams): Promise<ApiResponse<PaymentWithDetails[]>> => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params?.student_id) queryParams.set('student_id', params.student_id.toString());
        if (params?.status) queryParams.set('status', params.status);
        if (params?.search) queryParams.set('search', params.search);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.perPage) queryParams.set('perPage', params.perPage.toString());

        const url = `/admin/payment-history-full${queryParams.toString() ? `?${queryParams}` : ''}`;

        const response = await apiClient.get<any>(url);

        // FIX: Always read from response.data
        const backend = response.data;

        let paymentsData: PaymentWithDetails[] = [];

        // Case 1: backend has "payments.data"
        if (backend?.payments?.data) {
            paymentsData = backend.payments.data;

        // Case 2: backend returns array directly
        } else if (Array.isArray(backend?.data)) {
            paymentsData = backend.data;

        // Case 3: plain array
        } else if (Array.isArray(backend)) {
            paymentsData = backend;
        }

        return {
            data: paymentsData,
            message: backend?.message || 'Success',
            status: backend?.status || 200
        };

    } catch (error: any) {
        console.error('Failed to fetch payment details:', error);

        return {
            data: [],
            message: 'No payments found',
            status: 200
        };
    }
}

};