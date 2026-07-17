"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import type { LoginData } from "../types";

export interface UseOtpAuthOptions {
    onSuccess?: (result: any) => void;
    onError?: (error: Error) => void;
}

/**
 * Hook for OTP-based authentication
 * Supports 2-step flow: identity → OTP code verification
 *
 * Usage:
 * ```tsx
 * const { requestOtp, verifyOtp, isLoading, error } = useOtpAuth();
 *
 * // Step 1: Request OTP
 * await requestOtp("john@example.com");
 *
 * // Step 2: Verify with OTP code
 * await verifyOtp("john@example.com", "123456");
 * ```
 */
export function useOtpAuth(options?: UseOtpAuthOptions) {
    /**
     * Step 1: Request OTP to be sent
     * In dummy mode: logs to console
     * In live mode: API sends OTP via SMS/Email
     */
    const requestOtpMutation = useMutation({
        mutationFn: async (identity: string) => {
            console.log(`🔐 [OTP Auth] Requesting OTP for: ${identity}`);
            console.log(`💡 [OTP Auth] Test code: 123456`);
            // Real API would call POST /v1/otp/generate
            return { identity };
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });

    /**
     * Step 2: Verify OTP code and authenticate
     * Uses NextAuth otp-auth credential provider
     */
    const verifyOtpMutation = useMutation({
        mutationFn: async ({
            identity,
            otp_code,
        }: {
            identity: string;
            otp_code: string;
        }) => {
            console.log(`🔐 [OTP Auth] Verifying OTP for: ${identity}`);

            const result = await signIn("otp-auth", {
                identity,
                otp_code,
                redirect: false,
            });

            if (!result?.ok) {
                throw new Error(result?.error || "OTP verification failed");
            }

            return result;
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });

    return {
        requestOtp: (identity: string) => requestOtpMutation.mutateAsync(identity),
        verifyOtp: (identity: string, otpCode: string) =>
            verifyOtpMutation.mutateAsync({ identity, otp_code: otpCode }),
        isLoading: requestOtpMutation.isPending || verifyOtpMutation.isPending,
        error: requestOtpMutation.error || verifyOtpMutation.error,
        requestOtpError: requestOtpMutation.error,
        verifyOtpError: verifyOtpMutation.error,
    };
}

/**
 * Hook for direct OTP-based login (one-shot)
 * Combines both steps into a single mutation
 *
 * Usage:
 * ```tsx
 * const { authenticate, isLoading, error } = useOtpLogin();
 * await authenticate("john@example.com", "123456");
 * ```
 */
export function useOtpLogin(options?: UseOtpAuthOptions) {
    return useMutation({
        mutationFn: async ({
            identity,
            otp_code,
        }: {
            identity: string;
            otp_code: string;
        }) => {
            console.log(`🔐 [OTP Login] Authenticating with OTP: ${identity}`);

            const result = await signIn("otp-auth", {
                identity,
                otp_code,
                redirect: false,
            });

            if (!result?.ok) {
                throw new Error(result?.error || "OTP login failed");
            }

            console.log(`✅ [OTP Login] Authentication successful`);
            return result;
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}
