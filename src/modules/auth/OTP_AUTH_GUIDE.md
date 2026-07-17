# OTP-Based Authentication Integration

## Overview

Your secondary authentication system now supports **OTP-based login** as an alternative to password authentication. This allows users to authenticate using an email/phone + one-time password (OTP) instead of remembering their password.

## Architecture

### Components

1. **NextAuth Credential Provider** (`src/auth.ts`)
   - `otp-auth` credential provider
   - Validates identity + OTP code
   - Returns NextAuth-compatible user object

2. **Dummy Implementation** (`src/modules/auth/dummy-data.ts`)
   - `dummyOtpLogin()` - Mock OTP authentication
   - Validates format and finds user in test accounts

3. **React Hooks** (`src/modules/auth/hooks/use-otp-auth.ts`)
   - `useOtpAuth()` - 2-step flow (request + verify)
   - `useOtpLogin()` - Single-step authentication

4. **UI Implementation** (`src/app/(authentication)/auth/signin/page.tsx`)
   - Toggle between password and OTP login
   - 2-step OTP flow with error handling
   - Fallback to password login

## How It Works

### Flow Diagram

```
User visits signin page
         ↓
    Choose auth method
    ↙           ↘
Password      OTP
Login         Login
(existing)    (NEW)
              ↓
          Enter email/phone
              ↓
          System sends OTP
          (dummy: logs "123456")
              ↓
          User enters OTP code
              ↓
          Call signIn("otp-auth", { identity, otp_code })
              ↓
          NextAuth triggers otp-auth provider
              ↓
          dummyOtpLogin() validates
              ↓
          Returns user object
              ↓
          Session created
              ↓
          Redirect to dashboard
```

## Usage

### 1. Via UI (Easiest)

**Visit the signin page:**
```
http://localhost:3500/auth/signin
```

**Click:** "Sign in with OTP instead"

**Steps:**
1. Enter email: `john@example.com`
2. Click "Send OTP"
3. Enter code: `123456`
4. Click "Verify OTP"
5. Redirected to dashboard

### 2. Via React Hook (In Components)

```tsx
import { useOtpAuth } from "@/modules/auth";

export function OtpLoginComponent() {
  const { requestOtp, verifyOtp, isLoading, error } = useOtpAuth({
    onSuccess: () => {
      console.log("✅ Login successful!");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("❌ Error:", error.message);
    },
  });

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    try {
      await requestOtp("john@example.com");
      // OTP sent (in dummy mode, logged to console)
    } catch (err) {
      console.error(err);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp("john@example.com", "123456");
      // User authenticated
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleRequestOtp} disabled={isLoading}>
        Send OTP
      </button>
      <button onClick={handleVerifyOtp} disabled={isLoading}>
        Verify OTP
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

### 3. Via Single-Step Hook

```tsx
import { useOtpLogin } from "@/modules/auth";

