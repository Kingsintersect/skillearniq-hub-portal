"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
// import { authApi } from "../api";
import type { AcceptInvitationPayload, SendInvitationPayload } from "../types";
import { authApi } from "@/modules/auth";
import type { VerifyRegistrationData } from "@/modules/auth";

/**
 * Reads a "yes, this email has an account" verdict out of the
 * verify-registration response regardless of which field/shape the backend
 * used to express it.
 */
export function isEmailRegistered(data?: VerifyRegistrationData | null): boolean {
  if (!data) return false;
  return Boolean(
    data.registered ??
      data.is_registered ??
      data.exists ??
      data.data?.registered ??
      data.data?.is_registered ??
      data.data?.exists ??
      data.user
  );
}

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.subscription.plans,
    queryFn: () => authApi.getPlans(),
    select: (response) => response.data.data,
  });
}

export function useMyGroup() {
  return useQuery({
    queryKey: queryKeys.subscription.myGroup,
    queryFn: () => authApi.getMyGroup(),
    select: (response) => response.data.group,
  });
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendInvitationPayload) =>
      authApi.sendInvitation(payload),
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useVerifyInvitationToken(token: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscription.invitationToken(token),
    queryFn: () => authApi.verifyInvitation(token),
    select: (response) => response.data.invitation,
    enabled: enabled && token.length > 0,
    retry: false,
    // A single-use token becomes "invalid" the moment it's accepted — never
    // silently refetch and flip a joined user's screen to an error.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function useVerifyRegistration() {
  return useMutation({
    mutationFn: (email: string) => authApi.verifyRegistration({ email }),
    // Return the unwrapped payload so callers can pass it to isEmailRegistered().
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) =>
      authApi.acceptInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: number) =>
      authApi.revokeInvitation(invitationId),
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
