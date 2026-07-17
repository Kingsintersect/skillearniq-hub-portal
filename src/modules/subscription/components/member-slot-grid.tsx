"use client";

import { motion } from "framer-motion";
import { Clock, Loader2, UserMinus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/modules/shared";
import { useRemoveMember, useRevokeInvitation } from "../hooks/use-subscription";
import type { MyGroup } from "../types";

export interface MemberSlotGridProps {
  group: MyGroup;
  /** Whether the current user is the group owner (only owners can revoke/remove). */
  isOwner: boolean;
}

export function MemberSlotGrid({ group, isOwner }: MemberSlotGridProps) {
  const removeMemberMutation = useRemoveMember();
  const revokeInvitationMutation = useRevokeInvitation();

  return (
    <div className="space-y-3">
      {group.active_members.map((member, index) => (
        <motion.div
          key={member.user_id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04 }}
          className="flex items-center justify-between rounded-lg border border-border p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-xs font-medium text-primary-700">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {member.role}
              </p>
            </div>
          </div>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={removeMemberMutation.isPending}
              onClick={() => removeMemberMutation.mutate(member.user_id)}
            >
              {removeMemberMutation.isPending &&
              removeMemberMutation.variables === member.user_id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserMinus className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </motion.div>
      ))}

      {group.pending_invitations.map((invite, index) => (
        <motion.div
          key={invite.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (group.active_members.length + index) * 0.04 }}
          className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/40 p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-50 text-accent-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{invite.email}</p>
              <p className="text-xs text-muted-foreground">
                Invited {formatDate(invite.sent_at)} · expires in 72h from send
              </p>
            </div>
          </div>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={revokeInvitationMutation.isPending}
              onClick={() => revokeInvitationMutation.mutate(invite.id)}
              aria-label="Revoke invitation"
            >
              {revokeInvitationMutation.isPending &&
              revokeInvitationMutation.variables === invite.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
