"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/modules/shared";
import type { ApiError } from "@/types/auth";
import { dashboardPathForRole } from "@/lib/dashboard-path";
import { clearInviteToken, storeInviteToken } from "@/lib/invite-token";
import {
  isEmailRegistered,
  useAcceptInvitation,
  useVerifyInvitationToken,
  useVerifyRegistration,
} from "../hooks/use-subscription";

export interface InvitationAcceptPageProps {
  token: string;
}

type CheckState = "idle" | "pending" | "registered" | "unregistered" | "error";

/**
 * Orchestrates joining a subscription group from an invite link.
 *
 * The token is always verified first. What happens next depends on whether the
 * visitor is signed in:
 *   • Signed in   → show "Accept invitation" straight away (they can join now).
 *   • Signed out  → check the invited email against
 *     POST /groups/invitations/verify-registration to decide the path:
 *       – Registered   → sign in, then return here to accept.
 *       – No account   → create an account, then return here to accept.
 *
 * The registration check only runs while signed out — that's the only time its
 * answer matters. Once authenticated (e.g. straight after registering) there's
 * nothing left to resolve, so we never block the accept CTA on it.
 */
export function InvitationAcceptPage({ token }: InvitationAcceptPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const role = (session?.user as { role?: string } | undefined)?.role;

  const {
    data: invitation,
    isLoading,
    isError,
    error,
  } = useVerifyInvitationToken(token);
  const verifyRegistrationMutation = useVerifyRegistration();
  const acceptMutation = useAcceptInvitation();

  const [checkState, setCheckState] = React.useState<CheckState>("idle");
  const [notice, setNotice] = React.useState<string | null>(null);
  const checkStarted = React.useRef(false);

  const goToDashboard = React.useCallback(() => {
    clearInviteToken();
    router.push(dashboardPathForRole(role));
  }, [role, router]);

  const finaliseMembership = React.useCallback(() => {
    acceptMutation.mutate(
      { token },
      { onSuccess: () => setTimeout(goToDashboard, 900) }
    );
  }, [acceptMutation, goToDashboard, token]);

  const goToCreateAccount = React.useCallback(() => {
    storeInviteToken(token);
    setNotice("Let's set up your account first…");
    router.push("/auth/register");
  }, [router, token]);

  const goToSignIn = React.useCallback(() => {
    storeInviteToken(token);
    setNotice("Taking you to sign in…");
    router.push(
      `/auth/signin?next=${encodeURIComponent(
        `/accept-invite/${encodeURIComponent(token)}`
      )}`
    );
  }, [router, token]);

  // Registration check — only while signed out (that's the only time the
  // answer decides anything). Runs once the token has verified.
  React.useEffect(() => {
    if (checkStarted.current || !invitation || isAuthenticated) return;
    checkStarted.current = true;
    setCheckState("pending");
    verifyRegistrationMutation.mutate(invitation.email_invited, {
      onSuccess: (response) =>
        setCheckState(
          isEmailRegistered(response.data) ? "registered" : "unregistered"
        ),
      onError: (err) => {
        // The endpoint is the authority on registration. When it answers that
        // the email has no account — whether via a 404 or a 401 ("no such
        // registered user") — treat it as "not registered".
        const statusCode = (err as unknown as ApiError)?.statusCode;
        setCheckState(
          statusCode === 401 || statusCode === 404 ? "unregistered" : "error"
        );
      },
    });
  }, [invitation, isAuthenticated, verifyRegistrationMutation]);

  const isRedirecting = Boolean(notice);
  const isFinalising = acceptMutation.isPending || acceptMutation.isSuccess;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="space-y-5 p-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Checking your invitation…
              </p>
            )}

            {isError && (
              <div className="space-y-2">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                <p className="text-sm font-medium text-foreground">
                  This invitation isn&apos;t valid
                </p>
                <p className="text-sm text-muted-foreground">
                  {getErrorMessage(error)} It may have expired or already been
                  used.
                </p>
              </div>
            )}

            {invitation && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {invitation.group_owner} added you to their{" "}
                    {invitation.plan_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Invited as {invitation.email_invited}
                  </p>
                </div>

                {/* Accepting / joined */}
                {isFinalising ? (
                  <div className="space-y-2">
                    {acceptMutation.isSuccess ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2"
                      >
                        <CheckCircle2 className="mx-auto h-8 w-8 text-secondary-600" />
                        <p className="text-sm font-medium text-foreground">
                          You&apos;ve joined the group
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Taking you to your dashboard…
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary-600" />
                        <p className="text-sm text-muted-foreground">
                          Finalizing your membership…
                        </p>
                      </>
                    )}
                  </div>
                ) : acceptMutation.isError ? (
                  <div className="space-y-2">
                    <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium text-foreground">
                      We couldn&apos;t finalize your membership
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getErrorMessage(acceptMutation.error)}
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Button onClick={finaliseMembership}>Try again</Button>
                      <Button variant="outline" onClick={goToDashboard}>
                        Go to my dashboard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Signed in → accept right away, no account check needed */}
                    {isAuthenticated && (
                      <Button
                        className="w-full"
                        onClick={finaliseMembership}
                        disabled={isRedirecting}
                      >
                        Accept invitation
                      </Button>
                    )}

                    {/* Signed out, still resolving the account status */}
                    {!isAuthenticated &&
                      (checkState === "idle" || checkState === "pending") && (
                        <Button className="w-full" disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking your account…
                        </Button>
                      )}

                    {/* Registered but signed out → sign in, then finalise */}
                    {checkState === "registered" && !isAuthenticated && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          You already have an account with this email. Sign in
                          to accept the invitation.
                        </p>
                        <Button
                          className="w-full"
                          onClick={goToSignIn}
                          disabled={isRedirecting}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign in to accept
                        </Button>
                      </div>
                    )}

                    {/* No account yet → create one, then finalise */}
                    {checkState === "unregistered" && !isAuthenticated && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          You don&apos;t have an account yet. Create one to join{" "}
                          {invitation.group_owner}&apos;s group.
                        </p>
                        <Button
                          className="w-full"
                          onClick={goToCreateAccount}
                          disabled={isRedirecting}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create account to join
                        </Button>
                      </div>
                    )}

                    {/* Check failed and signed out → let them choose */}
                    {checkState === "error" && !isAuthenticated && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          We couldn&apos;t tell whether you already have an
                          account. Create one to join, or sign in if you already
                          have an account.
                        </p>
                        <Button
                          className="w-full"
                          onClick={goToCreateAccount}
                          disabled={isRedirecting}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create an account
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={goToSignIn}
                          disabled={isRedirecting}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          I already have an account
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
