"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
// import { authApi } from "../api";
import type { AcceptInvitationPayload, SendInvitationPayload } from "../types";
import { authApi } from "@/modules/auth";

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

// export function useVerifyInvitationToken(token: string, enabled = true) {
//   return useQuery({
//     queryKey: queryKeys.subscription.invitationToken(token),
//     queryFn: () => authApi.verifyInvitation(token),
//     select: (response) => response.data,
//     enabled: enabled && token.length > 0,
//     retry: false,
//   });
// }
export function useVerifyInvitationToken(token: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscription.invitationToken(token),
    queryFn: () => authApi.verifyInvitation(token),
    select: (response) => response.data.invitation,
    enabled: enabled && token.length > 0,
    retry: false,
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
