"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { InvitationAcceptPage } from "@/modules/subscription";

export default function InviteTokenPage({
  params,
}: {
  // Next.js 15: route params are async and must be unwrapped with React.use().
  params: Promise<{ token: string }>;
}) {
  const { token } = React.use(params);
  const { status } = useSession();

  // Hold until the session check settles to avoid a flicker between the
  // "sign in to continue" and "finalizing membership" states.
  if (status === "loading") return null;

  return <InvitationAcceptPage token={token} />;
}
