/**
 * Referral domain types.
 * Source: Rule Block 5 — Referral Reward Engine.
 */

export type RewardStatus = "pending" | "credited" | "blocked";

export interface ReferralSummary {
  referral_code: string;
  total_referred: number;
  total_credited: number;
  wallet_balance: number;
}

export interface ReferralLedgerEntry {
  id: number;
  referee_name: string;
  status: RewardStatus;
  reward_amount: number;
  created_at: string;
  /** Set once the referee completes a successful invoice (Rule 5.2 conversion). */
  credited_at: string | null;
}

/** Rule 5.2: reward stays "Pending" until the referee's first successful invoice. */
export const REWARD_PENDING_EXPLANATION =
  "Rewards are credited once your referral completes their first successful payment.";

/** Rule 5.2: fraud lock — blocked when self-referral signals are detected. */
export const REWARD_BLOCKED_EXPLANATION =
  "This reward was blocked due to a match with your own payment details.";
