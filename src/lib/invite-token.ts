/**
 * Pending group-invite token persistence.
 *
 * When an invited person who does NOT yet have an account opens their invite
 * link, we stash the token before sending them off to create an account. Once
 * registration finishes we read it back and return them to the accept-invite
 * page to finalise joining the group.
 *
 * A cookie (not localStorage) is used because it auto-expires on its own — the
 * max-age mirrors the invitation token's 72-hour server-side TTL, so a stale
 * pending token can never outlive the invitation it points at.
 */

const INVITE_TOKEN_COOKIE = "skillearniq.pending_invite";
const MAX_AGE_SECONDS = 72 * 60 * 60; // 72h — matches the invitation token TTL.

export function storeInviteToken(token: string): void {
  if (typeof document === "undefined" || !token) return;
  document.cookie = `${INVITE_TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function getStoredInviteToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${INVITE_TOKEN_COOKIE}=`));
  if (!entry) return null;
  const value = entry.slice(entry.indexOf("=") + 1);
  return value ? decodeURIComponent(value) : null;
}

export function clearInviteToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${INVITE_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
