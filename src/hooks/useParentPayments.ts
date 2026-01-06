import { useEffect, useState, useCallback } from 'react';
import { useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';

export function useParentPayments() {
  const {
    payments,
    paymentSummary,
    filteredPayments,
    isPaymentsLoading,
    paymentsError,
    selectedChild,
    paymentFilters,
    setPayments,
    setPaymentSummary,
    setFilteredPayments,
    setPaymentsLoading,
    setPaymentsError,
    setPaymentFilters,
    resetPaymentData
  } = useParentStore();

  const [lastFetchedChildId, setLastFetchedChildId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      console.log('🔄 useParentPayments: Starting fetch...');
      console.log('👤 Selected Child:', selectedChild);
      
      if (!selectedChild || !selectedChild.id) {
        console.log('⏸️ No child selected, clearing data');
        resetPaymentData();
        setLastFetchedChildId(null);
        return;
      }
      
      if (lastFetchedChildId === selectedChild.id) {
        console.log('✅ Already fetched data for this child');
        return;
      }
      
      setPaymentsLoading(true);
      setPaymentsError(null);
      
      console.log('📞 Fetching payments for child ID:', selectedChild.id);
      const result = await parentService.getPaymentHistory(selectedChild.id);
      
      console.log('✅ Payments fetched successfully');
      console.log('Payments count:', result.payments.length);
      console.log('Summary:', result.summary);
      
      setPayments(result.payments);
      setPaymentSummary(result.summary);
      setFilteredPayments(result.payments);
      setLastFetchedChildId(selectedChild.id);
      
    } catch (error: any) {
      console.error('❌ Error fetching payments:', error);
      setPaymentsError(error.message || 'Failed to load payment history');
      resetPaymentData();
      setLastFetchedChildId(null);
    } finally {
      setPaymentsLoading(false);
    }
  }, [
    selectedChild, 
    lastFetchedChildId,
    setPayments, 
    setPaymentSummary, 
    setFilteredPayments, 
    setPaymentsLoading, 
    setPaymentsError,
    resetPaymentData
  ]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    if (!payments.length) {
      setFilteredPayments([]);
      return;
    }

    let filtered = [...payments];
    if (paymentFilters.status && paymentFilters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentFilters.status);
    }
    setFilteredPayments(filtered);
  }, [payments, paymentFilters.status, setFilteredPayments]);

  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch triggered');
    setLastFetchedChildId(null);
  }, []);

  return {
    payments,
    paymentSummary,
    filteredPayments,
    isPaymentsLoading,
    paymentsError,
    paymentFilters,
    setPaymentFilters,
    refetch,
    fetchPayments
  };
}