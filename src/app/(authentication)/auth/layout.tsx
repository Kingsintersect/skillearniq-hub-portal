"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function dashboardPathForRole(role?: string): string {
  switch (role?.toLowerCase()) {
    case "student":
      return "/subscription";
    case "parent":
      return "/subscription";
    case "teacher":
    case "tutor":
      return "/teacher/dashboard";
    case "admin":
    case "manager":
    case "super_admin":
      return "/admin/dashboard";
    default:
      return "/subscription";
  }
}

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(dashboardPathForRole(session?.user?.role));
    }
  }, [status, session, router]);

  // Render nothing during initial session check to avoid flash
  if (status === "loading") return null;

  return <>{children}</>;
}
