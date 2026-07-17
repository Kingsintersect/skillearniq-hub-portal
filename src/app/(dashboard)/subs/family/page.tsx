"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  InviteParentDialog,
  MonitoredStudentList,
  MonitoringParentList,
  MonitoringScopeNotice,
} from "@/modules/family";
import { isRole } from "@/modules/shared";

export default function FamilyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const role = session?.user?.role;

  if (isRole(role, "parent")) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Your students
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor progress, reports, and billing for linked students.
          </p>
        </div>
        <MonitoringScopeNotice />
        <MonitoredStudentList
          onViewStudent={(studentId) =>
            router.push(`/subs/family/students/${studentId}`)
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Your parents
          </h1>
          <p className="text-sm text-muted-foreground">
            Parents linked here can view your reports and billing — nothing
            else.
          </p>
        </div>
        <InviteParentDialog />
      </div>
      <MonitoringParentList />
    </div>
  );
}