export function QuickOtpLogin() {
  const { mutateAsync: authenticate, isPending, error } = useOtpLogin();

  const handleLogin = async () => {
    try {
      await authenticate({
        identity: "john@example.com",
        otp_code: "123456",
      });
      // Success
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isPending}>
        {isPending ? "Authenticating..." : "Login with OTP"}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

### 4. Via NextAuth signIn

```tsx
import { signIn } from "next-auth/react";

// Direct NextAuth credential provider call
const result = await signIn("otp-auth", {
  identity: "john@example.com",
  otp_code: "123456",
  redirect: false, // Don't redirect, handle manually
});

if (result?.ok) {
  // Successfully authenticated
  router.push("/dashboard");
} else {
  // Error occurred
  console.error(result?.error);
}
```

## Test Accounts

Use these credentials for testing:

| Email/Phone | OTP Code |
|-------------|----------|
| john@example.com | 123456 |
| jane@example.com | 123456 |
| +2348012345678 | 123456 |

**Note:** In dummy mode, any 6-digit code works. In live API, real OTP codes will be sent via SMS/Email.

## Console Output

When OTP auth is used, check the browser console (F12) for:

```
🔐 [OTP Auth] Requesting OTP for: john@example.com
💡 [OTP Auth] Test code: 123456
🔐 [OTP Auth] Verifying OTP for: john@example.com
✅ [OTP Login] Authentication successful
```

## Error Handling

### Invalid Identity
```
Error: User not found
```

### Invalid OTP Format
```
Error: Invalid OTP code format
```

### Missing Fields
```
Error: Identity and OTP code are required
```

## File Structure

```
src/
├── auth.ts                           (MODIFIED)
│   └── Credentials provider "otp-auth"
├── app/(authentication)/auth/
│   └── signin/page.tsx               (MODIFIED)
│       ├── Password login
│       └── OTP login UI (NEW)
└── modules/auth/
    ├── dummy-data.ts                 (MODIFIED)
    │   └── dummyOtpLogin() (NEW)
    ├── hooks/
    │   └── use-otp-auth.ts           (NEW)
    │       ├── useOtpAuth()
    │       └── useOtpLogin()
    └── index.ts                      (MODIFIED)
        └── Export use-otp-auth
```

## Transitioning to Live API

When your backend API is ready:

### 1. Update Dummy Data
In `src/modules/auth/dummy-data.ts`, replace `dummyOtpLogin` with real API call:

```typescript
// BEFORE (dummy)
export function dummyOtpLogin(payload: any): LoginData {
  const { identity, otp_code } = payload;
  // ... dummy implementation
}

// AFTER (live)
export async function dummyOtpLogin(payload: any): Promise<LoginData> {
  // Call real API
  const response = await apiClient.post("/v1/otp/login", {
    identity: payload.identity,
    otp_code: payload.otp_code,
  });
  return response.data;
}
```

### 2. Update Auth Credential Provider
In `src/auth.ts`, import from `apiClient` if using real API:

```typescript
// Before (dummy direct call)
const response = dummyOtpLogin({...});

// After (API call through apiClient)
const response = await otp_auth_api.login({...});
```

### 3. Update Environment
```bash
# .env.local
NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=false
```

## Features

✅ **Two-Step Flow**
- Request OTP to identity (email/phone)
- Verify with OTP code

✅ **Error Handling**
- Invalid identity
- Invalid OTP format
- Missing required fields

✅ **Logging**
- Console logs for debugging
- [OTP Auth] prefix for easy filtering

✅ **Responsive UI**
- Mobile-friendly design
- Loading states
- Error messages
- Fallback options

✅ **NextAuth Integration**
- Uses standard credential provider
- JWT session strategy
- HttpOnly cookies
- CSRF protection

✅ **TypeScript Support**
- Full type safety
- IntelliSense support
- Type-safe hooks

## Security Considerations

1. **OTP Validation** - Must be exactly 6 digits
2. **Identity Validation** - Email or phone format
3. **Session Management** - JWT strategy with expiry
4. **Cookie Security** - HttpOnly, secure (production), SameSite
5. **Rate Limiting** - (To be implemented when live API is ready)

## Browser Console Testing

```javascript
// Import the hook
import { useOtpAuth, useOtpLogin } from "@/modules/auth"

// Two-step flow
const { requestOtp, verifyOtp } = useOtpAuth();
await requestOtp("john@example.com");
await verifyOtp("john@example.com", "123456");

// Single-step
const { mutateAsync } = useOtpLogin();
await mutateAsync({ identity: "john@example.com", otp_code: "123456" });
```

## Debugging

### Check Dummy Mode Status
```javascript
import { isDummyModeEnabled } from "@/modules/auth"
isDummyModeEnabled() // true = dummy mode active
```

### View Mock Users
```javascript
import { getMockUsers } from "@/modules/auth"
getMockUsers()
```

### Monitor API Calls
- Open DevTools (F12)
- Go to Console tab
- Look for `🔐 [OTP Auth]` logs

## FAQ

**Q: How do I enable/disable OTP auth?**  
A: It's always available. Use the UI button "Sign in with OTP instead" to switch auth methods.

**Q: Can users switch between password and OTP?**  
A: Yes! The signin page lets users toggle between both methods.

**Q: What if OTP is not received?**  
A: In dummy mode, it's logged to console. In live API, check SMS/Email provider.

**Q: Can I customize test users?**  
A: Yes! Use `addTestUser()` from `@/modules/auth` or edit `mockUsers` in `dummy-data.ts`.

**Q: Does OTP expire?**  
A: In dummy mode, no. In live API, typically 5-10 minutes.

**Q: What happens on invalid OTP?**  
A: Error message shows: "OTP verification failed"

## Next Steps

1. ✅ Test OTP login via UI
2. ✅ Verify console logs show [OTP Auth]
3. ✅ Test with multiple users
4. ✅ Test error cases (invalid OTP, missing identity)
5. ✅ When backend ready: switch to live API calls

---

**Status:** ✅ Fully implemented and ready for testing

**Integration:** Complete - works with NextAuth, dummy data, and React hooks
