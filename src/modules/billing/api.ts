// import { apiClient } from "@/core/client";
// import type {
//   CouponValidationData,
//   InitiateCheckoutData,
//   InitiateCheckoutPayload,
//   PaymentHistoryItem,
//   SubscriptionBillingStatus,
// } from "./types";

// const BASE = "/v1/billing";

// // ========== DUMMY DATA ==========
// const DUMMY_CHECKOUT_CARD: Extract<InitiateCheckoutData, { payment_method: "card" }> = {
//   payment_method: "card",
//   authorization_url: "https://checkout.paystack.com/9l7o7q8e9r2t5y6u",
//   reference: "REF_CARD_20240120_001",
//   summary: {
//     plan_id: 2,
//     plan_name: "Family Plan (2-3 members)",
//     base_price: 8000,
//     coupon_code: undefined,
//     coupon_discount: 0,
//     wallet_credit_applied: 0,
//     total_due: 8000,
//     currency: "NGN",
//   },
// };

// const DUMMY_CHECKOUT_BANK: Extract<InitiateCheckoutData, { payment_method: "bank_transfer" }> = {
//   payment_method: "bank_transfer",
//   virtual_account_number: "0123456789",
//   bank_name: "Access Bank",
//   account_name: "SkillLearnIQ Virtual Account",
//   expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
//   reference: "REF_BANK_20240120_001",
//   summary: {
//     plan_id: 2,
//     plan_name: "Family Plan (2-3 members)",
//     base_price: 8000,
//     coupon_code: undefined,
//     coupon_discount: 0,
//     wallet_credit_applied: 0,
//     total_due: 8000,
//     currency: "NGN",
//   },
// };

// const DUMMY_COUPON_VALIDATION: CouponValidationData = {
//   code: "SAVE20",
//   valid: true,
//   discount_amount: 1600,
// };

// const DUMMY_PAYMENT_HISTORY: PaymentHistoryItem[] = [
//   {
//     id: 1,
//     amount: 8000,
//     gateway: "paystack",
//     status: "successful",
//     reference: "ref_abc123",
//     paid_at: "2024-01-15T10:30:00Z",
//     created_at: "2024-01-15T09:00:00Z",
//   },
//   {
//     id: 2,
//     amount: 5000,
//     gateway: "bank_transfer",
//     status: "successful",
//     reference: "ref_def456",
//     paid_at: "2024-01-01T14:20:00Z",
//     created_at: "2024-01-01T12:00:00Z",
//   },
//   {
//     id: 3,
//     amount: 8000,
//     gateway: "flutterwave",
//     status: "failed",
//     reference: "ref_ghi789",
//     paid_at: null,
//     created_at: "2023-12-20T16:45:00Z",
//   },
// ];

// const DUMMY_SUBSCRIPTION_STATUS: SubscriptionBillingStatus = {
//   status: "current",
//   ends_at: "2024-02-15T23:59:59Z",
//   grace_period_ends_at: undefined,
//   next_retry_at: undefined,
// };

// // ========== API HANDLERS ==========

// export const billingApi = {
//   initiateCheckout: (payload: InitiateCheckoutPayload) => {
//     console.log("[DUMMY] Initiating checkout:", payload);
//     const dummyData = payload.payment_method === "card" ? DUMMY_CHECKOUT_CARD : DUMMY_CHECKOUT_BANK;
//     return Promise.resolve({ success: true, data: dummyData as InitiateCheckoutData });
//     // apiClient.post<InitiateCheckoutData>(`${BASE}/checkout`, payload),
//   },

//   /**
//    * Rule 5.1: validates a coupon (expiry + max_uses) before it's applied.
//    * Server is the source of truth — this is used for live feedback as the
//    * user types, not for the actual discount application at checkout.
//    */
//   validateCoupon: (code: string, planId: number) => {
//     console.log("[DUMMY] Validating coupon:", code, "for plan:", planId);
//     return Promise.resolve({
//       success: true,
//       data: {
//         code,
//         valid: code === "SAVE20",
//         discount_amount: code === "SAVE20" ? 1600 : 0,
//         reason: code === "SAVE20" ? undefined : "Invalid coupon code",
//       },
//     });
//     // apiClient.get<CouponValidationData>(`${BASE}/coupons/validate`, {
//     //   params: { code, plan_id: planId },
//     // }),
//   },

//   getPaymentHistory: () => {
//     console.log("[DUMMY] Getting payment history...");
//     return Promise.resolve({ success: true, data: DUMMY_PAYMENT_HISTORY });
//     // apiClient.get<PaymentHistoryItem[]>(`${BASE}/payments`),
//   },

//   getSubscriptionStatus: () => {
//     console.log("[DUMMY] Getting subscription status...");
//     return Promise.resolve({ success: true, data: DUMMY_SUBSCRIPTION_STATUS });
//     // apiClient.get<SubscriptionBillingStatus>(`${BASE}/subscription/status`),
//   },

//   /** Manually retry a failed card charge during the grace period (Rule 4.3). */
//   retryPayment: () => {
//     console.log("[DUMMY] Retrying payment...");
//     return Promise.resolve({ success: true, data: { success: true } });
//     // apiClient.post<{ success: boolean }>(`${BASE}/subscription/retry`),
//   },

//   /**
//    * Polls a bank-transfer reference's status. Useful while the 30-minute
//    * virtual account window (Rule 4.4) is open.
//    */
//   getCheckoutStatus: (reference: string) => {
//     console.log("[DUMMY] Getting checkout status for reference:", reference);
//     return Promise.resolve({
//       success: true,
//       data: { status: "pending" as const },
//     });
//     // apiClient.get<{ status: "pending" | "successful" | "expired" }>(
//     //   `${BASE}/checkout/${reference}/status`
//     // ),
//   },
// };
