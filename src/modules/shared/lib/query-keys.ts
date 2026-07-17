/**
 * Centralized query-key factory.
 * Keeping every module's keys in one place avoids silent cache-key drift
 * (e.g. invalidating "group" in one file and "groups" in another).
 */

export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    registrationState: (reference: string) =>
      ["auth", "registration", reference] as const,
  },

  family: {
    myStudents: ["family", "students"] as const,
    myParents: ["family", "parents"] as const,
  },

  subscription: {
    plans: ["subscription", "plans"] as const,
    myGroup: ["subscription", "my-group"] as const,
    status: (groupId: number | string) =>
      ["subscription", "status", groupId] as const,
    invitationToken: (token: string) =>
      ["subscription", "invitation", token] as const,
  },

  admin: {
    plans: ["admin", "plans"] as const,
    coupons: ["admin", "coupons"] as const,
  },

  billing: {
    coupon: (code: string) => ["billing", "coupon", code] as const,
    paymentHistory: ["billing", "payments"] as const,
  },

  referral: {
    ledger: ["referral", "ledger"] as const,
    summary: ["referral", "summary"] as const,
  },
} as const;
