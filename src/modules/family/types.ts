/**
 * Family / monitoring domain types.
 * Source: Rule Block 2 (Role & Monitoring Architecture) +
 * `parent_student` pivot table.
 */

export interface MonitoredStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  /** Whether this parent-student link is fully active (vs a pending passive account). */
  status: "active" | "pending";
}

export interface MonitoringParent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "pending";
}

/**
 * Scopes a parent may access for a monitored student — strictly read-only
 * (Rule 2.2). Parents cannot access CBT exams, discussions, or submissions.
 */
export type ParentAccessScope =
  | "reports"
  | "learning_analytics"
  | "billing"
  | "subscription";

export const PARENT_ACCESS_SCOPES: { scope: ParentAccessScope; label: string }[] = [
  { scope: "reports", label: "Reports" },
  { scope: "learning_analytics", label: "Learning analytics" },
  { scope: "billing", label: "Billing information" },
  { scope: "subscription", label: "Subscription information" },
];

export const PARENT_RESTRICTED_AREAS = [
  "CBT examinations",
  "Student discussions",
  "Learning activities requiring participation",
  "Assessment submissions",
];

export interface InviteParentPayload {
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_phone_number?: string;
}
