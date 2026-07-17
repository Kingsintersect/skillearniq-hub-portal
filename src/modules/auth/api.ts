import { apiClient } from "@/core/client";
import type {
  CouponValidateData,
  ForgotPasswordData,
  ForgotPasswordPayload,
  GroupData,
  InvitationAcceptData,
  InvitationAcceptPayload,
  InvitationVerifyData,
  GroupInvitation,
  LoginData,
  LoginPayload,
  OtpGenerateData,
  OtpGeneratePayload,
  OtpVerifyPayload,
  RegisterCompleteData,
  RegisterCompletePayload,
  RegisterInitializeData,
  RegisterInitializePayload,
  RegisterVerifyOtpData,
  RegisterVerifyOtpPayload,
  ResetPasswordPayload,
  SubscriptionInitializeData,
  SubscriptionInitializePayload,
  SubscriptionStatusData,
} from "./types";
import {
  isDummyModeEnabled,
  simulateDelay,
  dummyRegisterInitialize,
  dummyRegisterVerifyOtp,
  dummyRegisterComplete,
  dummyLogin,
  dummyGenerateOtp,
  dummyVerifyOtp,
  dummyForgotPassword,
  dummyResetPassword,
} from "./dummy-data";

const BASE = "/v1/auth";

/**
 * Wrapper for API responses to handle both real and dummy data
 * Real API returns AxiosResponse, dummy data is direct
 */
const createResponse = <T,>(data: T) => ({
  data,
});

export const authApi = {
  registerInitialize: async (payload: RegisterInitializePayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] registerInitialize", payload);
      await simulateDelay(500);
      return createResponse<RegisterInitializeData>(
        dummyRegisterInitialize(payload)
      );
    }
    return apiClient.post<RegisterInitializeData>("/auth/register/initialize", payload);
  },

  registerVerifyOtp: async (payload: RegisterVerifyOtpPayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] registerVerifyOtp", payload);
      await simulateDelay(500);
      return createResponse<RegisterVerifyOtpData>(
        dummyRegisterVerifyOtp(payload)
      );
    }
    return apiClient.post<RegisterVerifyOtpData>("/auth/register/verify-otp", payload);
  },

  registerComplete: async (payload: RegisterCompletePayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] registerComplete", payload);
      await simulateDelay(500);
      return createResponse<RegisterCompleteData>(
        dummyRegisterComplete(payload)
      );
    }
    return apiClient.post<RegisterCompleteData>("/auth/register/complete", payload);
  },

  login: async (payload: LoginPayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] login", payload);
      await simulateDelay(500);
      return createResponse<LoginData>(dummyLogin(payload));
    }
    return apiClient.post<LoginData>("/auth/login", payload);
  },

  generateOtp: async (payload: OtpGeneratePayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] generateOtp", payload);
      await simulateDelay(500);
      return createResponse<OtpGenerateData>(dummyGenerateOtp(payload));
    }
    return apiClient.post<OtpGenerateData>("/auth/request-otp", payload);
  },

  verifyOtp: async (payload: OtpVerifyPayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] verifyOtp", payload);
      await simulateDelay(500);
      return createResponse<{ success: boolean; message: string }>(
        dummyVerifyOtp(payload)
      );
    }
    return apiClient.post<{ success: boolean; message: string }>(
      "/auth/verify-otp",
      payload
    );
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] forgotPassword", payload);
      await simulateDelay(500);
      return createResponse<ForgotPasswordData>(
        dummyForgotPassword(payload)
      );
    }
    return apiClient.post<ForgotPasswordData>("/password/forgot", payload);
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    if (isDummyModeEnabled()) {
      // DUMMY MODE: Comment out real API, use dummy data
      console.log("🧪 [DUMMY MODE] resetPassword", payload);
      await simulateDelay(500);
      return createResponse<{ success: boolean; message: string }>(
        dummyResetPassword(payload)
      );
    }
    return apiClient.post<{ success: boolean; message: string }>("/password/reset", payload);
  },

  validateCoupon: (code: string) =>
    apiClient.get<CouponValidateData>(`/coupons/validate/${encodeURIComponent(code)}`),

  initializeSubscription: (payload: SubscriptionInitializePayload) =>
    apiClient.post<SubscriptionInitializeData>("/subscriptions/initialize", payload),

  getSubscriptionStatus: (groupId: string | number) =>
    apiClient.get<SubscriptionStatusData>(`/subscriptions/status/${groupId}`),

  getMyGroup: () =>
    apiClient.get<GroupData>("/groups/my-group"),

  getGroupInvitations: () =>
    apiClient.get<GroupInvitation[]>("/groups/invitations"),

  verifyInvitation: (token: string) =>
    apiClient.get<InvitationVerifyData>(`/groups/invitations/verify/${encodeURIComponent(token)}`),

  acceptInvitation: (payload: InvitationAcceptPayload) =>
    apiClient.post<InvitationAcceptData>("/groups/invitations/accept", payload),
};
