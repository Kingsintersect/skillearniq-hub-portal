// hooks/useParentPayments.ts
import { useEffect } from 'react';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from './useParentQueries';

export const useParentPayments = () => {
  const {
    selectedChild,
    payments,
    paymentSummary,
    filteredPayments,
    paymentFilters,
    setPayments,
    setPaymentSummary,
    setFilteredPayments,
    setPaymentFilters,
    clearPaymentFilters,
    getPaymentsByStudentId,
    updatePaymentStatus,
    isPaymentsLoading,
    paymentsError,
    setPaymentsLoading,
    setPaymentsError
  } = useParentStore();

  const { usePaymentHistory } = useParentQueries();
  const { data: paymentsData, isLoading: paymentsLoading, error: paymentsQueryError } = usePaymentHistory();
  console.log('Payments data in hook:', paymentsData);

  // Sync payment data from query to store
  useEffect(() => {
    if (paymentsData) {
      setPayments(paymentsData.payments);
      setPaymentSummary(paymentsData.summary);
    }
  }, [paymentsData, setPayments, setPaymentSummary]);

  // Update filtered payments when filters or selected child changes
  useEffect(() => {
    let filtered = selectedChild 
      ? getPaymentsByStudentId(selectedChild.id.toString())
      : payments;

    // Apply status filter
    if (paymentFilters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentFilters.status);
    }

    // Apply date range filter
    if (paymentFilters.dateRange.from) {
      filtered = filtered.filter(payment => 
        new Date(payment.createdAt) >= new Date(paymentFilters.dateRange.from)
      );
    }

    if (paymentFilters.dateRange.to) {
      filtered = filtered.filter(payment => 
        new Date(payment.createdAt) <= new Date(paymentFilters.dateRange.to)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, selectedChild, paymentFilters, getPaymentsByStudentId, setFilteredPayments]);

  // Update loading and error states
  useEffect(() => {
    setPaymentsLoading(paymentsLoading);
    setPaymentsError(paymentsQueryError?.message || null);
  }, [paymentsLoading, paymentsQueryError, setPaymentsLoading, setPaymentsError]);

  return {
    // Data
    payments,
    paymentSummary,
    filteredPayments,
    paymentFilters,
    
    // Selected child info
    selectedChild,
    
    // Loading and error states
    isPaymentsLoading,
    paymentsError,
    
    // Actions
    setPaymentFilters,
    clearPaymentFilters,
    updatePaymentStatus,
    
    // Filtered data summary
    totalPayments: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
    paidAmount: filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0),
    pendingAmount: filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0),
  };
};