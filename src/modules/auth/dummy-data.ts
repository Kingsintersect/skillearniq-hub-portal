/**
 * Dummy data for authentication API endpoints.
 * Use this until the remote API is ready.
 * Toggle with USE_DUMMY_AUTH_DATA environment variable.
 */

import type {
    AuthUser,
    ForgotPasswordData,
    LoginData,
    OtpGenerateData,
    RegisterCompleteData,
    RegisterInitializeData,
    RegisterVerifyOtpData,
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
