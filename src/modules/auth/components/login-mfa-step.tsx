"use client";

import * as React from "react";
import { useVerifyOtp, useGenerateOtp } from "../hooks/use-auth-mutations";
import { OtpVerificationStep } from "./otp-verification-step";
import { AuthLayout } from "./auth-layout";
import type { LoginData } from "../types";

export interface LoginMfaStepProps {
  identity: string;
  pendingLogin: LoginData;
  onVerified: (data: LoginData) => void;
}

/**
 * Shown after /auth/signin responds with mfa_required: true.
 * Reuses the generic OTP engine (use_case: "login_mfa").
 */
export function LoginMfaStep({
  identity,
  pendingLogin,
  onVerified,
}: LoginMfaStepProps) {
  const verifyOtpMutation = useVerifyOtp();
  const resendMutation = useGenerateOtp();
  const [destination] = React.useState(identity);

  const handleVerify = (otpCode: string) => {
    verifyOtpMutation.mutate(
      { identity, otp_code: otpCode },
      { onSuccess: () => onVerified(pendingLogin) }
    );
  };

  const handleResend = () => {
    resendMutation.mutate({
      use_case: "login_mfa",
      identity,
      channel: identity.includes("@") ? "email" : "sms",
    });
  };

  return (
    <AuthLayout
      title="Verify it's you"
      description="Extra security step for your account"
    >
      <OtpVerificationStep
        destinationLabel={destination}
        onVerify={handleVerify}
        onResend={handleResend}
        isPending={verifyOtpMutation.isPending}
        isResending={resendMutation.isPending}
        serverError={verifyOtpMutation.error}
      />
    </AuthLayout>
  );
}
