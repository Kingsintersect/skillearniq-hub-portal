import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_SYMBOLS } from "@/lib/africa-countries";

/** Default digit count for the shared OtpInput component (matches the 6-digit business rule). */
export const OTP_LENGTH = 6;

/** shadcn/ui standard className combinator */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formats an amount as currency. Defaults to Naira; pass any ISO-4217 code
 *  (e.g. "GHS", "KES", "USD"). Uses a known display symbol where available
 *  (so DZD renders as د.ج, not "DZD"), falling back to Intl otherwise. */
export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (symbol) {
    const number = new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    // Space after multi-character symbols (e.g. "KSh 30,000.00"), none after
    // single glyphs (e.g. "₦30,000.00").
    const separator = symbol.length > 1 ? " " : "";
    return `${symbol}${separator}${number}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
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
