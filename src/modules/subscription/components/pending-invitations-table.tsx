"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { queryKeys, formatDate } from "@/modules/shared";
import { authApi } from "@/modules/auth"; // adjust to your real API client import

export interface PendingInvitation {
    id: number;
    email: string;
    sent_at: string;
}

export interface PendingInvitationsTableProps {
    invitations: PendingInvitation[];
    isOwner: boolean;
}

function useCancelInvitation() {
    const qc = useQueryClient();
    return useMutation({
        // TODO: point this at your real endpoint — placeholder shape assumed
        mutationFn: (invitationId: number) => authApi.revokeInvitation(invitationId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.subscription.myGroup }); // adjust key to match your hooks file
            toast.success("Invitation cancelled.");
        },
        onError: (err: any) => toast.error(err?.message ?? "Failed to cancel invitation."),
    });
}

export function PendingInvitationsTable({ invitations, isOwner }: PendingInvitationsTableProps) {
    const cancelMutation = useCancelInvitation();
    const [cancellingId, setCancellingId] = React.useState<number | null>(null);

    if (invitations.length === 0) return null;

    const handleCancel = (id: number) => {
        setCancellingId(id);
        cancelMutation.mutate(id, {
            onSettled: () => setCancellingId(null),
        });
    };

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">
                Pending invitations
            </p>
            <div className="overflow-hidden rounded-xl border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Email</TableHead>
                            <TableHead>Sent</TableHead>
                            {isOwner && <TableHead className="w-16 text-right">&nbsp;</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {invitations.map((invite) => (
                                <motion.tr
                                    key={invite.id}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-b border-border last:border-0"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300">
                                                <Mail className="h-3.5 w-3.5" />
                                            </span>
                                            {invite.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(invite.sent_at)}
                                    </TableCell>
                                    {isOwner && (
                                        <TableCell className="text-right">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                disabled={cancellingId === invite.id}
                                                onClick={() => handleCancel(invite.id)}
                                                aria-label={`Cancel invitation to ${invite.email}`}
                                            >
                                                {cancellingId === invite.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <X className="h-3.5 w-3.5" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}