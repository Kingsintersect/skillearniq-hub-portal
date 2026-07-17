"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InvitationAcceptPage } from "@/modules/subscription";

export default function InviteTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { status } = useSession();

  // Hold until session check settles to avoid a flicker
  if (status === "loading") return null;

  return (
    <InvitationAcceptPage
      token={params.token}
      isAuthenticated={status === "authenticated"}
      onAccepted={() => router.push("/subscription")}
      onRequiresAuth={() =>
        router.push(`/auth/signin?next=/invite/${params.token}`)
      }
    />
  );
}
