# Authentication Dummy Data System

This document explains how to use the dummy data system for the authentication module while the remote API is being developed.

## Quick Start

### 1. Enable Dummy Mode

Create or update `.env.local` in the project root:

```bash
NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=true
```

### 2. Test the Authentication Flow

Once enabled, all authentication API calls will use dummy data instead of making real network requests:

- **Registration** - All steps (initialize, verify OTP, complete profile)
- **Login** - Standard and MFA flows
- **OTP Generation/Verification** - For MFA, password reset, etc.
- **Password Reset** - Forgot password and reset flows

## Architecture

### How It Works

1. **Environment Check** - `isDummyModeEnabled()` checks the `NEXT_PUBLIC_USE_DUMMY_AUTH_DATA` variable
2. **Conditional Logic** - Each API endpoint wraps its call with dummy/live mode check
3. **Dummy Functions** - Mock implementations that return realistic responses
4. **Simulated Delay** - `simulateDelay()` adds network latency (~500ms) for realism

### File Structure

```
src/modules/auth/
├── api.ts              ← Modified: wraps calls with dummy mode check
├── dummy-data.ts       ← New: contains all dummy implementations
├── types.ts            ← Type definitions (unchanged)
├── schemas.ts          ← Validation schemas (unchanged)
├── hooks/              ← React hooks that use api.ts (unchanged)
└── components/         ← UI components (unchanged)
```

## Dummy Data Details

### Mock Users

Pre-configured test users available for login:

```typescript
// Student
Email: john@example.com
Phone: +2348012345678

// Parent
Email: jane@example.com

// Student
Phone: +2348012345678
```

**All have dummy passwords - any password works in dummy mode.**

### Registration Flow

```typescript
// Step 1: Initialize
POST /v1/auth/register/initialize
Payload: {
  role: "student" | "parent",
  first_name: string,
  last_name: string,
  email_or_phone_number: string,
  password: string,
  password_confirmation: string
}
Response: {
  registration_reference: email_or_phone_number,
  emailVerificationRequired: true,
  phoneVerificationRequired: false,
  expiresIn: 600
}

// Step 2: Verify OTP
POST /v1/auth/register/verify-otp
Payload: {
  registration_reference: string,
  email_or_mobile_otp: string (6 digits)
}
Response: {
  registration_reference: string,
  email_verified: true,
  mobile_verified: true
}

// Step 3: Complete Profile
POST /v1/auth/register/complete
Payload: {
  registration_reference: string,
  gender: "male" | "female",
  nationality: string,
  other_names?: string,
  parent_first_name?: string,
  parent_last_name?: string,
  parent_email?: string,
  parent_phone_number?: string
}
Response: {
  success: true,
  accessToken: string,
  user: {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    role: "student" | "parent"
  },
  registrationCompleted: true
}
```

### Login Flow

```typescript
// Standard Login
POST /v1/auth/auth/signin
Payload: {
  email_or_phone_number: string,
  password: string
}
Response: {
  success: true,
  mfa_required: false,
  access_token: string,
  user: {
    id: number,
    role: "student" | "parent"
  }
}

// MFA Login (change dummyLogin to use dummyLoginWithMfa)
Response: {
  success: true,
  mfa_required: true,  // ← This triggers MFA step
  access_token: string,
  user: { ... }
}
```

### OTP Endpoints

```typescript
// Generate OTP
POST /v1/otp/generate
Payload: {
  use_case: "email_verification" | "mobile_verification" | "login_mfa" | "password_reset" | "transaction_confirm",
  identity: string,
  channel: "sms" | "email" | "push"
}
Response: {
  identity: string
}
Console Output: [DUMMY] Generated OTP for {use_case} via {channel} to {identity}
Dummy OTP Code: 123456

// Verify OTP
POST /v1/otp/verify
Payload: {
  identity: string,
  otp_code: string (6 digits)
}
Response: {
  success: true,
  message: "OTP validated and consumed successfully."
}
```

### Password Reset

```typescript
// Forgot Password (Step 1)
POST /v1/password/forgot
Payload: {
  identity: string
}
Response: {
  reset_reference: string
}

// Reset Password (Step 2)
POST /v1/password/reset
Payload: {
  reset_reference: string,
  otp_code: string (6 digits),
  password: string,
  password_confirmation: string
}
Response: {
  success: true,
  message: "Password updated successfully..."
}
```

