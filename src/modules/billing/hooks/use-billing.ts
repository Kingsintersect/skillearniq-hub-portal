"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
import { billingApi } from "../api";
import type { InitiateCheckoutPayload } from "../types";

export function useInitiateCheckout() {
  return useMutation({
    mutationFn: (payload: InitiateCheckoutPayload) =>
      billingApi.initiateCheckout(payload),
  });
}

export function useValidateCoupon(code: string, planId: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.billing.coupon(code),
    queryFn: () => billingApi.validateCoupon(code, planId),
    select: (response) => response.data,
    enabled: enabled && code.length > 0,
    retry: false,
    staleTime: 30_000,
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.billing.paymentHistory,
    queryFn: () => billingApi.getPaymentHistory(),
    select: (response) => response.data,
  });
}

export function useSubscriptionBillingStatus() {
  return useQuery({
    queryKey: ["billing", "subscription-status"],
    queryFn: () => billingApi.getSubscriptionStatus(),
    select: (response) => response.data,
  });
}

export function useRetryPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => billingApi.retryPayment(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription-status"] });
    },
  });
}

/**
 * Polls checkout status every 5s — used while showing bank-transfer
 * instructions during the 30-minute window (Rule 4.4), so the UI can react
 * the moment the transfer lands or the window expires.
 */
export function useCheckoutStatusPolling(reference: string, enabled: boolean) {
  return useQuery({
    queryKey: ["billing", "checkout-status", reference],
    queryFn: () => billingApi.getCheckoutStatus(reference),
    select: (response) => response.data.status,
    enabled: enabled && reference.length > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status === undefined || status === "pending" ? 5000 : false;
    },
  });
}
