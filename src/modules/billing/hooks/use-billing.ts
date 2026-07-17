// src/modules/billing/hooks/use-billing.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
import { authApi } from "@/modules/auth/api";
import type {
  SubscriptionInitializePayload,
  SubscriptionInitializeData,
} from "@/modules/auth/types";

// ─── Coupon ────────────────────────────────────────────────────────────────

export function useValidateCoupon(code: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.billing.coupon(code),
    queryFn: () => authApi.validateCoupon(code),
    select: (response) => response.data,
    enabled: enabled && code.length > 0,
    retry: false,
    staleTime: 30_000,
  });
}

// ─── Subscription ──────────────────────────────────────────────────────────

export function useInitiateCheckout() {
  return useMutation({
    mutationFn: (payload: SubscriptionInitializePayload) =>
      authApi.initializeSubscription(payload),
  });
}

export function useSubscriptionStatus(groupId: string | number) {
  return useQuery({
    queryKey: queryKeys.subscription.status(groupId),
    queryFn: () => authApi.getSubscriptionStatus(groupId),
    select: (response) => response.data,
    enabled: Boolean(groupId),
  });
}

// ─── Payment History ──────────────────────────────────────────────────────

// export function usePaymentHistory() {
//   return useQuery({
//     queryKey: queryKeys.billing.paymentHistory,
//     queryFn: () => authApi.getPaymentHistory(),
//     select: (response) => response.data,
//   });
// }
// Inside ../hooks/use-billing.ts
export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payment-history'], // or your queryKeys configuration
    queryFn: () => authApi.getPaymentHistory(),
    // 🛠️ Dig into the wrapper object to extract the actual array
    // (Replace '.payments' with '.history' or '.data' depending on your exact backend key)
    select: (res) => res.data.payments,
  });
}

// ─── Subscription Billing Status ─────────────────────────────────────────

export function useSubscriptionBillingStatus() {
  return useQuery({
    queryKey: ["billing", "subscription-status"],
    queryFn: () => authApi.getSubscriptionBillingStatus(),
    select: (response) => response.data,
  });
}

// ─── Retry Payment ────────────────────────────────────────────────────────

export function useRetryPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.retryPayment(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billing", "subscription-status"]
      });
    },
  });
}

// ─── Group ──────────────────────────────────────────────────────────────────

export function useMyGroup() {
  return useQuery({
    queryKey: queryKeys.subscription.myGroup,
    queryFn: () => authApi.getMyGroup(),
    select: (response) => response.data,
  });
}

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.subscription.plans,
    queryFn: () => authApi.getPlans(),
    select: (response) => response.data,
  });
}

// ─── Invitations & Members ──────────────────────────────────────────────────

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.sendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useVerifyInvitationToken(token: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscription.invitationToken(token),
    queryFn: () => authApi.verifyInvitation(token),
    select: (response) => response.data,
    enabled: enabled && token.length > 0,
    retry: false,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: number) => authApi.revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => authApi.removeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

/**
 * Polls every 5s while a bank-transfer window is open (Rule 4.4: 30 min).
 * Reads the group's subscription status — stops once it flips to "active"
 * or "cancelled", meaning the payment either landed or the window expired.
 */
export function useCheckoutStatusPolling(
  groupId: string | number,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["billing", "checkout-status", groupId],
    queryFn: () => authApi.getSubscriptionStatus(groupId),
    select: (response) => response.data.status,
    enabled: enabled && Boolean(groupId),
    refetchInterval: (query) => {
      const status = query.state.data as string | undefined;
      return status === "active" || status === "cancelled" ? false : 5000;
    },
  });
}