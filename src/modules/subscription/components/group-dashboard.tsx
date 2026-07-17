"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, FullPageLoader } from "@/modules/shared";
import { useMyGroup } from "../hooks/use-subscription";
import { CapacityMeter } from "./capacity-meter";
import { MemberSlotGrid } from "./member-slot-grid";
import { InviteMemberDialog } from "./invite-member-dialog";

export interface GroupDashboardProps {
  /** The current authenticated user's id, to determine ownership-gated actions. */
  currentUserId: number;
}

export function GroupDashboard({ currentUserId }: GroupDashboardProps) {
  const { data: group, isLoading } = useMyGroup();

  if (isLoading) return <FullPageLoader label="Loading your group…" />;

  if (!group) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No active group"
        description="Subscribe to a plan to start a subscription group."
      />
    );
  }

  const isOwner = group.active_members.some(
    (m) => m.user_id === currentUserId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">{group.plan_name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Owned by {group.owner_name}
            </p>
          </div>
          {isOwner && (
            <InviteMemberDialog availableSlots={group.available_slots} />
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <CapacityMeter group={group} />
          <MemberSlotGrid group={group} isOwner={isOwner} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
