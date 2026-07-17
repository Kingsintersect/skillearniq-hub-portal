/**
 * Dummy data for authentication API endpoints.
 * Use this until the remote API is ready.
 * Toggle with USE_DUMMY_AUTH_DATA environment variable.
 */

import type {
    AdminCouponData,
    AdminCouponsListData,
    AuthUser,
    CouponMutationData,
    CouponValidateData,
    ForgotPasswordData,
    InvitationAcceptData,
    InvitationVerifyData,
    LoginData,
    MyGroupData,
    OtpGenerateData,
    PaymentHistoryData,
    PlanMutationData,
    PlansData,
    RegisterCompleteData,
    RegisterInitializeData,
    RegisterVerifyOtpData,
    SendInvitationData,
    SubscriptionBillingStatus,
    SubscriptionInitializeData,
    SubscriptionStatusData,
} from "./types";

/** Mock user data for testing */
export const mockUsers: Record<string, AuthUser> = {
    "john@example.com": {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        role: "student",
    },
    "jane@example.com": {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        role: "parent",
    },
    "+2348012345678": {
        id: 3,
        first_name: "Ahmed",
        last_name: "Hassan",
        email: "ahmed@example.com",
        role: "student",
    },
};

/** Simulated registration data store (in-memory) */
const registrationStore: Record<
    string,
    {
        first_name: string;
        last_name: string;
        email_or_phone_number: string;
        password: string;
        role: "student" | "parent";
        emailVerified: boolean;
        phoneVerified: boolean;
    }
> = {};

/**
 * Dummy response for registration initialize
 * Simulates Step 1 of registration
 */
export function dummyRegisterInitialize(payload: any): RegisterInitializeData {
    const reference = payload.email_or_phone_number;

    // Store registration data temporarily
    registrationStore[reference] = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email_or_phone_number: payload.email_or_phone_number,
        password: payload.password,
        role: payload.role,
        emailVerified: false,
        phoneVerified: false,
    };

    return {
        registration_reference: reference,
        emailVerificationRequired: true,
        phoneVerificationRequired: false,
        expiresIn: 600, // 10 minutes
    };
}

/**
 * Dummy response for OTP verification during registration
 * Simulates Step 2 of registration
 */
export function dummyRegisterVerifyOtp(payload: any): RegisterVerifyOtpData {
    const { registration_reference, email_or_mobile_otp } = payload;

    // Any 6-digit OTP is valid in dummy mode
    if (!email_or_mobile_otp || email_or_mobile_otp.length !== 6) {
        throw new Error("Invalid OTP format");
    }

    // Mark as verified in our store
    if (registrationStore[registration_reference]) {
        registrationStore[registration_reference].emailVerified = true;
        registrationStore[registration_reference].phoneVerified = true;
    }

    return {
        registration_reference,
        email_verified: true,
        mobile_verified: true,
    };
}

/**
 * Dummy response for registration complete
 * Simulates Step 3 of registration
 */
export function dummyRegisterComplete(payload: any): RegisterCompleteData {
    const { registration_reference, gender, nationality } = payload;
    const regData = registrationStore[registration_reference];

    if (!regData) {
        throw new Error("Registration reference not found");
    }

    // Create mock user
    const mockUserId = Object.keys(mockUsers).length + 1;
    const user: AuthUser = {
        id: mockUserId,
        first_name: regData.first_name,
        last_name: regData.last_name,
        email: regData.email_or_phone_number,
        role: regData.role,
    };

    // If parent link was provided, create parent relationship
    if (payload.parent_email) {
        console.log(
            `[DUMMY] Creating parent relationship: ${payload.parent_email}`
        );
    }

    return {
        success: true,
        accessToken: `token_${mockUserId}_${Date.now()}`,
        user,
        registrationCompleted: true,
    };
}

/**
 * Dummy response for login
 * Simulates the login endpoint
 */
export function dummyLogin(payload: any): LoginData {
    const { email_or_phone_number, password } = payload;

    // Accept any password in dummy mode, just validate username exists
    const user = mockUsers[email_or_phone_number];

    if (!user) {
        throw new Error("User not found");
    }

    return {
        success: true,
        mfa_required: false, // Can be toggled to test MFA flow
        access_token: `token_${user.id}_${Date.now()}`,
        user,
    };
}

