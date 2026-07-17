"use client";

import { create } from "zustand";
import type { RegistrableRole } from "../types";
import type { RegisterInitializeFormValues } from "../schemas";

export type RegistrationStep = "role" | "credentials" | "otp" | "profile" | "done";

interface RegistrationState {
  step: RegistrationStep;
  role: RegistrableRole | null;
  registrationReference: string | null;
  /** The raw email/phone the user submitted in step 2 — used to label the OTP destination. */
  submittedIdentity: string | null;
  emailVerificationRequired: boolean;
  phoneVerificationRequired: boolean;
  otpExpiresIn: number;
  /** Full original credentials — stored so resend can replay the exact same request. */
  initialFormValues: RegisterInitializeFormValues | null;

  setRole: (role: RegistrableRole) => void;
  setCredentialsSubmitted: (data: {
    identity: string;
    registrationReference: string;
    emailVerificationRequired: boolean;
    phoneVerificationRequired: boolean;
    expiresIn: number;
    formValues: RegisterInitializeFormValues;
  }) => void;
  setOtpVerified: () => void;
  setProfileCompleted: () => void;
  goTo: (step: RegistrationStep) => void;
  reset: () => void;
}

const initialState = {
  step: "role" as RegistrationStep,
  role: null,
  registrationReference: null,
  submittedIdentity: null,
  emailVerificationRequired: false,
  phoneVerificationRequired: false,
  otpExpiresIn: 600,
  initialFormValues: null,
};

/**
 * Drives the registration wizard (Scenario 1 in REGISTRATION_FLOW_WITH_FAMILY_INVITE):
 * role -> credentials -> otp -> profile (with optional parent-link branch) -> done.
 * `deriveStep` mirrors the pattern used in the admission-store: a single function
 * decides the active step from state, so steps can't drift out of sync.
 */
export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,

  setRole: (role) => set({ role, step: "credentials" }),

  setCredentialsSubmitted: ({
    identity,
    registrationReference,
    emailVerificationRequired,
    phoneVerificationRequired,
    expiresIn,
    formValues,
  }) =>
    set({
      submittedIdentity: identity,
      registrationReference,
      emailVerificationRequired,
      phoneVerificationRequired,
      otpExpiresIn: expiresIn,
      initialFormValues: formValues,
      step: "otp",
    }),

  setOtpVerified: () => set({ step: "profile" }),

  setProfileCompleted: () => set({ step: "done" }),

  goTo: (step) => set({ step }),

  reset: () => set(initialState),
}));
