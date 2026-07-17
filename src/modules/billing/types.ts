/**
 * Billing / payment domain types.
 * Source: Rule Block 4 (Billing & Payment Gateways) and the coupon portion
 * of Rule Block 5 (Discounts & Referral Ledgers).
 */

export type PaymentMethod = "card" | "bank_transfer";

export type PaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "expired";

export type DunningStage = "current" | "past_due" | "grace_period" | "cancelled";

export interface CheckoutSummary {
  plan_id: number;
  plan_name: string;
  base_price: number;
  coupon_code?: string;
  coupon_discount: number;
  wallet_credit_applied: number;
  /** Server-computed; client-side price values are always ignored (Rule 4.1). */
  total_due: number;
  currency: "NGN";
}

export interface InitiateCheckoutPayload {
  plan_id: number;
  payment_method: PaymentMethod;
  coupon_code?: string;
  use_wallet_credit?: boolean;
}

export interface CardCheckoutData {
  payment_method: "card";
  authorization_url: string;
  reference: string;
  summary: CheckoutSummary;
}

export interface BankTransferCheckoutData {
  payment_method: "bank_transfer";
  virtual_account_number: string;
  bank_name: string;
  account_name: string;
  /** Business rule 4.4: virtual account remains active for exactly 30 minutes. */
  expires_at: string;
  reference: string;
  summary: CheckoutSummary;
}

export type InitiateCheckoutData = CardCheckoutData | BankTransferCheckoutData;

export interface CouponValidationData {
  code: string;
  valid: boolean;
  discount_amount?: number;
  reason?: string;
}

export interface PaymentHistoryItem {
  id: number;
  amount: number;
  gateway: "paystack" | "flutterwave" | "bank_transfer";
  status: PaymentStatus;
  reference: string;
  paid_at: string | null;
  created_at: string;
}

export interface SubscriptionBillingStatus {
  status: DunningStage;
  ends_at: string;
  /** Present only while in the 7-day grace period after a failed renewal (Rule 4.3). */
  grace_period_ends_at?: string;
  next_retry_at?: string;
}

/** Business rule 4.3: dunning timeline constants, used for messaging/countdowns. */
export const DUNNING_GRACE_PERIOD_DAYS = 7;
export const DUNNING_RETRY_DAYS = [2, 5] as const;

/** Business rule 4.4: virtual account window. */
export const BANK_TRANSFER_WINDOW_MINUTES = 30;