## Debugging

### Console Output

When dummy mode is enabled, all API calls will log:

```
🧪 [DUMMY MODE] registerInitialize { ... }
🧪 [DUMMY MODE] login { ... }
🧪 [DUMMY MODE] verifyOtp { ... }
```

This makes it easy to track API flow during development.

### Useful Functions

Import from `@/modules/auth`:

```typescript
import {
  isDummyModeEnabled,
  getMockUsers,
  addTestUser,
  clearRegistrationStore,
} from "@/modules/auth";

// Check if dummy mode is active
if (isDummyModeEnabled()) {
  console.log("Using dummy data");
}

// View all available test users
console.log(getMockUsers());
// {
//   "john@example.com": { id: 1, first_name: "John", ... },
//   "jane@example.com": { id: 2, first_name: "Jane", ... }
// }

// Add a custom test user
addTestUser("newuser@example.com", {
  first_name: "Test",
  last_name: "User",
  role: "student"
});

// Clear registration data between tests
clearRegistrationStore();
```

## Transitioning to Live API

When your backend API is ready:

### Step 1: Update Environment Variable

```bash
# In .env.local
NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=false
```

### Step 2: Uncomment Live API Calls

In `src/modules/auth/api.ts`, uncomment the real API calls:

```typescript
// BEFORE (dummy mode)
if (isDummyModeEnabled()) {
  // ... dummy implementation
}
throw new Error("Set NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=true...");

// AFTER (live mode)
// if (isDummyModeEnabled()) {
//   // ... dummy implementation
// }
return apiClient.post<RegisterInitializeData>(
  `${BASE}/register/initialize`,
  payload
);
```

### Step 3: Test Live Integration

All UI components and hooks will automatically work with the live API since they're completely decoupled.

## Key Implementation Details

### Types Compatibility

- Dummy functions return the exact same types as the real API
- Response wrapper ensures consistency: `{ data: <ResponseType> }`

### Error Handling

Dummy functions throw errors for invalid inputs:

```typescript
// Invalid OTP (not 6 digits)
dummyRegisterVerifyOtp({
  registration_reference: "john@example.com",
  email_or_mobile_otp: "12345" // Error: Invalid OTP format
});

// Missing user
dummyLogin({
  email_or_phone_number: "unknown@example.com",
  password: "anything"
// Error: User not found
});
```

### State Management

- **Client-side**: Dummy data uses in-memory `registrationStore`
- **No Persistence**: Data is lost on page refresh (by design)
- **Useful for Testing**: Clean slate on each reload

## Testing Scenarios

### Scenario 1: Complete Registration Flow

```
1. Select role: "student"
2. Enter credentials:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "ValidPass123!"
3. Verify OTP: "123456" (any 6 digits work)
4. Complete Profile:
   - Gender: "male"
   - Nationality: "nigerian"
   - Optional: Add parent details
5. ✅ Registration Complete - receive accessToken + user
```

### Scenario 2: Login as Existing User

```
1. Email: "john@example.com"
2. Password: "anything" (works in dummy mode)
3. ✅ Login Complete - receive accessToken + user
```

### Scenario 3: Password Reset

```
1. Forgot Password: "john@example.com"
2. Receive: reset_reference (e.g., "PR-1720046123456")
3. Reset with: reset_reference, OTP code "123456", new password
4. ✅ Password Updated
```

## Notes

- 🧪 Dummy mode is **development-only**
- 🔄 Simulated network delay (~500ms) keeps UI behavior realistic
- 📝 All OTP codes are hardcoded as "123456"
- 🚫 No data persists across page reloads
- 🔐 Passwords don't matter in dummy mode
- 📊 Console logs all API calls for debugging

## Support

If you need to:

- **Add more test users**: Use `addTestUser()` or edit `mockUsers` in `dummy-data.ts`
- **Modify response shapes**: Edit the corresponding dummy function in `dummy-data.ts`
- **Change simulated delay**: Adjust `simulateDelay()` parameter in api.ts
- **Test MFA flow**: Replace `dummyLogin` with `dummyLoginWithMfa` in api.ts