/**
 * Dummy response for MFA login (if mfa_required: true)
 * Can be used for testing MFA flow
 */
export function dummyLoginWithMfa(payload: any): LoginData {
    const { email_or_phone_number, password } = payload;
    const user = mockUsers[email_or_phone_number];

    if (!user) {
        throw new Error("User not found");
    }

    return {
        success: true,
        mfa_required: true, // Triggers MFA step
        access_token: `temp_token_${user.id}_${Date.now()}`,
        user,
    };
}

/**
 * Dummy response for OTP generation
 * Used for login MFA, password reset, etc.
 */
export function dummyGenerateOtp(payload: any): OtpGenerateData {
    const { use_case, identity, channel } = payload;

    console.log(
        `[DUMMY] Generated OTP for ${use_case} via ${channel} to ${identity}`
    );
    console.log(`[DUMMY] Use OTP code: 123456`);

    return {
        identity,
    };
}

/**
 * Dummy response for OTP verification
 * Accepts any 6-digit code in dummy mode
 */
export function dummyVerifyOtp(payload: any): { success: boolean; message: string } {
    const { identity, otp_code } = payload;

    if (!otp_code || otp_code.length !== 6) {
        throw new Error("Invalid OTP code");
    }

    console.log(`[DUMMY] Verified OTP for ${identity}`);

    return {
        success: true,
        message: "OTP validated and consumed successfully.",
    };
}

/**
 * Dummy response for OTP-based login
 * Alternative authentication using identity + OTP code
 */
export function dummyOtpLogin(payload: any): LoginData {
    const { identity, otp_code } = payload;

    // Validate OTP format (6 digits)
    if (!otp_code || otp_code.length !== 6 || !/^\d{6}$/.test(otp_code)) {
        throw new Error("Invalid OTP code format");
    }

    // Find user by email or phone
    const user = mockUsers[identity];

    if (!user) {
        throw new Error("User not found");
    }

    console.log(`[DUMMY] OTP login successful for ${identity}`);

    return {
        success: true,
        mfa_required: false,
        access_token: `token_${user.id}_${Date.now()}`,
        user,
    };
}

/**
 * Dummy response for forgot password
 * Initiates password reset flow
 */
export function dummyForgotPassword(payload: any): ForgotPasswordData {
    const { identity } = payload;

    console.log(`[DUMMY] Password reset initiated for ${identity}`);

    return {
        reset_reference: `PR-${Date.now()}`,
    };
}

/**
 * Dummy response for reset password
 * Completes password reset flow
 */
export function dummyResetPassword(
    payload: any
): { success: boolean; message: string } {
    const { reset_reference, otp_code, password } = payload;

    if (!reset_reference || !otp_code || !password) {
        throw new Error("Missing required fields");
    }

    console.log(`[DUMMY] Password reset completed for reference: ${reset_reference}`);

    return {
        success: true,
        message:
            "Password updated successfully. All legacy active sessions have been structurally invalidated.",
    };
}

/**
 * Simulate API delay to mimic real network latency
 */
export async function simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Toggle to enable/disable dummy data mode
 * Checks NEXT_PUBLIC_USE_DUMMY_AUTH_DATA environment variable
 * Set in .env.local or .env.development
 */
export const isDummyModeEnabled = (): boolean => {
    // Works on both client and server because NEXT_PUBLIC_ prefix
    // makes it available at runtime in the browser
    try {
        return process.env.NEXT_PUBLIC_USE_DUMMY_AUTH_DATA === "true";
    } catch (error) {
        console.warn("[Auth] Could not read NEXT_PUBLIC_USE_DUMMY_AUTH_DATA");
        return false;
    }
};

/** --------------- Admin Coupons --------------- */

const dummyCouponStore: AdminCouponData[] = [
    {
        id: 1,
        code: "SUMMER50",
        type: "percentage",
        value: "50",
        expires_at: "2026-12-31",
        is_active: true,
        created_at: "2026-01-01T00:00:00.000Z", // 🛠️ Added mock timestamp
        updated_at: "2026-01-01T00:00:00.000Z"  // 🛠️ Added mock timestamp
    },
    {
        id: 2,
        code: "FLAT2000",
        type: "fixed",
        value: "2000",
        expires_at: null,
        is_active: true,
        created_at: "2026-01-01T00:00:00.000Z", // 🛠️ Added mock timestamp
        updated_at: "2026-01-01T00:00:00.000Z"  // 🛠️ Added mock timestamp
    },
];

