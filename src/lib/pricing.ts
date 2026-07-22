import { formatCurrency } from "@/modules/shared";

/**
 * Display-only conversion from the base NGN plan price to a local currency.
 *
 * Rates are RELATIVE TO 1 NGN (i.e. `localAmount = ngnAmount * rate`). Only NGN
 * is seeded — every other currency intentionally falls back to showing the base
 * NGN price until you set a real rate here. This keeps us from ever displaying
 * an invented/guessed price.
 *
 * TODO(pricing): set agreed rates below, or better, move per-country pricing to
 * the backend `/plans` response and read `plan.currency`/`plan.price` directly.
 *
 * Example once you have real numbers:
 *   GHS: 0.0098, KES: 0.084, ZAR: 0.012, USD: 0.00065,
 */
export const NGN_RATES: Record<string, number> = {
    NGN: 1,
};

/** Returns the amount converted to `currency`, or null if no rate is configured. */
export function convertFromNgn(amountNgn: number, currency: string): number | null {
    const rate = NGN_RATES[currency];
    if (!rate) return null;
    return Math.round(amountNgn * rate);
}

/**
 * Formats an amount in the given currency's symbol/format.
 *
 * If a conversion rate is configured in `NGN_RATES`, the base NGN amount is
 * converted first; otherwise the same numeric amount is shown with the target
 * currency's symbol. This is display only — the real amount charged is computed
 * server-side from the plan + chosen currency at checkout.
 */
export function formatLocalizedPrice(amountNgn: number, currency: string): string {
    const converted = convertFromNgn(amountNgn, currency);
    return formatCurrency(converted ?? amountNgn, currency);
}
