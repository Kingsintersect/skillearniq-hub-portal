/**
 * Auth domain types.
 * Source of truth: Laravel `roles`/`users` schema + register/login/otp/password
 * endpoint payloads in Laravel_Database_Schemas.docx.
 */

export type SystemRole = "student" | "parent" | "tutor" | "manager" | "super_admin";

/** Roles selectable at public registration (Rule 2.1: role is permanent once set). */
export type RegistrableRole = "student" | "parent";

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: SystemRole;
}

/** ---------------- Registration: step 1 — initialize ---------------- */

export interface RegisterInitializePayload {
  role: RegistrableRole;
  first_name: string;
  last_name: string;
  email_or_phone_number: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterInitializeData {
  registration_reference: string;
  emailVerificationRequired: boolean;
  phoneVerificationRequired: boolean;
  /** Seconds until the dispatched OTP(s) expire. */
  expiresIn: number;
}

/** ---------------- Registration: step 2 — verify OTP ---------------- */

export interface RegisterVerifyOtpPayload {
  registration_reference: string;
  email_or_mobile_otp: string;
}

export interface RegisterVerifyOtpData {
  registration_reference: string;
  email_verified: boolean;
  mobile_verified: boolean;
}

/** ---------------- Registration: step 3 — complete profile ---------------- */

export type Gender = "male" | "female";

export interface RegisterCompletePayload {
  registration_reference: string;
  gender: Gender;
  nationality: string;
  other_names?: string;
  /**
   * Family-invite branch (Rule Block 2): only relevant for students supplying
   * a parent to be linked or passively created. Optional — students may
   * register individually without these fields.
   */
  parent_first_name?: string;
  parent_last_name?: string;
  parent_email?: string;
  parent_phone_number?: string;
}

export interface RegisterCompleteData {
  success: boolean;
  accessToken: string;
  user: AuthUser;
  registrationCompleted: boolean;
}

/** ---------------- Login ---------------- */

export interface LoginPayload {
  email_or_phone_number: string;
  password: string;
}

export interface LoginData {
  success: boolean;
  mfa_required: boolean;
  access_token: string;
  user: AuthUser;
}

/** ---------------- OTP engine (generic, reused for MFA / transaction confirm) ---------------- */

export type OtpUseCase =
  | "email_verification"
  | "mobile_verification"
  | "login_mfa"
  | "password_reset"
  | "transaction_confirm";

export type OtpChannel = "sms" | "email" | "push";

export interface OtpGeneratePayload {
  use_case: OtpUseCase;
  identity: string;
  email?: string;
  channel: OtpChannel;
}

export interface OtpGenerateData {
  identity: string;
}

export interface OtpVerifyPayload {
  identity: string;
  otp_code: string;
}

/** ---------------- Password reset ---------------- */

export interface ForgotPasswordPayload {
  identity: string;
}

export interface ForgotPasswordData {
  reset_reference: string;
}

export interface ResetPasswordPayload {
  reset_reference: string;
  otp_code: string;
  password: string;
  password_confirmation: string;
}

/** Business rule 1.3: max 3 OTP attempts before a 15-minute identity lock. */
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_LOCK_MINUTES = 15;
export const OTP_EXPIRY_SECONDS = 600;

/** ---------------- Plans ---------------- */

export interface PlanData {
  id: number;
  name: string;
  price: number;
  max_members: number;
  is_active: boolean;
}

export interface PlansData {
  success: boolean;
  data: PlanData[];
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  max_members: number;
  is_active: boolean;
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> { }

export interface PlanMutationData {
  success: boolean;
  plan: PlanData;
}

/** ---------------- Coupons (public validate) ---------------- */

export interface CouponData {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  is_valid: boolean;
}

export interface CouponValidateData {
  success: boolean;
  coupon: CouponData;
}

/** ---------------- Admin Coupons (CRUD) ---------------- */

export type CouponType = "fixed" | "percentage";

export interface AdminCouponData {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: string; // ✅ Note: API returns value as string
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCouponsListData {
  success: boolean;
  coupons: AdminCouponData[];
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  expires_at?: string;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> { }

export interface CouponMutationData {
  success: boolean;
  coupon: AdminCouponData;
}

/** ---------------- Subscriptions ---------------- */

export type PaymentMethod = "card" | "bank_transfer";

export interface SubscriptionInitializePayload {
  plan_id: number;
  gateway: string;
  payment_method: PaymentMethod;
  coupon_code?: string;
  /** ISO-4217 currency the learner chose to pay in; forwarded to the gateway. */
  currency?: string;
}

export interface BankTransferInstructions {
  amount_to_pay: number;
  bank_name: string;
  account_number: string;
  reference: string;
  expires_in_minutes: number;
}

export interface SubscriptionInitializeData {
  success: boolean;
  payment_method: "card" | "bank_transfer";
  group_id: number;
  checkout_url?: string; // Only for card payments
  instructions?: BankTransferInstructions; // Only for bank transfers
}

// export interface SubscriptionInitializeData {
//   success: boolean;
//   payment_method: PaymentMethod;
//   group_id: number;
//   /** Present when payment_method is "card" */
//   checkout_url?: string;
//   /** Present when payment_method is "bank_transfer" */
//   instructions?: BankTransferInstructions;
// }

export interface CredoPaymentVerificationData {
  status: "success" | "Successful" | "failed" | "Failed" | "pending" | "Pending";
  message: string;
  reference: string;
  amount?: number;
  currency?: string;
  paid_at?: string;
}

export type SubscriptionStatus = "active" | "inactive" | "pending" | "cancelled" | "expired";


export type DunningStage = "current" | "past_due" | "grace_period" | "cancelled";

export interface SubscriptionBillingStatus {
  status: DunningStage;
  ends_at: string;
  grace_period_ends_at?: string;
  next_retry_at?: string;
}


export interface PaymentHistoryItem {
  id: number;
  amount: number;
  gateway: "paystack" | "flutterwave" | "bank_transfer";
  status: "pending" | "successful" | "failed" | "expired";
  reference: string;
  paid_at: string | null;
  created_at: string;
}

export interface PaymentHistoryData {
  success: boolean;
  payments: PaymentHistoryItem[];
}

export interface SubscriptionStatusData {
  success: boolean;
  group_id: number;
  status: SubscriptionStatus;
  ends_at: string;
}

/** ---------------- Groups ---------------- */

export interface GroupMember {
  user_id: number;
  name: string;
  role: string;
}

export interface PendingGroupInvitation {
  id: number;
  email: string;
  sent_at: string;
}

export interface GroupData {
  id: number;
  owner_name: string;
  plan_name: string;
  max_slots: number;
  available_slots: number;
  active_members: GroupMember[];
  pending_invitations: PendingGroupInvitation[];
}

export interface MyGroupData {
  success: boolean;
  group: GroupData;
}

export interface SendInvitationPayload {
  email: string;
}

export interface SendInvitationResult {
  invitation_id: number;
  email: string;
  status: string;
}

export interface SendInvitationData {
  success: boolean;
  message: string;
  data: SendInvitationResult;
}

export interface InvitationInfo {
  group_owner: string;
  plan_name: string;
  email_invited: string;
}

export interface InvitationVerifyData {
  success: boolean;
  message: string;
  invitation: InvitationInfo;
}

export interface InvitationAcceptPayload {
  token: string;
}

export interface InvitationAcceptData {
  success: boolean;
  message: string;
  group_id: number;
}
