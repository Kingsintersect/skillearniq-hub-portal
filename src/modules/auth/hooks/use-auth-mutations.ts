"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  OtpGeneratePayload,
  OtpVerifyPayload,
  RegisterCompletePayload,
  RegisterInitializePayload,
  RegisterVerifyOtpPayload,
  ResetPasswordPayload,
} from "../types";

export function useRegisterInitialize() {
  return useMutation({
    mutationFn: (payload: RegisterInitializePayload) =>
      authApi.registerInitialize(payload),
  });
}

export function useRegisterVerifyOtp() {
  return useMutation({
    mutationFn: (payload: RegisterVerifyOtpPayload) =>
      authApi.registerVerifyOtp(payload),
  });
}

export function useRegisterComplete() {
  return useMutation({
    mutationFn: (payload: RegisterCompletePayload) =>
      authApi.registerComplete(payload),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
  });
}

/** Generic OTP dispatch — used for resend actions across every OTP screen. */
export function useGenerateOtp() {
  return useMutation({
    mutationFn: (payload: OtpGeneratePayload) => authApi.generateOtp(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) => authApi.verifyOtp(payload),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
}
