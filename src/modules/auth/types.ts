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

/** ---------------- Coupons ---------------- */

export interface CouponValidateData {
  valid: boolean;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  description?: string;
}

/** ---------------- Subscriptions ---------------- */

export interface SubscriptionInitializePayload {
  plan_id: string | number;
  coupon_code?: string;
}

export interface SubscriptionInitializeData {
  subscription_reference: string;
  amount: number;
  payment_url?: string;
}

export type SubscriptionStatus = "active" | "inactive" | "pending" | "cancelled" | "expired";

export interface SubscriptionStatusData {
  status: SubscriptionStatus;
  group_id: string | number;
  plan_id: string | number;
  expires_at?: string;
}

/** ---------------- Groups ---------------- */

export interface GroupData {
  id: string | number;
  name: string;
  role: SystemRole;
  members_count?: number;
}

export interface GroupInvitation {
  id: string | number;
  token: string;
  email?: string;
  phone?: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
}

export interface InvitationVerifyData {
  valid: boolean;
  invitation: GroupInvitation;
  group: GroupData;
}

export interface InvitationAcceptPayload {
  token: string;
}

export interface InvitationAcceptData {
  success: boolean;
  message: string;
}
