"use client";

import { motion } from "framer-motion";
import { PartyPopper, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState, FullPageLoader } from "@/modules/shared";
import { useMyGroup } from "../hooks/use-subscription";
import { CapacityMeter } from "./capacity-meter";
import { MemberSlotGrid } from "./member-slot-grid";
import { InviteMemberDialog } from "./invite-member-dialog";
import { PendingInvitationsTable } from "./pending-invitations-table";

export interface GroupDashboardProps {
  currentUserId: number;
}

export function GroupDashboard({ currentUserId }: GroupDashboardProps) {
  const { data: group, isLoading } = useMyGroup();

  if (isLoading) return <FullPageLoader label="Loading your group…" />;

  if (!group || Array.isArray(group) || !group.active_members) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No active group"
        description="Subscribe to a plan to start a subscription group."
      />
    );
  }

  const isOwner = group.active_members?.some((m) => m.user_id === currentUserId) ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-none shadow-sm dark:bg-[#141833]">
        <CardHeader className="flex flex-row items-center justify-between gap-2 bg-gradient-to-br from-[#293073] to-[#1B2151] px-5 py-6 text-white">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-[#FD8A3D]" />
            <div>
              <p className="text-base font-semibold">{group.plan_name}</p>
              <p className="text-xs text-white/60">Owned by {group.owner_name}</p>
            </div>
          </div>
          {isOwner && <InviteMemberDialog availableSlots={group.available_slots} />}
        </CardHeader>
        <CardContent className="space-y-6 p-5">
          <CapacityMeter group={group} />
          <MemberSlotGrid group={group} isOwner={isOwner} />
          {group.pending_invitations && (
            <PendingInvitationsTable invitations={group.pending_invitations} isOwner={isOwner} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}