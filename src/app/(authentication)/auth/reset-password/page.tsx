"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { ResetPasswordForm } from "../../__auth/reset-password/components/resetPasswordForm";
import AuthSidebar from "../../components/AuthSidebar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
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

  return (
    <div className="min-h-screen flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
        {/* Left Sidebar Content (Hidden on Mobile) */}
        <div className="min-h-screen hidden lg:block lg:col-span-6 xl:col-span-7">
          <AuthSidebar />
        </div>

        {/* Right Side Form (Takes full width on Mobile) */}
        <div className="auth-scope min-h-screen lg:col-span-6 xl:col-span-5 flex flex-col justify-center bg-secondary-50 dark:bg-gray-950 px-6 lg:px-16 py-16">
          <div className="w-full max-w-md mx-auto rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-black/5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Set a new password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Resetting the password for {email}.
                </p>
              </div>
            </div>
            <ResetPasswordForm />

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/auth/signin")}
                className="text-sm font-medium text-accent hover:text-accent-600 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
