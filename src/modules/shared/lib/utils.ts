import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Default digit count for the shared OtpInput component (matches the 6-digit business rule). */
export const OTP_LENGTH = 6;

/** shadcn/ui standard className combinator */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formats kobo-safe decimal amounts as Naira currency, matching the docs' ₦ figures. */
export function formatCurrency(
  amount: number,
  currency: "NGN" | "USD" = "NGN"
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", options).format(date);
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Masks an email for display, e.g. jo***@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? ""}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

/** Masks a phone number for display, keeping the last 4 digits visible. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return phone;
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

/** Returns whichever of email/phone the identity string looks like. */
export function detectIdentityType(value: string): "email" | "phone" {
  return value.includes("@") ? "email" : "phone";
}

/** Clamp helper used by capacity meters / progress bars. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
