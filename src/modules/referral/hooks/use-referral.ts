"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared";
import { referralApi } from "../api";

export function useReferralSummary() {
  return useQuery({
    queryKey: queryKeys.referral.summary,
    queryFn: () => referralApi.getSummary(),
    select: (response) => response.data,
  });
}

export function useReferralLedger() {
  return useQuery({
    queryKey: queryKeys.referral.ledger,
    queryFn: () => referralApi.getLedger(),
    select: (response) => response.data,
  });
}
