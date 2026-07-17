"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

/**
 * Six-box numeric OTP entry. Used by: registration verify-otp, login MFA,
 * password reset, and general OTP verification (transaction confirm).
 * Matches business rule: strict 6-digit numeric format.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = React.useMemo(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  React.useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    const joined = next.join("");
    onChange(joined);
    if (joined.length === length && !joined.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    // Handle paste-into-single-box: spread remaining chars forward
    const chars = raw.split("");
    const next = [...digits];
    chars.forEach((char, offset) => {
      const targetIndex = index + offset;
      if (targetIndex < length) next[targetIndex] = char;
    });
    const joined = next.join("");
    onChange(joined);
    const nextEmptyIndex = next.findIndex((d) => d === "");
    const focusIndex =
      nextEmptyIndex === -1
        ? length - 1
        : Math.min(index + chars.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
    if (joined.length === length && !joined.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const next = pasted.slice(0, length).split("");
    while (next.length < length) next.push("");
    onChange(next.join(""));
    const lastFilled = Math.min(pasted.length, length) - 1;
    inputRefs.current[Math.max(lastFilled, 0)]?.focus();
    if (pasted.length >= length) onComplete?.(pasted.slice(0, length));
  };

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="One-time passcode"
    >
      {digits.map((digit, index) => (
        <motion.input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.25 }}
          whileFocus={{ scale: 1.05 }}
          className={cn(
            "h-12 w-10 rounded-md border bg-background text-center text-lg font-semibold tracking-widest",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "sm:h-14 sm:w-12 sm:text-xl",
            error
              ? "border-destructive text-destructive focus:ring-destructive"
              : "border-input text-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />
      ))}
    </div>
  );
}
