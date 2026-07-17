# 🧪 Dummy Authentication System - Quick Start

## ✅ Already Configured

Your authentication module is set up with dummy data! No additional setup needed.

## 🚀 Get Started (3 steps)

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. Visit Authentication Pages
- **Sign In**: [http://localhost:3500/auth/signin](http://localhost:3500/auth/signin)
- **Register**: [http://localhost:3500/auth/register](http://localhost:3500/auth/register)
- **Forgot Password**: [http://localhost:3500/auth/forgot-password](http://localhost:3500/auth/forgot-password)

### 3. Test with Mock Users

#### Login as Student
```
Email: john@example.com
Password: (anything works)
```

#### Login as Parent
```
Email: jane@example.com
Password: (anything works)
```

#### Login with Phone
```
Phone: +2348012345678
Password: (anything works)
```

## 💡 What's in Dummy Mode?

✅ Registration (3 steps: credentials, OTP verify, profile complete)  
✅ Login (standard and MFA flows)  
✅ OTP Generation & Verification  
✅ Password Reset Flow  
✅ All responses match real API structure  

## 🔍 Debugging

### View Console Logs
Open browser DevTools (F12) → Console tab

You'll see:
```
🧪 [DUMMY MODE] login { email_or_phone_number: "john@example.com", password: "..." }
🧪 [DUMMY MODE] verifyOtp { identity: "+2348012345678", otp_code: "123456" }
```

### OTP Code
When prompted for OTP, use: **123456**

### Quick Test Commands
Paste in browser console:
```javascript
// Check if dummy mode is active
import { isDummyModeEnabled } from '@/modules/auth'
isDummyModeEnabled() // Should return: true

// View all test users
import { getMockUsers } from '@/modules/auth'
getMockUsers()

// Log auth status
import { logAuthStatus } from '@/modules/auth'
logAuthStatus()
```

## 📝 Test Scenarios

### Scenario 1: Register New Student
1. Go to `/auth/register`
2. Click "Student"
3. Fill: Name, Email, Password (ValidPass123!)
4. Enter OTP: `123456`
5. Complete profile (gender, nationality)
6. ✅ You'll get redirected with access token

### Scenario 2: Login
1. Go to `/auth/signin`
2. Email: `john@example.com`
3. Password: `anything`
4. ✅ You'll get redirected

### Scenario 3: Password Reset
1. Go to `/auth/forgot-password`
2. Email: `john@example.com`
3. Use OTP: `123456`
4. New password: `NewValidPass456!`
5. ✅ Password updated

## ⚙️ Configuration

**Current Setting**: 
```
NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=true
```

Location: `.env.local`

To switch to live API (when ready):
```
NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=false
```

## 📚 Detailed Documentation

Full guide with API specs and implementation details:
📖 [DUMMY_DATA_GUIDE.md](./DUMMY_DATA_GUIDE.md)

## 🔗 File Structure

```
src/modules/auth/
├── api.ts              ← Wrapped with dummy mode logic
├── dummy-data.ts       ← Mock implementations (NEW)
├── testing-utils.ts    ← Testing helpers (NEW)
├── types.ts            ← Type definitions
├── schemas.ts          ← Validation schemas
├── hooks/              ← React hooks (unchanged)
└── components/         ← UI components (unchanged)
```

## ⚡ Key Features

- 🧪 All 8 auth endpoints covered (register, login, OTP, password reset)
- 🎯 Realistic API response structures
- 📊 Console logging for easy debugging
- ⏱️ Simulated network delay (~500ms)
- 🔄 Easy transition to live API
- 🧹 No external dependencies added

## 🔑 Test User Accounts

| Email | Role | Password |
|-------|------|----------|
| john@example.com | Student | anything |
| jane@example.com | Parent | anything |
| +2348012345678 | Student | anything |

## ❓ FAQ

**Q: Why isn't the OTP working?**  
A: Use exactly 6 digits: `123456` (or any 6 digits)

**Q: Can I add my own test users?**  
A: Yes! See [DUMMY_DATA_GUIDE.md](./DUMMY_DATA_GUIDE.md#useful-functions)

**Q: What happens when I refresh the page?**  
A: All data is cleared (in-memory only). You'll need to login/register again.

**Q: How do I switch to live API?**  
A: Set `NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=false` in `.env.local`

**Q: Do passwords need to match the strong password requirement?**  
A: In dummy mode, no. In live API mode, yes: min 8 chars, 1 upper, 1 lower, 1 number, 1 symbol.

## 📞 Support

For issues or questions about the dummy auth setup:
1. Check [DUMMY_DATA_GUIDE.md](./DUMMY_DATA_GUIDE.md) for detailed docs
2. Review console logs (F12 → Console)
3. Check that `.env.local` has `NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=true`

## 🎯 Next Steps

1. ✅ Test all authentication flows
2. ✅ Verify UI/UX works as expected
3. ✅ Once backend API ready: set `NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=false`
4. ✅ Uncomment real API calls in `api.ts`
5. ✅ Test with live API

Happy coding! 🚀
