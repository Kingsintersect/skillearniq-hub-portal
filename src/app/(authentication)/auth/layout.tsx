"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { dashboardPathForRole } from "@/lib/dashboard-path";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "authenticated") {
      // Honour an explicit post-auth destination (e.g. returning to an
      // accept-invite page) before falling back to the role dashboard.
      const next = searchParams.get("next");
      router.replace(next || dashboardPathForRole(session?.user?.role));
    }
  }, [status, session, router, searchParams]);

  // Render nothing during initial session check to avoid flash
  if (status === "loading") return null;

  return <>{children}</>;
}
