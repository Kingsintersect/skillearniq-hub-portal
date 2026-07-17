// billing/types.ts - Option A: Re-export from auth
export type {
  SubscriptionInitializeData,
  BankTransferInstructions,
  PaymentMethod,
  SubscriptionStatus,
  SubscriptionStatusData,
} from "@/modules/auth/types";

// Or Option B: Keep only billing-specific types that don't exist in auth
export type PaymentStatus = "pending" | "successful" | "failed" | "expired";
export type DunningStage = "current" | "past_due" | "grace_period" | "cancelled";

export interface PaymentHistoryItem {
  id: number;
  amount: number;
  gateway: "paystack" | "flutterwave" | "bank_transfer";
  status: PaymentStatus;
  reference: string;
  paid_at: string | null;
  created_at: string;
}

// Business rules constants
export const DUNNING_GRACE_PERIOD_DAYS = 7;
export const DUNNING_RETRY_DAYS = [2, 5] as const;
export const BANK_TRANSFER_WINDOW_MINUTES = 30;