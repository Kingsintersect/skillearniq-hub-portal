import { getApiHost } from "./lib/utils";

// APPLICATION BASE URLS
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
export const baseApiUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "") + "/api";

export const externalApiUrl = (process.env.NEXT_PUBLIC_EXTERNAL_API_DOMAIN ?? "") + "/api/v1";
export const ROOT_IMAGE_URL = (process.env.NEXT_PUBLIC_EXTERNAL_API_DOMAIN ?? "") + "/storage";
export const remoteApiHost = getApiHost(process.env.NEXT_PUBLIC_EXTERNAL_API_DOMAIN);
export const lmsLoginUrl = process.env.NEXT_PUBLIC_LMS_LOGIN_URL ?? "";

// PAYMENT GATEWAY CONFIG
export const credoPaymentBaseUrl = process.env.NEXT_PUBLIC_CREDO_PAYMENT_GATEWAY_URL ?? "https://pay.credodemo.com/v4";

// APPLICATION BASE CONFIG
export const SITE_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";
export const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_APP_SHORT_NAME ?? "UPI";
export const INSTITUTION = process.env.NEXT_PUBLIC_INSTITUTUIN ?? "UNIVERSITY";
export const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "University Portal Interface";
export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "University Portal Interface";

// COOKIE AND SESSION CONFIG
export const ssoSessionKey = process.env.NEXT_PUBLIC_SSO_SESSION_KEY ?? "";
export const loginSessionKey = process.env.NEXT_PUBLIC_LOGIN_SESSION_KEY ?? "";
export const appSessionKey = process.env.NEXT_PUBLIC_APP_SESSION_KEY ?? "";
export const sessionSecret = process.env.NEXT_PUBLIC_SESSION_SECRET ?? "";
export const sessionPassword = process.env.NEXT_PUBLIC_SESSION_PASSWORD ?? "";

// TOKENS CONFIG
export const accessTokenSecret = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? "";
export const refreshTokenSecret = process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET ?? "";

// JWT CONFIGS
export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
export const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
export const encodedKey = new TextEncoder().encode(secretKey);
export type PaymentStatus = "FULLY_PAID" | "PART_PAID" | "UNPAID" | null;

export type SessionPayload<T = Record<string, unknown>> = T & {
    issuedAt?: number;
    expiresAt: number;
};
export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    MANAGER = "MANAGER",
    PARENT = "PARENT",
}

export const APPLICATION_FEE = 37000;
export const ACCEPTANCE_FEE = 30000;
export const FULL_TUITION_FEE = 195000;


export const APP_CONFIG = {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    institution: INSTITUTION,
    version: SITE_VERSION,
    apiUrl: externalApiUrl,
    description: "Nnamdi Azikiwe University Business School Student Portal System",
    keywords: ["UNIZIK", "Business School", "Student Portal", "University", "Nigeria"],
    authors: [{ name: "UNIZIK Business School" }],
    creator: "Q-verse Limited",
    publisher: "Q-verse Limited",
    icons: [
        { url: "/logo/logo.jpg", sizes: "any" },
        { url: "/logo/logo.jpg", type: "image/jpg" },
    ],
} as const;

export const ROUTES = {
    home: '/',
    login: '/auth/signin',
    dashboard: '/dashboard',
    profile: '/profile',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
} as const;

export const QUERY_KEYS = {
    auth: {
        user: ['auth', 'user'] as const,
        profile: ['auth', 'profile'] as const,
    },
    dashboard: {
        stats: ['dashboard', 'stats'] as const,
    },
} as const;

export const LOCAL_STORAGE_KEYS = {
    accessToken: 'upi_access_token',
    refreshToken: 'upi_refresh_token',
    user: 'upi_user',
    rememberMe: 'upi_remember_me',
    parentOTP: 'false',
} as const;
