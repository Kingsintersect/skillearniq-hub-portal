"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, FullPageLoader, StatusBadge, statusToTone } from "@/modules/shared";
import { useMyParents } from "../hooks/use-family";

export function MonitoringParentList() {
  const { data: parents, isLoading } = useMyParents();

  if (isLoading) return <FullPageLoader label="Loading…" />;

  if (!parents || parents.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No parent linked"
        description="Invite a parent to monitor your progress and billing."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {parents.map((parent, index) => (
        <motion.div
          key={parent.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-medium text-secondary-800">
                {parent.first_name[0]}
                {parent.last_name[0]}
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {parent.first_name} {parent.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{parent.email}</p>
              </div>
              <StatusBadge label={parent.status} tone={statusToTone(parent.status)} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
