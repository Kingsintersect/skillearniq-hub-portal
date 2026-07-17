"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/modules/auth";
import { detectIdentityType, maskEmail, maskPhone } from "@/modules/shared";
import AuthSidebar from "../../components/AuthSidebar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resetReference = searchParams.get("ref");
  const identity = searchParams.get("identity");

  if (!resetReference || !identity) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          This reset link is missing required information. Please request a
          new one from the{" "}
          <a href="/auth/forgot-password" className="font-medium text-primary hover:underline">
            forgot password
          </a>{" "}
          page.
        </p>
      </div>
    );
  }

  const identityLabel =
    detectIdentityType(identity) === "email"
      ? maskEmail(identity)
      : maskPhone(identity);

  return (
    <div className="min-h-screen flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
        {/* Left Sidebar Content (Hidden on Mobile) */}
        <div className="min-h-screen hidden lg:block lg:col-span-6 xl:col-span-7">
          <AuthSidebar />
        </div>

        {/* Right Side Form (Takes full width on Mobile) */}
        <div className="min-h-screen lg:col-span-6 xl:col-span-5 flex flex-col justify-center bg-primary-50">
          <ResetPasswordForm
            resetReference={resetReference}
            identityLabel={identityLabel}
            onSuccess={() => router.push("/auth/signin")}
          />

          {/* OTP Alternative */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-sm text-blue-500 hover:text-blue-600 underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
