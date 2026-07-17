"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { LoginForm, LoginMfaStep } from "@/modules/auth";
import type { LoginData } from "@/modules/auth";
import type { LoginFormValues } from "@/modules/auth";
import { signIn, getSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LOCAL_STORAGE_KEYS } from "@/config";
import { UserInterface } from "@/types/global";
import { toast } from "sonner";
import AuthSidebar from "../../components/AuthSidebar";
import { AuthContainerHeader } from "../components/AuthContainerHeader";
import { LockOpen, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { OtpLoginCard } from "@/modules/auth/components/otp-login-form";

function dashboardPathForRole(role: string): string {
  switch (role) {
    case "student":
      return "/subs/subscription";
    case "parent":
      return "/subs/family";
    case "teacher":
    case "tutor":
      return "/teacher/dashboard";
    case "manager":
    case "super_admin":
      return "/admin/dashboard";
    default:
      return "/subs/subscription";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn } = useAuthContext();
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    LOCAL_STORAGE_KEYS.accessToken,
    null
  );
  const [user, setUser, removeUser] = useLocalStorage<UserInterface | null>(
    LOCAL_STORAGE_KEYS.user,
    null
  );



  const [pendingMfa, setPendingMfa] = React.useState<{
    identity: string;
    data: LoginData;
  } | null>(null);

  const [authMethod, setAuthMethod] = React.useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = React.useState<"identity" | "code">("identity");
  const [otpIdentity, setOtpIdentity] = React.useState("");
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState("");

  const navigateAfterLogin = (role: string) => {
    const next = searchParams.get("next");
    router.push(next ?? dashboardPathForRole(role));
  };

  /**
   * Handle successful authentication
   * Persists the active user across the system
   */
  const handleAuthenticationSuccess = async () => {
    try {
      // Retrieve fresh authenticated profile state
      const session = await getSession();

      if (session?.user) {
        const userData = session.user as UserInterface & { access_token: string; expires_in: number };
        setUser(userData);
        // Keep local storage keys synchronized with NextAuth tokens
        setAccessToken(userData.access_token);

        toast.success(`Welcome back, ${userData.first_name || "Learner"}!`);

        // Navigate based on user role
        const next = searchParams.get("next");
        router.push(next ?? dashboardPathForRole(userData.role));
      }
    } catch (error) {
      console.error("❌ [Auth Success] Error persisting user:", error);
      toast.error("Failed to complete login. Please try again.");
    }
  };

  /**
   * Standard password-based login
   * Uses NextAuth secondary-auth credential provider with dummy data
   */
  const handlePasswordSubmit = async (values: LoginFormValues) => {
    try {
      setOtpLoading(true);
      console.log("🔐 [Signin] Attempting password login:", values.email_or_phone_number);

      const result = await signIn("secondary-auth", {
        email: values.email_or_phone_number,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("❌ [Signin] Login failed:", result.error);
        toast.error("Invalid credentials. Please check your email/phone and password.");
        return;
      }

      if (result?.ok) {
        console.log("✅ [Signin] Authentication successful");
        await handleAuthenticationSuccess();
      }
    } catch (error: any) {
      console.error("❌ [Signin] Error:", error.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * Handle MFA verification
   */
  const handleMfaVerified = async (data: LoginData) => {
    // Get fresh session and persist user
    await handleAuthenticationSuccess();
  };

  /**
   * Step 1: Request OTP to identity
   */
  const handleOtpIdentitySubmit = async (identity: string) => {
    if (!identity) {
      setOtpError("Please enter email or phone number");
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError("");

      // In dummy mode, this just logs. In real API, it would send OTP
      console.log(`🔐 [OTP Auth] Requesting OTP for: ${identity}`);
      console.log(`💡 [OTP Auth] Use code: 123456`);

      setOtpIdentity(identity);
      setOtpStep("code");
      toast.success(`OTP sent to ${identity}`);
    } catch (error: any) {
      const msg = error.message || "Failed to request OTP";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * Step 2: Verify OTP and authenticate
   */
  const handleOtpCodeSubmit = async (otpCode: string) => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code");
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError("");

      // Use NextAuth otp-auth credential provider
      const result = await signIn("otp-auth", {
        identity: otpIdentity,
        otp_code: otpCode,
        redirect: false,
      });

      if (result?.error) {
        setOtpError(result.error);
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        // Successfully authenticated
        console.log("✅ [OTP Auth] Authentication successful");
        await handleAuthenticationSuccess();
      }
    } catch (error: any) {
      const msg = error.message || "OTP verification failed";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * Reset OTP flow
   */
  const handleOtpReset = () => {
    setOtpStep("identity");
    setOtpIdentity("");
    setOtpError("");
  };

  if (pendingMfa) {
    return (
      <LoginMfaStep
        identity={pendingMfa.identity}
        pendingLogin={pendingMfa.data}
        onVerified={handleMfaVerified}
      />
    );
  }

  // OTP Authentication UI
  if (authMethod === "otp") {
    return (

      <div className="min-h-screen flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
          {/* Left Sidebar Content (Hidden on Mobile) */}
          <div className="min-h-screen hidden lg:block lg:col-span-7 xl:col-span-8">
            <AuthSidebar />
          </div>

          {/* Right Side Form (Takes full width on Mobile) */}
          <div className="min-h-screen lg:col-span-5 xl:col-span-4 flex flex-col justify-center bg-primary-50">
            <OtpLoginCard
              otpStep={otpStep}
              otpIdentity={otpIdentity}
              otpLoading={otpLoading}
              otpError={otpError}
              onIdentitySubmit={handleOtpIdentitySubmit}
              onCodeSubmit={handleOtpCodeSubmit}
              onBackToPassword={() => {
                setAuthMethod("password");
                handleOtpReset();
              }}
              onResetStep={handleOtpReset}
            />

            {/* OTP Alternative */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMethod("otp")}
                disabled={otpLoading}
                className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Sign in with OTP instead
              </button>
            </div>
          </div>
        </div>
      </div>
      // <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      //   <div className="w-full max-w-md space-y-8">
      //     {/* Header */}
      //     <div className="text-center">
      //       <h2 className="text-2xl font-bold text-white">Sign in with OTP</h2>
      //       <p className="mt-2 text-sm text-slate-400">
      //         {otpStep === "identity"
      //           ? "Enter your email or phone number"
      //           : "Enter the 6-digit code sent to you"}
      //       </p>
      //     </div>

      //     {/* Form */}
      //     <form
      //       onSubmit={(e) => {
      //         e.preventDefault();
      //         const formData = new FormData(e.currentTarget);
      //         if (otpStep === "identity") {
      //           const identity = formData.get("identity") as string;
      //           handleOtpIdentitySubmit(identity);
      //         } else {
      //           const code = formData.get("otp_code") as string;
      //           handleOtpCodeSubmit(code);
      //         }
      //       }}
      //       className="space-y-4"
      //     >
      //       {otpStep === "identity" ? (
      //         <div>
      //           <label htmlFor="identity" className="block text-sm font-medium text-white">
      //             Email or Phone Number
      //           </label>
      //           <input
      //             id="identity"
      //             name="identity"
      //             type="text"
      //             defaultValue={otpIdentity}
      //             placeholder="john@example.com or +2348012345678"
      //             className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
      //             disabled={otpLoading}
      //           />
      //         </div>
      //       ) : (
      //         <div>
      //           <label htmlFor="otp_code" className="block text-sm font-medium text-white">
      //             OTP Code
      //           </label>
      //           <input
      //             id="otp_code"
      //             name="otp_code"
      //             type="text"
      //             maxLength={6}
      //             placeholder="123456"
      //             className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
      //             disabled={otpLoading}
      //           />
      //           <p className="mt-2 text-xs text-slate-400">
      //             Sent to: <span className="text-slate-300 font-medium">{otpIdentity}</span>
      //           </p>
      //         </div>
      //       )}

      //       {otpError && (
      //         <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
      //           {otpError}
      //         </div>
      //       )}

      //       <button
      //         type="submit"
      //         disabled={otpLoading}
      //         className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
      //       >
      //         {otpLoading ? "Processing..." : otpStep === "identity" ? "Send OTP" : "Verify OTP"}
      //       </button>
      //     </form>

      //     {/* Back to Password Login */}
      //     <div className="text-center">
      //       <button
      //         onClick={() => {
      //           setAuthMethod("password");
      //           handleOtpReset();
      //         }}
      //         className="text-sm text-blue-400 hover:text-blue-300"
      //       >
      //         Back to password login
      //       </button>
      //     </div>

      //     {/* Back to Previous Step (if on OTP code step) */}
      //     {otpStep === "code" && (
      //       <div className="text-center">
      //         <button
      //           onClick={handleOtpReset}
      //           className="text-sm text-slate-400 hover:text-slate-300"
      //         >
      //           Use different email/phone
      //         </button>
      //       </div>
      //     )}
      //   </div>
      // </div>
    );
  }

  // Standard Password Login UI
  return (
    <div className="min-h-screen flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
        {/* Left Sidebar Content (Hidden on Mobile) */}
        <div className="min-h-screen hidden lg:block lg:col-span-7 xl:col-span-8">
          <AuthSidebar />
        </div>

        {/* Right Side Form (Takes full width on Mobile) */}
        <div className="min-h-screen lg:col-span-5 xl:col-span-4 flex flex-col justify-center bg-primary-50">
          <LoginForm
            onSubmitOverride={handlePasswordSubmit}
            isPending={otpLoading}
          />

          {/* OTP Alternative */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMethod("otp")}
              disabled={otpLoading}
              className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Sign in with OTP instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// export const OtpComponent = ({box}: {box: React.ReactNode}) => {
//   return (
//     <div>page</div>
//   )
// }
