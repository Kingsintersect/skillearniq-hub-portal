"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/modules/shared";
import {
  useAcceptInvitation,
  useVerifyInvitationToken,
} from "../hooks/use-subscription";

export interface InvitationAcceptPageProps {
  token: string;
  /** Whether the visitor is already signed in (per Scenario 2 step 5: "OR logs in if account exists"). */
  isAuthenticated: boolean;
  onAccepted: (groupId: number) => void;
  onRequiresAuth: () => void;
}

/**
 * Mirrors REGISTRATION_FLOW_WITH_FAMILY_INVITE Scenario 2 and
 * USER_EXPERIENCE "Screen 3: Invitation Email" — token expires after
 * 72 hours per Rule 3.3.
 */
export function InvitationAcceptPage({
  token,
  isAuthenticated,
  onAccepted,
  onRequiresAuth,
}: InvitationAcceptPageProps) {
  const { data: invitation, isLoading, isError, error } =
    useVerifyInvitationToken(token);
  const acceptMutation = useAcceptInvitation();

  const handleAccept = () => {
    acceptMutation.mutate(
      { token },
      { onSuccess: (response) => onAccepted(response.data.group_id) }
    );
  };

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
                  This invitation isn't valid
                </p>
                <p className="text-sm text-muted-foreground">
                  {getErrorMessage(error)} It may have expired or already
                  been used.
                </p>
              </div>
            )}

            {invitation && !acceptMutation.isSuccess && (
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

                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={acceptMutation.isPending}
                  >
                    {acceptMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Accept invitation
                  </Button>
                ) : (
                  <Button className="w-full" onClick={onRequiresAuth}>
                    Sign in to accept
                  </Button>
                )}

                {acceptMutation.error && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(acceptMutation.error)}
                  </p>
                )}
              </div>
            )}

            {acceptMutation.isSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <CheckCircle2 className="mx-auto h-8 w-8 text-secondary-600" />
                <p className="text-sm font-medium text-foreground">
                  You've joined the group
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
