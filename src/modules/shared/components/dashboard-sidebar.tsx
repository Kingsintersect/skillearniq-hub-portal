"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Gift,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isRole } from "@/modules/shared";
// useAuthContext drives logout since it wraps next-auth's signOut
// with any app-level cleanup (clearAuthenticationData etc.)
import { useAuthContext } from "@/providers/AuthProvider";
import type { SystemRole } from "@/modules/auth";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Users;
  roles?: SystemRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/subs/family", label: "Family", icon: Users },
  { href: "/subs/subscription", label: "Subscription", icon: Wallet },
  { href: "/subs/billing", label: "Billing", icon: CreditCard },
  { href: "/subs/referral", label: "Referrals", icon: Gift },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logout } = useAuthContext();

  const user = session?.user;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || isRole(user?.role, ...item.roles)
  );

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <p className="text-sm font-semibold text-foreground">Qverse Learning</p>
        {user && (
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">
            {user.name} · {user.role}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
