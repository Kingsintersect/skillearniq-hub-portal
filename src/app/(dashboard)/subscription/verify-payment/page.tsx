"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/modules/auth/api";
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

type VerificationStatus = "initializing" | "verifying" | "success" | "failed";

function VerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<VerificationStatus>("initializing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(3);
    const [isRetrying, setIsRetrying] = useState<boolean>(false);

    // Extract all Credo callback parameters
    const reference = searchParams.get("reference") || searchParams.get("transRef");
    const transAmount = searchParams.get("transAmount");
    const transRef = searchParams.get("transRef");
    const processorFee = searchParams.get("processorFee");
    const errorMessageParam = searchParams.get("errorMessage");
    const currency = searchParams.get("currency");
    const gateway = searchParams.get("gateway");
    const statusParam = searchParams.get("status");

    // Core verification function
    const verifyPayment = useCallback(async () => {
        if (!reference) {
            setStatus("failed");
            setErrorMessage("No payment reference was found in the redirect URL.");
            return;
        }

        try {
            setStatus("verifying");
            setIsRetrying(false);

            // Pass all Credo parameters to the backend
            const response = await authApi.verifyCredoPayment({
                reference,
                transAmount: transAmount || undefined,
                transRef: transRef || undefined,
            });

            // ✅ Check response - handle both "success" and "Successful" (case insensitive)
            const responseStatus = response.data?.status?.toLowerCase();

            if (responseStatus === "success" || responseStatus === "successful") {
                setStatus("success");

                // Auto-redirect to subscription page after 3 seconds
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            router.push("/subscription");
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(interval);
            } else if (responseStatus === "pending") {
                // Still pending, retry after 3 seconds
                setTimeout(() => {
                    verifyPayment();
                }, 3000);
            } else {
                setStatus("failed");
                setErrorMessage(
                    response.data?.message || "Payment verification failed on the server."
                );
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setStatus("failed");
            setErrorMessage(
                error?.message || "We encountered a network error while verifying your payment."
            );
        }
    }, [reference, transAmount, transRef, processorFee, errorMessageParam, currency, gateway, statusParam, router]);

    // Initial verification on mount
    useEffect(() => {
        verifyPayment();
    }, [verifyPayment]);

    // Handle retry without page reload
    const handleRetry = useCallback(() => {
        setIsRetrying(true);
        setErrorMessage("");
        verifyPayment();
    }, [verifyPayment]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">

                {/* Status Image / Icon Banner */}
                <div className="mb-6 flex justify-center">
                    {status === "verifying" && (
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                    {status === "success" && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                    )}
                    {status === "failed" && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <XCircle className="h-10 w-10" />
                        </div>
                    )}
                </div>

                {/* Content Dynamic Text */}
                {status === "verifying" && (
                    <>
                        <h2 className="text-xl font-semibold text-slate-800">Verifying Your Payment</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {isRetrying
                                ? "Retrying verification..."
                                : "Please do not refresh this page or click the back button. We are securely communicating with Credo to verify your transaction."
                            }
                        </p>
                        {reference && (
                            <p className="mt-2 text-xs text-slate-400">
                                Reference: {reference}
                            </p>
                        )}
                        {transAmount && currency && (
                            <p className="mt-1 text-xs text-slate-400">
                                Amount: {currency} {parseFloat(transAmount).toFixed(2)}
                            </p>
                        )}
                        {isRetrying && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-600">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Attempting to verify again...</span>
                            </div>
                        )}
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-xl font-semibold text-slate-800">Payment Successful!</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Your subscription is active and your workspace setup is complete.
                        </p>
                        {transAmount && currency && (
                            <p className="mt-1 text-xs text-slate-400">
                                Amount paid: {currency} {parseFloat(transAmount).toFixed(2)}
                            </p>
                        )}
                        <div className="mt-6 rounded-lg bg-emerald-50/50 p-3 text-xs text-emerald-700">
                            Redirecting you to your group dashboard in {countdown}s...
                        </div>
                        <button
                            onClick={() => router.push("/subscription")}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800"
                        >
                            Go to Dashboard <ArrowRight className="h-4 w-4" />
                        </button>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <h2 className="text-xl font-semibold text-slate-800">Verification Failed</h2>
                        <p className="mt-2 text-sm text-red-600 bg-red-50/50 rounded-lg p-3 text-left border border-red-100">
                            {errorMessage || "Payment verification failed. Please try again."}
                        </p>
                        {errorMessageParam && errorMessageParam !== "AUTHENTICATION_SUCCESSFUL" && (
                            <p className="mt-2 text-xs text-slate-500">
                                Credo error: {errorMessageParam}
                            </p>
                        )}
                        <p className="mt-3 text-xs text-slate-400">
                            If your bank account was debited, please do not panic. Our webhook processor will retroactively update your profile shortly.
                        </p>
                        <div className="mt-6 flex flex-col gap-2">
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isRetrying ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Retrying...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        Retry Verification
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => router.push("/subscription")}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                            >
                                Back to Billing Page
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span>Securely processed by Credo Payment Systems</span>
            </div>
        </div>
    );
}

// Wrap the content block inside a Suspense Boundary to support Next.js App Router static compilation safely
export default function VerifyPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500">Preparing verification environment...</p>
                </div>
            }
        >
            <VerificationContent />
        </Suspense>
    );
}


