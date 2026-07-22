"use client";

import { useSession } from "next-auth/react";
import { InvitationAcceptPage } from "@/modules/subscription";

export default function InviteTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const { status } = useSession();

  // Hold until the session check settles to avoid a flicker between the
  // "sign in to continue" and "finalizing membership" states.
  if (status === "loading") return null;

  return <InvitationAcceptPage token={params.token} />;
}
