"use client";

import { useEffect, useState } from "react";
import {
    AFRICAN_COUNTRIES,
    getAfricanCountry,
    type AfricanCountry,
} from "./africa-countries";

const COUNTRY_KEY = "skillearniq.country";

/** Home-market default when no country has been saved yet. */
export const DEFAULT_COUNTRY: AfricanCountry =
    getAfricanCountry("Nigeria") ?? AFRICAN_COUNTRIES[0];

/** Persist the user's chosen country name (call this at registration). */
export function setUserCountry(name: string): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(COUNTRY_KEY, name);
    } catch {
        /* ignore storage errors */
    }
}

/** Read the raw stored country name (SSR-safe). */
export function getUserCountryName(): string | null {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage.getItem(COUNTRY_KEY);
    } catch {
        return null;
    }
}

/**
 * Reactive access to the user's country (and thus currency) for pricing.
 * Falls back to Nigeria/NGN until a country is stored.
 */
export function useUserCountry(): AfricanCountry {
    const [country, setCountry] = useState<AfricanCountry>(DEFAULT_COUNTRY);

    useEffect(() => {
        const stored = getAfricanCountry(getUserCountryName() ?? "");
        if (stored) setCountry(stored);
    }, []);

    return country;
}