export function dummyListAdminCoupons(): AdminCouponsListData {
    return { success: true, coupons: [...dummyCouponStore] };
}

export function dummyCreateCoupon(payload: any): CouponMutationData {
    const currentTimestamp = new Date().toISOString(); // 🛠️ Generate current time string

    const coupon: AdminCouponData = {
        id: Date.now(),
        code: payload.code.toUpperCase(),
        type: payload.type,
        value: String(payload.value),
        expires_at: payload.expires_at ?? null,
        is_active: true,
        created_at: currentTimestamp, // 🛠️ Assign here
        updated_at: currentTimestamp, // 🛠️ Assign here
    };
    dummyCouponStore.push(coupon);
    return { success: true, coupon };
}

// export function dummyListAdminCoupons(): AdminCouponsListData {
//     return { success: true, coupons: [...dummyCouponStore] };
// }

// export function dummyCreateCoupon(payload: any): CouponMutationData {
//     const coupon: AdminCouponData = {
//         id: Date.now(),
//         code: payload.code.toUpperCase(),
//         type: payload.type,
//         value: Number(payload.value),
//         expires_at: payload.expires_at ?? null,
//         is_active: true,
//     };
//     dummyCouponStore.push(coupon);
//     return { success: true, coupon };
// }

export function dummyUpdateCoupon(id: number, payload: any): CouponMutationData {
    const idx = dummyCouponStore.findIndex((c) => c.id === id);
    const base = dummyCouponStore[idx] ?? { id, code: "UPDATED", type: "fixed", value: 0, expires_at: null, is_active: true };
    const updated: AdminCouponData = { ...base, ...payload, value: Number(payload.value ?? base.value) };
    if (idx >= 0) dummyCouponStore[idx] = updated;
    return { success: true, coupon: updated };
}

export function dummyDeleteCoupon(_id: number): { success: boolean; message: string } {
    return { success: true, message: "Coupon deleted successfully." };
}

/** --------------- Plans --------------- */

export function dummyGetPlans(): PlansData {
    return {
        success: true,
        data: [
            { id: 1, name: "Individual Plan", price: 5000, max_members: 1, is_active: true },
            { id: 2, name: "Family Plan (2–3 members)", price: 8000, max_members: 3, is_active: true },
            { id: 3, name: "Family Plan (4–5 members)", price: 12000, max_members: 5, is_active: true },
        ],
    };
}

export function dummyCreatePlan(payload: any): PlanMutationData {
    const plan: import("./types").PlanData = {
        id: Date.now(),
        name: payload.name,
        price: payload.price,
        max_members: Number(payload.max_members),
        is_active: payload.is_active ?? true,
    };
    console.log("[DUMMY] Created plan:", plan);
    return { success: true, plan };
}

export function dummyUpdatePlan(id: number, payload: any): PlanMutationData {
    const plan: import("./types").PlanData = {
        id,
        name: payload.name ?? "Updated Plan",
        price: payload.price ?? 5000,
        max_members: Number(payload.max_members ?? 1),
        is_active: payload.is_active ?? true,
    };
    console.log("[DUMMY] Updated plan:", plan);
    return { success: true, plan };
}

export function dummyDeletePlan(_id: number): { success: boolean; message: string } {
    return { success: true, message: "Plan deleted successfully." };
}

export function dummyRevokeInvitation(_invitationId: number): { success: boolean; message: string } {
    return { success: true, message: "Invitation revoked." };
}

export function dummyRemoveMember(_userId: number): { success: boolean; message: string } {
    return { success: true, message: "Member removed from group." };
}

/** --------------- Coupon --------------- */

export function dummyValidateCoupon(code: string): CouponValidateData {
    const valid: Record<string, { type: "percentage" | "fixed"; value: number }> = {
        SUMMER50: { type: "percentage", value: 50 },
        FLAT2000: { type: "fixed", value: 2000 },
    };
    const match = valid[code.toUpperCase()];
    return {
        success: true,
        coupon: {
            code: code.toUpperCase(),
            type: match?.type ?? "percentage",
            value: match?.value ?? 0,
            is_valid: !!match,
        },
    };
}

/** --------------- Subscriptions --------------- */

