"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, FullPageLoader, formatCurrency, formatDate } from "@/modules/shared";
import { useReferralLedger } from "../hooks/use-referral";
import { RewardStatusBadge } from "./reward-status-badge";

export function ReferralLedgerTable() {
  const { data: entries, isLoading } = useReferralLedger();

  if (isLoading) return <FullPageLoader label="Loading referral history…" />;

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No referrals yet"
        description="Share your code to start earning rewards."
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referred</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-sm font-medium text-foreground">
                {entry.referee_name}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {formatCurrency(entry.reward_amount)}
              </TableCell>
              <TableCell>
                <RewardStatusBadge status={entry.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {entry.credited_at
                  ? formatDate(entry.credited_at)
                  : formatDate(entry.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
