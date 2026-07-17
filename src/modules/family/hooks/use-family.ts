"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
import { familyApi } from "../api";
import type { InviteParentPayload } from "../types";

export function useMyStudents() {
  return useQuery({
    queryKey: queryKeys.family.myStudents,
    queryFn: () => familyApi.getMyStudents(),
    select: (response) => response.data,
  });
}

export function useMyParents() {
  return useQuery({
    queryKey: queryKeys.family.myParents,
    queryFn: () => familyApi.getMyParents(),
    select: (response) => response.data,
  });
}

export function useInviteParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteParentPayload) =>
      familyApi.inviteParent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.family.myParents });
    },
  });
}

export function useUnlinkFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (relationshipId: number) => familyApi.unlink(relationshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.family.myStudents });
      queryClient.invalidateQueries({ queryKey: queryKeys.family.myParents });
    },
  });
}