export function dummyInitializeSubscription(payload: any): SubscriptionInitializeData {
    const groupId = Math.floor(Math.random() * 900) + 100;
    if (payload.payment_method === "bank_transfer") {
        return {
            success: true,
            payment_method: "bank_transfer",
            group_id: groupId,
            instructions: {
                amount_to_pay: 15000.0,
                bank_name: "Wema Bank (via Paystack)",
                account_number: "9923847110",
                reference: `TX-SUB-${Date.now()}`,
                expires_in_minutes: 30,
            },
        };
    }
    return {
        success: true,
        payment_method: "card",
        group_id: groupId,
        checkout_url: "https://checkout.paystack.com/dummy_checkout",
    };
}

export function dummyGetSubscriptionStatus(groupId: string | number): SubscriptionStatusData {
    const ends = new Date();
    ends.setDate(ends.getDate() + 30);
    return {
        success: true,
        group_id: Number(groupId),
        status: "active",
        ends_at: ends.toISOString().replace("T", " ").slice(0, 19),
    };
}

export function dummyGetPaymentHistory(): PaymentHistoryData {
    return {
        success: true,
        payments: [
            {
                id: 1,
                amount: 15000.0,
                gateway: "bank_transfer",
                status: "successful",
                reference: "TX-SUB-9081234",
                paid_at: new Date(Date.now() - 86400000 * 2).toISOString().replace("T", " ").slice(0, 19),
                created_at: new Date(Date.now() - 86400000 * 2).toISOString().replace("T", " ").slice(0, 19),
            },
            {
                id: 2,
                amount: 15000.0,
                gateway: "paystack",
                status: "successful",
                reference: "TX-SUB-9081235",
                paid_at: new Date(Date.now() - 86400000 * 30).toISOString().replace("T", " ").slice(0, 19),
                created_at: new Date(Date.now() - 86400000 * 30).toISOString().replace("T", " ").slice(0, 19),
            },
            {
                id: 3,
                amount: 15000.0,
                gateway: "paystack",
                status: "pending",
                reference: "TX-SUB-9081236",
                paid_at: null,
                created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
            },
        ],
    };
}

export function dummyGetSubscriptionBillingStatus(): SubscriptionBillingStatus {
    const ends = new Date();
    ends.setDate(ends.getDate() + 30);

    return {
        status: "current",
        ends_at: ends.toISOString().replace("T", " ").slice(0, 19),
    };
}

/** --------------- Groups --------------- */

export function dummyGetMyGroup(): MyGroupData {
    return {
        success: true,
        group: {
            id: 102,
            owner_name: "John Doe",
            plan_name: "Family Plan",
            max_slots: 5,
            available_slots: 3,
            active_members: [
                { user_id: 14, name: "John Doe", role: "student" },
                { user_id: 15, name: "Jane Doe", role: "student" },
            ],
            pending_invitations: [
                { id: 1, email: "friend@example.com", sent_at: "2026-06-25" },
            ],
        },
    };
}

export function dummySendInvitation(payload: any): SendInvitationData {
    return {
        success: true,
        message: "Invitation sent successfully.",
        data: {
            invitation_id: Math.floor(Math.random() * 1000) + 1,
            email: payload.email,
            status: "pending",
        },
    };
}

export function dummyVerifyInvitation(_token: string): InvitationVerifyData {
    return {
        success: true,
        message: "Token valid.",
        invitation: {
            group_owner: "John Doe",
            plan_name: "Family Plan",
            email_invited: "friend@example.com",
        },
    };
}

export function dummyAcceptInvitation(_payload: any): InvitationAcceptData {
    return {
        success: true,
        message: "You have successfully joined the subscription group.",
        group_id: 102,
    };
}

/**
 * Add a test user to the mock users
 */
export function addTestUser(
    email: string,
    user: Partial<AuthUser> & { first_name: string; last_name: string }
): void {
    mockUsers[email] = {
        id: Object.keys(mockUsers).length + 1,
        email,
        ...user,
    } as AuthUser;
}

/**
 * Get all mock users (useful for debugging)
 */
export function getMockUsers() {
    return mockUsers;
}

/**
 * Clear registration store (useful between tests)
 */
export function clearRegistrationStore(): void {
    Object.keys(registrationStore).forEach((key) => delete registrationStore[key]);
}
