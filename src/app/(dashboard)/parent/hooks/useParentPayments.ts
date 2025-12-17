// hooks/useParentPayments.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';
import { useEffect } from 'react';

export const useParentPayments = () => {
    const {
        payments,
        paymentSummary,
        selectedPayment,
        filteredPayments,
        paymentFilters,
        setPayments,
        setPaymentSummary,
        setSelectedPayment,
        setFilteredPayments,
        setPaymentFilters,
        setPaymentsLoading,
        setPaymentsError,
        updatePaymentStatus,
        selectedStudentId
    } = useParentStore();

    const queryClient = useQueryClient();

    // Fetch payments data for all students
    const paymentsQuery = useQuery({
        queryKey: ['parent', 'payments'],
        queryFn: () => parentService.getPaymentHistory(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });

    // Sync React Query state with Zustand store
    // useEffect(() => {
    //     setPaymentsLoading(paymentsQuery.isLoading);
    //     setPaymentsError(paymentsQuery.error ? 'Failed to load payments' : null);

    //     if (paymentsQuery.data?.data) {
    //         setPayments(paymentsQuery.data.data.payments || []);
    //         setPaymentSummary(paymentsQuery.data.data.summary || null);
    //     }
    // }, [
    //     paymentsQuery.data,
    //     paymentsQuery.isLoading,
    //     paymentsQuery.error,
    //     setPayments,
    //     setPaymentSummary,
    //     setPaymentsLoading,
    //     setPaymentsError,
    // ]);

    // Filter payments based on selectedStudentId and filters
    useEffect(() => {
        const filterPayments = () => {
            let filtered = payments;

            // Always filter by selected student
            if (selectedStudentId) {
                filtered = filtered.filter(payment => payment.studentId === selectedStudentId);
            } else {
                // If no student selected, show empty array
                filtered = [];
            }

            // Apply additional filters
            if (paymentFilters.status !== 'all') {
                filtered = filtered.filter(payment => payment.status === paymentFilters.status);
            }

            if (paymentFilters.dateRange.from) {
                filtered = filtered.filter(payment => payment.dueDate >= paymentFilters.dateRange.from);
            }
            if (paymentFilters.dateRange.to) {
                filtered = filtered.filter(payment => payment.dueDate <= paymentFilters.dateRange.to);
            }

            setFilteredPayments(filtered);
        };

        filterPayments();
    }, [payments, paymentFilters, selectedStudentId, setFilteredPayments]);

    // Auto-select first payment when filtered payments change
    useEffect(() => {
        if (filteredPayments.length > 0 && !selectedPayment) {
            setSelectedPayment(filteredPayments[0]);
        } else if (filteredPayments.length === 0) {
            setSelectedPayment(null);
        }
    }, [filteredPayments, selectedPayment, setSelectedPayment]);

    // Helper functions
    const refetchPayments = () => {
        queryClient.invalidateQueries({ queryKey: ['parent', 'payments'] });
    };

    const markAsPaid = (paymentId: string, paymentMethod: string = 'online') => {
        updatePaymentStatus(paymentId, 'paid');
        // In a real app, you would also call an API here
    };

    const getStudentPayments = (studentId: string) => {
        return payments.filter(payment => payment.studentId === studentId);
    };

    const getUpcomingPayments = () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return payments.filter(payment =>
            payment.status === 'pending' &&
            new Date(payment.dueDate) <= nextWeek &&
            payment.studentId === selectedStudentId
        );
    };

    const getPaymentSummaryForStudent = (studentId: string) => {
        const studentPayments = payments.filter(payment => payment.studentId === studentId);
        return {
            totalPaid: studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
            totalPending: studentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
            totalOverdue: studentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
            upcomingPayments: studentPayments
                .filter(p => p.status === 'pending' && new Date(p.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        };
    };

    return {
        // React Query data
        ...paymentsQuery,

        // Zustand state
        payments,
        paymentSummary,
        selectedPayment,
        filteredPayments,
        paymentFilters,
        selectedStudentId,
        isPaymentsLoading: useParentStore.getState().isPaymentsLoading,
        paymentsError: useParentStore.getState().paymentsError,

        // Computed values for selected student
        studentPayments: filteredPayments,
        studentPaymentSummary: selectedStudentId ? getPaymentSummaryForStudent(selectedStudentId) : null,

        // Actions
        refetchPayments,
        setSelectedPayment,
        setPaymentFilters,
        clearPaymentFilters: useParentStore.getState().clearPaymentFilters,
        markAsPaid,
        getStudentPayments,
        getUpcomingPayments,
        updatePaymentStatus,
    };
};