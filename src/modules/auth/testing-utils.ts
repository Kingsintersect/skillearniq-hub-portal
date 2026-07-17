/**
 * Authentication Testing Utilities
 * 
 * Use these utilities during development to test the auth module.
 * Can be imported from: @/modules/auth
 */

import {
    isDummyModeEnabled,
    getMockUsers,
    addTestUser,
    clearRegistrationStore,
    type AuthUser,
} from "@/modules/auth";

/**
 * Log current auth mode status
 */
export function logAuthStatus(): void {
    const isDummy = isDummyModeEnabled();
    const status = isDummy ? "🧪 DUMMY MODE" : "🔌 LIVE MODE";
    console.group(`%c${status}`, "color: #4f46e5; font-weight: bold; font-size: 14px");
    console.log("Environment:", isDummy ? "Development (Dummy Data)" : "Production (Live API)");
    console.log("Test Users Available:", getMockUsers());
    console.groupEnd();
}

/**
 * Setup test users for different scenarios
 */
export function setupTestUsers(): void {
    // Clear existing
    clearRegistrationStore();

    // Add standard test users
    addTestUser("test.student@example.com", {
        first_name: "Test",
        last_name: "Student",
        role: "student",
    });

    addTestUser("test.parent@example.com", {
        first_name: "Test",
        last_name: "Parent",
        role: "parent",
    });

    console.log("✅ Test users setup complete");
}

/**
 * Print authentication test commands
 * Paste these in browser console for quick testing
 */
export function printTestCommands(): void {
    const commands = `
╔════════════════════════════════════════════════════════════════╗
║                   AUTH TESTING QUICK COMMANDS                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ // Check current mode                                          ║
║ import { isDummyModeEnabled } from '@/modules/auth'            ║
║ isDummyModeEnabled()                                           ║
║                                                                ║
║ // View mock users                                             ║
║ import { getMockUsers } from '@/modules/auth'                  ║
║ getMockUsers()                                                 ║
║                                                                ║
║ // Add test user                                               ║
║ import { addTestUser } from '@/modules/auth'                   ║
║ addTestUser('user@test.com', {                                 ║
║   first_name: 'Test',                                          ║
║   last_name: 'User',                                           ║
║   role: 'student'                                              ║
║ })                                                             ║
║                                                                ║
║ // Log auth status                                             ║
║ import { logAuthStatus } from '@/modules/auth'                 ║
║ logAuthStatus()                                                ║
║                                                                ║
║ // Dummy OTP Code: 123456                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `;
    console.log(commands);
}

/**
 * Validate auth response structure
 */
export function validateAuthResponse(response: any, expectedType: string): boolean {
    if (!response) {
        console.error("❌ Response is empty");
        return false;
    }

    const checks = {
        login: () => {
            const hasRequiredFields =
                "success" in response &&
                "mfa_required" in response &&
                "access_token" in response &&
                "user" in response;
            if (!hasRequiredFields) {
                console.error("❌ Missing login response fields");
                return false;
            }
            if (!response.user.id || !response.user.role) {
                console.error("❌ Invalid user object in response");
                return false;
            }
            return true;
        },
        register: () => {
            const hasRequiredFields =
                "success" in response &&
                "accessToken" in response &&
                "user" in response &&
                "registrationCompleted" in response;
            if (!hasRequiredFields) {
                console.error("❌ Missing registration response fields");
                return false;
            }
            return true;
        },
        otp: () => {
            const hasRequiredFields = "success" in response && "message" in response;
            if (!hasRequiredFields) {
                console.error("❌ Missing OTP response fields");
                return false;
            }
            return true;
        },
    };

    const validator = checks[expectedType as keyof typeof checks];
    if (!validator) {
        console.error(`❌ Unknown response type: ${expectedType}`);
        return false;
    }

    const isValid = validator();
    if (isValid) {
        console.log(`✅ ${expectedType} response structure is valid`);
    }
    return isValid;
}

/**
 * Create a test registration payload
 */
export function createTestRegistrationPayload(overrides = {}) {
    const timestamp = Date.now();
    return {
        role: "student" as const,
        first_name: "John",
        last_name: "Doe",
        email_or_phone_number: `test${timestamp}@example.com`,
        password: "ValidPass123!",
        password_confirmation: "ValidPass123!",
        ...overrides,
    };
}

/**
 * Create a test login payload
 */
export function createTestLoginPayload(overrides = {}) {
    return {
        email_or_phone_number: "john@example.com",
        password: "AnyPassword123!",
        ...overrides,
    };
}

/**
 * Print test scenario guide
 */
export function printTestScenarios(): void {
    const scenarios = `
╔════════════════════════════════════════════════════════════════╗
║                    AUTH TEST SCENARIOS                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ SCENARIO 1: Complete Registration                             ║
║ ─────────────────────────────────────────────────────────────  ║
║ 1. Navigate to /auth/register                                      ║
║ 2. Select role: "student"                                     ║
║ 3. Enter: John Doe, john+123@example.com, ValidPass123!       ║
║ 4. OTP: 123456 (any 6 digits)                                 ║
║ 5. Complete: gender, nationality, optional parent            ║
║ ✅ Should redirect with access token                          ║
║                                                                ║
║ SCENARIO 2: Login as Existing User                            ║
║ ─────────────────────────────────────────────────────────────  ║
║ 1. Navigate to /signin                                        ║
║ 2. Email: john@example.com                                    ║
║ 3. Password: anything (works in dummy mode)                   ║
║ ✅ Should redirect with access token                          ║
║                                                                ║
║ SCENARIO 3: Forgot Password                                   ║
║ ─────────────────────────────────────────────────────────────  ║
║ 1. Navigate to /forgot-password                               ║
║ 2. Email: john@example.com                                    ║
║ 3. Receive reset reference (console log)                      ║
║ 4. OTP: 123456                                                ║
║ 5. New password: ValidPass456!                                ║
║ ✅ Should show success message                                ║
║                                                                ║
║ SCENARIO 4: Login with MFA (requires code change)             ║
║ ─────────────────────────────────────────────────────────────  ║
║ 1. Edit api.ts: use dummyLoginWithMfa instead                 ║
║ 2. Navigate to /signin                                        ║
║ 3. Credentials: john@example.com / anything                   ║
║ ✅ Should show MFA verification screen                        ║
║ 4. OTP: 123456                                                ║
║ ✅ Should complete login                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `;
    console.log(scenarios);
}

/**
 * Export helper for quick access
 */
export const authTestingUtils = {
    logAuthStatus,
    setupTestUsers,
    printTestCommands,
    validateAuthResponse,
    createTestRegistrationPayload,
    createTestLoginPayload,
    printTestScenarios,
};
