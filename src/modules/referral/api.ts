import { apiClient } from "@/core/client";
import type { ReferralLedgerEntry, ReferralSummary } from "./types";

const BASE = "/v1/referrals";

// ========== DUMMY DATA ==========
const DUMMY_REFERRAL_SUMMARY: ReferralSummary = {
  referral_code: "REF_JOHN_2024",
  total_referred: 5,
  total_credited: 3,
  wallet_balance: 15000,
};

const DUMMY_REFERRAL_LEDGER: ReferralLedgerEntry[] = [
  {
    id: 1,
    referee_name: "Alice Smith",
    status: "credited",
    reward_amount: 5000,
    created_at: "2024-01-10T14:30:00Z",
    credited_at: "2024-01-17T10:00:00Z",
  },
  {
    id: 2,
    referee_name: "Bob Johnson",
    status: "pending",
    reward_amount: 5000,
    created_at: "2024-01-15T09:15:00Z",
    credited_at: null,
  },
  {
    id: 3,
    referee_name: "Carol White",
    status: "credited",
    reward_amount: 5000,
    created_at: "2024-01-12T16:45:00Z",
    credited_at: "2024-01-20T12:30:00Z",
  },
  {
    id: 4,
    referee_name: "David Brown",
    status: "pending",
    reward_amount: 5000,
    created_at: "2024-01-18T11:20:00Z",
    credited_at: null,
  },
  {
    id: 5,
    referee_name: "Eve Davis",
    status: "blocked",
    reward_amount: 5000,
    created_at: "2024-01-14T13:00:00Z",
    credited_at: null,
  },
];

// ========== API HANDLERS ==========

export const referralApi = {
  getSummary: () => {
    console.log("[DUMMY] Getting referral summary...");
    return Promise.resolve({ success: true, data: DUMMY_REFERRAL_SUMMARY });
    // apiClient.get<ReferralSummary>(`${BASE}/summary`),
  },

  getLedger: () => {
    console.log("[DUMMY] Getting referral ledger...");
    return Promise.resolve({ success: true, data: DUMMY_REFERRAL_LEDGER });
    // apiClient.get<ReferralLedgerEntry[]>(`${BASE}/ledger`),
  },
};
