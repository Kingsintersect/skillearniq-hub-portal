"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authApi } from "@/modules/auth/api";
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationStatus = "initializing" | "verifying" | "success" | "failed";

function VerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<VerificationStatus>("initializing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(3);
    const [isRetrying, setIsRetrying] = useState<boolean>(false);

    const reference = searchParams.get("reference") || searchParams.get("transRef");
    const transAmount = searchParams.get("transAmount");
    const transRef = searchParams.get("transRef");
    const processorFee = searchParams.get("processorFee");
    const errorMessageParam = searchParams.get("errorMessage");
    const currency = searchParams.get("currency");
    const gateway = searchParams.get("gateway");
    const statusParam = searchParams.get("status");

    const verifyPayment = useCallback(async () => {
        if (!reference) {
            setStatus("failed");
            setErrorMessage("No payment reference was found in the redirect URL.");
            return;
        }

        try {
            setStatus("verifying");
            setIsRetrying(false);

            const response = await authApi.verifyCredoPayment({
                reference,
                transAmount: transAmount || undefined,
                transRef: transRef || undefined,
            });

            const responseStatus = response.data?.status?.toLowerCase();

            if (responseStatus === "success" || responseStatus === "successful") {
                setStatus("success");
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
                setTimeout(() => {
                    verifyPayment();
                }, 3000);
            } else {
                setStatus("failed");
                setErrorMessage(response.data?.message || "Payment verification failed on the server.");
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setStatus("failed");
            setErrorMessage(error?.message || "We encountered a network error while verifying your payment.");
        }
    }, [reference, transAmount, transRef, processorFee, errorMessageParam, currency, gateway, statusParam, router]);

    useEffect(() => {
        verifyPayment();
    }, [verifyPayment]);

    const handleRetry = useCallback(() => {
        setIsRetrying(true);
        setErrorMessage("");
        verifyPayment();
    }, [verifyPayment]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
                <div className="mb-6 flex justify-center">
                    {status === "verifying" && (
                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-400/15 dark:text-primary-300"
                        >
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </motion.div>
                    )}
                    {status === "success" && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300"
                        >
                            <CheckCircle2 className="h-10 w-10" />
                        </motion.div>
                    )}
                    {status === "failed" && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <XCircle className="h-10 w-10" />
                        </div>
                    )}
                </div>

                {status === "verifying" && (
                    <>
                        <h2 className="text-xl font-semibold text-foreground">Verifying your payment</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {isRetrying
                                ? "Retrying verification…"
                                : "Please don't refresh this page or click back. We're securely confirming your transaction."}
                        </p>
                        {reference && <p className="mt-2 text-xs text-muted-foreground/70">Reference: {reference}</p>}
                        {transAmount && currency && (
                            <p className="mt-1 text-xs text-muted-foreground/70">
                                Amount: {currency} {parseFloat(transAmount).toFixed(2)}
                            </p>
                        )}
                        {isRetrying && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-600 dark:text-primary-300">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Attempting to verify again…</span>
                            </div>
                        )}
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-xl font-semibold text-foreground">Payment successful!</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your subscription is active and your workspace setup is complete.
                        </p>
                        {transAmount && currency && (
                            <p className="mt-1 text-xs text-muted-foreground/70">
                                Amount paid: {currency} {parseFloat(transAmount).toFixed(2)}
                            </p>
                        )}
                        <div className="mt-6 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                            Redirecting you to your dashboard in {countdown}s…
                        </div>
                        <Button
                            onClick={() => router.push("/subscription")}
                            className="mt-6 w-full gap-2 bg-accent-500 text-white hover:bg-accent-600"
                            size="lg"
                        >
                            Go to dashboard <ArrowRight className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <h2 className="text-xl font-semibold text-foreground">Verification failed</h2>
                        <p className="mt-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-left text-sm text-destructive">
                            {errorMessage || "Payment verification failed. Please try again."}
                        </p>
                        {errorMessageParam && errorMessageParam !== "AUTHENTICATION_SUCCESSFUL" && (
                            <p className="mt-2 text-xs text-muted-foreground">Gateway error: {errorMessageParam}</p>
                        )}
                        <p className="mt-3 text-xs text-muted-foreground">
                            If your bank account was debited, don't worry — our webhook processor will update your account
                            automatically shortly.
                        </p>
                        <div className="mt-6 flex flex-col gap-2">
                            <Button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="w-full gap-2 bg-primary-600 text-primary-foreground hover:bg-primary-700"
                            >
                                {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                {isRetrying ? "Retrying…" : "Retry verification"}
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/subscription")}>
                                Back to billing page
                            </Button>
                        </div>
                    </>
                )}
            </motion.div>

            <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Securely processed by Credo Payment Systems</span>
            </div>
        </div>
    );
}

export default function VerifyPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">Preparing verification environment…</p>
                </div>
            }
        >
            <VerificationContent />
        </Suspense>
    );
}