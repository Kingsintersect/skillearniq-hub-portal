"use client";

import { AnimatePresence } from "framer-motion";
import {
  useRegisterComplete,
  useRegisterInitialize,
  useRegisterVerifyOtp,
} from "../hooks/use-auth-mutations";
import { useRegistrationStore } from "../hooks/use-registration-store";
import { detectIdentityType, maskEmail, maskPhone } from "@/modules/shared";
import { AuthLayout, StepTransition } from "./auth-layout";
import { RegistrationStepIndicator } from "./registration-step-indicator";
import { RoleSelectStep } from "./role-select-step";
import { CredentialsStep } from "./credentials-step";
import { OtpVerificationStep } from "./otp-verification-step";
import { ProfileCompletionStep } from "./profile-completion-step";
import type {
  RegisterCompleteFormValues,
  RegisterInitializeFormValues,
} from "../schemas";
import type { RegisterCompleteData } from "../types";

export interface RegistrationWizardProps {
  /** Called once registration fully completes, with the access token + user. */
  onComplete: (result: RegisterCompleteData) => void;
}

export function RegistrationWizard({ onComplete }: RegistrationWizardProps) {
  const {
    step,
    role,
    registrationReference,
    submittedIdentity,
    otpExpiresIn,
    initialFormValues,
    setRole,
    setCredentialsSubmitted,
    setOtpVerified,
    goTo,
  } = useRegistrationStore();

  const initializeMutation = useRegisterInitialize();
  const verifyOtpMutation = useRegisterVerifyOtp();
  const completeMutation = useRegisterComplete();

  const handleCredentialsSubmit = (values: RegisterInitializeFormValues) => {
    initializeMutation.mutate(values, {
      onSuccess: (response) => {
        setCredentialsSubmitted({
          identity: values.email_or_phone_number,
          registrationReference: response.data.registration_reference,
          emailVerificationRequired: response.data.emailVerificationRequired,
          phoneVerificationRequired: response.data.phoneVerificationRequired,
          expiresIn: response.data.expiresIn,
          formValues: values,
        });
      },
    });
  };

  const handleOtpVerify = (otpCode: string) => {
    if (!registrationReference) return;
    verifyOtpMutation.mutate(
      {
        registration_reference: registrationReference,
        email_or_mobile_otp: otpCode,
      },
      { onSuccess: () => setOtpVerified() }
    );
  };

  const handleResendOtp = () => {
    if (!initialFormValues) return;
    initializeMutation.mutate(initialFormValues, {
      onSuccess: (response) => {
        setCredentialsSubmitted({
          identity: initialFormValues.email_or_phone_number,
          registrationReference: response.data.registration_reference,
          emailVerificationRequired: response.data.emailVerificationRequired,
          phoneVerificationRequired: response.data.phoneVerificationRequired,
          expiresIn: response.data.expiresIn,
          formValues: initialFormValues,
        });
      },
    });
  };

  const handleProfileSubmit = (values: RegisterCompleteFormValues) => {
    if (!registrationReference) return;
    completeMutation.mutate(
      {
        registration_reference: registrationReference,
        gender: values.gender,
        nationality: values.nationality,
        other_names: values.other_names,
        ...(values.wantsParentLink
          ? {
            parent_first_name: values.parent_first_name,
            parent_last_name: values.parent_last_name,
            parent_email: values.parent_email,
            parent_phone_number: values.parent_phone_number,
          }
          : {}),
      },
      {
        onSuccess: (response) => onComplete(response.data),
      }
    );
  };

  const destinationLabel = submittedIdentity
    ? detectIdentityType(submittedIdentity) === "email"
      ? maskEmail(submittedIdentity)
      : maskPhone(submittedIdentity)
    : "";

  return (
    <AuthLayout
      title=""
      description=""
    >
      <RegistrationStepIndicator currentStep={step} />
      <AnimatePresence mode="wait">
        {step === "role" && (
          <StepTransition stepKey="role">
            <RoleSelectStep selected={role} onSelect={setRole} />
          </StepTransition>
        )}

        {step === "credentials" && role && (
          <StepTransition stepKey="credentials">
            <CredentialsStep
              role={role}
              onSubmit={handleCredentialsSubmit}
              isPending={initializeMutation.isPending}
              serverError={initializeMutation.error}
              onBack={() => goTo("role")}
            />
          </StepTransition>
        )}

        {step === "otp" && (
          <StepTransition stepKey="otp">
            <OtpVerificationStep
              destinationLabel={destinationLabel}
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
              isPending={verifyOtpMutation.isPending}
              isResending={initializeMutation.isPending}
              serverError={verifyOtpMutation.error}
              expiresIn={otpExpiresIn}
            />
          </StepTransition>
        )}

        {step === "profile" && role && (
          <StepTransition stepKey="profile">
            <ProfileCompletionStep
              role={role}
              onSubmit={handleProfileSubmit}
              isPending={completeMutation.isPending}
              serverError={completeMutation.error}
            />
          </StepTransition>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
