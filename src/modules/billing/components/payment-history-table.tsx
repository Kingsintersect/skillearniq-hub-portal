"use client";

import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EmptyState,
  FullPageLoader,
  StatusBadge,
  formatCurrency,
  formatDate,
  statusToTone,
} from "@/modules/shared";
import { usePaymentHistory } from "../hooks/use-billing";

export function PaymentHistoryTable() {
  const { data: payments, isLoading } = usePaymentHistory();

  if (isLoading) return <FullPageLoader label="Loading payment history…" />;

  if (!payments || payments.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-6 w-6" />}
        title="No payments yet"
        description="Your billing history will show up here."
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(payment.created_at)}
              </TableCell>
              <TableCell className="text-sm font-medium text-foreground">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell className="text-sm capitalize text-muted-foreground">
                {payment.gateway.replace("_", " ")}
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={payment.status}
                  tone={statusToTone(payment.status)}
                />
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {payment.reference}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
