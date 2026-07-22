import { apiClient } from "@/core/client";
import type {
  AdminCouponsListData,
  CouponMutationData,
  CouponValidateData,
  CreateCouponPayload,
  CreatePlanPayload,
  ForgotPasswordData,
  ForgotPasswordPayload,
  InvitationAcceptData,
  InvitationAcceptPayload,
  InvitationVerifyData,
  LoginData,
  LoginPayload,
  MyGroupData,
  OtpGenerateData,
  OtpGeneratePayload,
  OtpVerifyPayload,
  PaymentHistoryData,
  PlanMutationData,
  PlansData,
  RegisterCompleteData,
  RegisterCompletePayload,
  RegisterInitializeData,
  RegisterInitializePayload,
  RegisterVerifyOtpData,
  RegisterVerifyOtpPayload,
  ResetPasswordPayload,
  SendInvitationData,
  SendInvitationPayload,
  SubscriptionBillingStatus,
  SubscriptionInitializeData,
  SubscriptionInitializePayload,
  SubscriptionStatusData,
  UpdateCouponPayload,
  UpdatePlanPayload,
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
  dummyValidateCoupon,
  dummyInitializeSubscription,
  dummyGetSubscriptionStatus,
  dummyGetMyGroup,
  dummyGetPlans,
  dummyCreatePlan,
  dummyUpdatePlan,
  dummyDeletePlan,
  dummyListAdminCoupons,
  dummyCreateCoupon,
  dummyUpdateCoupon,
  dummyDeleteCoupon,
  dummySendInvitation,
  dummyVerifyInvitation,
  dummyAcceptInvitation,
  dummyRevokeInvitation,
  dummyRemoveMember,
  dummyGetPaymentHistory,
  dummyGetSubscriptionBillingStatus,
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

  getPlans: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] getPlans");
      await simulateDelay(400);
      return createResponse<PlansData>(dummyGetPlans());
    }
    // apiClient returns the response body directly; wrap it so the shape matches
    // the dummy path: { data: PlansData } — keeping select(res => res.data.data) consistent.
    const raw = await apiClient.get<PlansData>("/plans") as unknown as PlansData;
    return createResponse<PlansData>(raw);
  },

  createPlan: async (payload: CreatePlanPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] createPlan", payload);
      await simulateDelay(500);
      return createResponse<PlanMutationData>(dummyCreatePlan(payload));
    }
    return apiClient.post<PlanMutationData>("/plans", payload);
  },

  updatePlan: async (id: number, payload: UpdatePlanPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] updatePlan", id, payload);
      await simulateDelay(500);
      return createResponse<PlanMutationData>(dummyUpdatePlan(id, payload));
    }
    return apiClient.put<PlanMutationData>(`/plans/${id}`, payload);
  },

  deletePlan: async (id: number) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] deletePlan", id);
      await simulateDelay(400);
      return createResponse<{ success: boolean; message: string }>(dummyDeletePlan(id));
    }
    return apiClient.delete<{ success: boolean; message: string }>(`/plans/${id}`);
  },

  listAdminCoupons: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] listAdminCoupons");
      await simulateDelay(400);
      return createResponse<AdminCouponsListData>(dummyListAdminCoupons());
    }
    return apiClient.get<AdminCouponsListData>("/admin/coupons");
  },

  createCoupon: async (payload: CreateCouponPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] createCoupon", payload);
      await simulateDelay(500);
      return createResponse<CouponMutationData>(dummyCreateCoupon(payload));
    }
    return apiClient.post<CouponMutationData>("/admin/coupons", payload);
  },

  updateCoupon: async (id: number, payload: UpdateCouponPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] updateCoupon", id, payload);
      await simulateDelay(500);
      return createResponse<CouponMutationData>(dummyUpdateCoupon(id, payload));
    }
    return apiClient.put<CouponMutationData>(`/admin/coupons/${id}`, payload);
  },

  deleteCoupon: async (id: number) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] deleteCoupon", id);
      await simulateDelay(400);
      return createResponse<{ success: boolean; message: string }>(dummyDeleteCoupon(id));
    }
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/coupons/${id}`);
  },

  validateCoupon: async (code: string) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] validateCoupon", code);
      await simulateDelay(400);
      return createResponse<CouponValidateData>(dummyValidateCoupon(code));
    }
    return apiClient.get<CouponValidateData>(`/coupons/validate/${encodeURIComponent(code)}`);
  },

  initializeSubscription: async (payload: SubscriptionInitializePayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] initializeSubscription", payload);
      await simulateDelay(600);
      return createResponse<SubscriptionInitializeData>(dummyInitializeSubscription(payload));
    }
    return apiClient.post<SubscriptionInitializeData>("/subscriptions/initialize", payload);
  },

  getPaymentHistory: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] getPaymentHistory");
      await simulateDelay(400);
      return createResponse<PaymentHistoryData>(dummyGetPaymentHistory());
    }
    return apiClient.get<PaymentHistoryData>("/subscriptions/payment-history");
  },

  // In @/modules/auth/api/index.ts

  verifyCredoPayment: async (params: {
    reference: string;
    transAmount?: string;
    transRef?: string;
  }) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] verifyCredoPayment", params);
      await simulateDelay(1000);
      return createResponse<{
        status: "success" | "failed" | "pending";
        message: string;
        reference: string;
      }>({
        status: "success",
        message: "Payment verified successfully",
        reference: params.reference,
      });
    }

    // ✅ Send all parameters to the backend
    return apiClient.get<{
      status: "success" | "failed" | "pending";
      message: string;
      reference: string;
    }>(`/subscriptions/verify`, {
      params: params
    });
  },

  getSubscriptionBillingStatus: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] getSubscriptionBillingStatus");
      await simulateDelay(400);
      return createResponse<SubscriptionBillingStatus>(dummyGetSubscriptionBillingStatus());
    }
    return apiClient.get<SubscriptionBillingStatus>("/subscriptions/billing-status");
  },

  retryPayment: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] retryPayment");
      await simulateDelay(500);
      return createResponse<{ success: boolean; message: string }>({
        success: true,
        message: "Payment retry initiated successfully",
      });
    }
    return apiClient.post<{ success: boolean; message: string }>("/subscriptions/retry-payment");
  },

  getSubscriptionStatus: async (groupId: string | number) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] getSubscriptionStatus", groupId);
      await simulateDelay(400);
      return createResponse<SubscriptionStatusData>(dummyGetSubscriptionStatus(groupId));
    }
    return apiClient.get<SubscriptionStatusData>(`/subscriptions/status/${groupId}`);
  },

  getMyGroup: async () => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] getMyGroup");
      await simulateDelay(400);
      return createResponse<MyGroupData>(dummyGetMyGroup());
    }
    return apiClient.get<MyGroupData>("/groups/my-group");
  },

  sendInvitation: async (payload: SendInvitationPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] sendInvitation", payload);
      await simulateDelay(400);
      return createResponse<SendInvitationData>(dummySendInvitation(payload));
    }
    return apiClient.post<SendInvitationData>("/groups/invitations", payload);
  },

  verifyInvitation: async (token: string) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] verifyInvitation", token);
      await simulateDelay(400);
      return createResponse<InvitationVerifyData>(dummyVerifyInvitation(token));
    }
    return apiClient.get<InvitationVerifyData>(`/groups/invitations/verify/${encodeURIComponent(token)}`);
  },

  acceptInvitation: async (payload: InvitationAcceptPayload) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] acceptInvitation", payload);
      await simulateDelay(400);
      return createResponse<InvitationAcceptData>(dummyAcceptInvitation(payload));
    }
    return apiClient.post<InvitationAcceptData>("/groups/invitations/accept", payload);
  },

  revokeInvitation: async (invitationId: number) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] revokeInvitation", invitationId);
      await simulateDelay(400);
      return createResponse<{ success: boolean; message: string }>(dummyRevokeInvitation(invitationId));
    }
    return apiClient.post<{ success: boolean; message: string }>(`/groups/invitations/${invitationId}/cancel`);
  },

  removeMember: async (userId: number) => {
    if (isDummyModeEnabled()) {
      console.log("🧪 [DUMMY MODE] removeMember", userId);
      await simulateDelay(400);
      return createResponse<{ success: boolean; message: string }>(dummyRemoveMember(userId));
    }
    return apiClient.delete<{ success: boolean; message: string }>(`/groups/members/${userId}`);
  },
};
