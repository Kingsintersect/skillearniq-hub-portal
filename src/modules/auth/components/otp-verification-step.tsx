"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OtpInput,
  useCountdown,
  getErrorMessage,
  OTP_LENGTH,
} from "@/modules/shared";
import { OTP_EXPIRY_SECONDS, OTP_MAX_ATTEMPTS } from "../types";

export interface OtpVerificationStepProps {
  /** Where the code was sent — shown for context (masked upstream by caller). */
  destinationLabel: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isPending: boolean;
  isResending: boolean;
  serverError?: unknown;
  /** Seconds until current code expires; defaults to the 10-minute business rule. */
  expiresIn?: number;
}

/**
 * Business rule 1.3: code expires in 10 minutes, max 3 attempts before a
 * 15-minute lock. This component tracks attempts client-side for UX and
 * still defers to the server as the source of truth on lockout.
 */
export function OtpVerificationStep({
  destinationLabel,
  onVerify,
  onResend,
  isPending,
  isResending,
  serverError,
  expiresIn = OTP_EXPIRY_SECONDS,
}: OtpVerificationStepProps) {
  const [code, setCode] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const { secondsLeft, formatted, isExpired, restart } = useCountdown(expiresIn);

  const isLockedOut = attempts >= OTP_MAX_ATTEMPTS;

  const handleComplete = (value: string) => {
    if (isLockedOut || isExpired) return;
    onVerify(value);
  };

  React.useEffect(() => {
    if (serverError) {
      setAttempts((a) => a + 1);
      setCode("");
    }
  }, [serverError]);

  const handleResend = () => {
    setCode("");
    setAttempts(0);
    restart(OTP_EXPIRY_SECONDS);
    onResend();
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground">
        Enter the {OTP_LENGTH}-digit code sent to{" "}
        <span className="font-medium text-foreground">{destinationLabel}</span>
      </p>

      <OtpInput
        length={OTP_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
        disabled={isPending || isLockedOut || isExpired}
        error={Boolean(serverError)}
      />

      {Boolean(serverError) && (
        <p className="text-center text-sm text-destructive">
          {getErrorMessage(serverError)}
        </p>
      )}

      {isLockedOut && (
        <p className="text-center text-sm text-destructive">
          Too many failed attempts. This identity is locked for 15 minutes.
        </p>
      )}

      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        {isExpired ? (
          <span>Code expired</span>
        ) : (
          <span>Code expires in {formatted}</span>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending || (!isExpired && secondsLeft > 540)}
        >
          {isResending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          Resend code
        </Button>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isPending || code.length < OTP_LENGTH || isLockedOut || isExpired}
        onClick={() => handleComplete(code)}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify
      </Button>
    </div>
  );
}
