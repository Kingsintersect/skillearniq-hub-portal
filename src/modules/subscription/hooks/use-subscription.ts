"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
import { subscriptionApi } from "../api";
import type { AcceptInvitationPayload, SendInvitationPayload } from "../types";

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.subscription.plans,
    queryFn: () => subscriptionApi.getPlans(),
    select: (response) => response.data,
  });
}

export function useMyGroup() {
  return useQuery({
    queryKey: queryKeys.subscription.myGroup,
    queryFn: () => subscriptionApi.getMyGroup(),
    select: (response) => response.data,
  });
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendInvitationPayload) =>
      subscriptionApi.sendInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useVerifyInvitationToken(token: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscription.invitationToken(token),
    queryFn: () => subscriptionApi.verifyInvitationToken(token),
    select: (response) => response.data,
    enabled: enabled && token.length > 0,
    retry: false,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) =>
      subscriptionApi.acceptInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: number) =>
      subscriptionApi.revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => subscriptionApi.removeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.myGroup });
    },
  });
}
