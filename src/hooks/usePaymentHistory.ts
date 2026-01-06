// app/dashboard/parent/hooks/usePaymentHistory.ts - SIMPLIFIED
import { useState, useEffect, useCallback } from 'react';
import { useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';

export function usePaymentHistory() {
  const { selectedChild } = useParentStore();
  
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);

  const fetchPaymentHistory = useCallback(async () => {
    if (!selectedChild?.id) {
      console.log('No child selected');
      setPayments([]);
      setSummary(null);
      return;
    }
    
    // Skip if already fetching for this child
    if (lastFetchedId === selectedChild.id) {
      console.log('Already fetched for this child');
      return;
    }
    
    console.log('🔍 Fetching payments for child:', selectedChild.id);
    setLoading(true);
    setError(null);
    
    try {
      const result = await parentService.getPaymentHistory(selectedChild.id);
      console.log('✅ Payments fetched:', result.payments.length);
      
      setPayments(result.payments);
      setSummary(result.summary);
      setLastFetchedId(selectedChild.id);
      
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to fetch payments');
      setPayments([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [selectedChild, lastFetchedId]);

  // Fetch when selected child changes
  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  const refetch = () => {
    setLastFetchedId(null);
    fetchPaymentHistory();
  };

  return {
    payments,
    summary,
    loading,
    error,
    refetch
  };
}