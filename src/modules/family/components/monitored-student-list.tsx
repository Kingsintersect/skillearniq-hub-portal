"use client";

import { motion } from "framer-motion";
import { GraduationCap, Hourglass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, FullPageLoader, StatusBadge, statusToTone } from "@/modules/shared";
import { useMyStudents } from "../hooks/use-family";

export interface MonitoredStudentListProps {
  onViewStudent?: (studentId: number) => void;
}

export function MonitoredStudentList({ onViewStudent }: MonitoredStudentListProps) {
  const { data: students, isLoading } = useMyStudents();

  if (isLoading) return <FullPageLoader label="Loading your students…" />;

  if (!students || students.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="h-6 w-6" />}
        title="No students yet"
        description="Students you're linked to will appear here."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {students.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-medium text-primary-700">
                {student.first_name[0]}
                {student.last_name[0]}
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {student.first_name} {student.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{student.email}</p>
              </div>
              {student.status === "pending" ? (
                <StatusBadge label="Pending" tone="warning" />
              ) : (
                <StatusBadge
                  label={student.status}
                  tone={statusToTone(student.status)}
                />
              )}
            </CardContent>
            {student.status === "active" && onViewStudent && (
              <div className="border-t border-border px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-0 text-xs"
                  onClick={() => onViewStudent(student.id)}
                >
                  View reports
                </Button>
              </div>
            )}
            {student.status === "pending" && (
              <div className="flex items-center gap-1.5 border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <Hourglass className="h-3 w-3" />
                Waiting for student to confirm
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
