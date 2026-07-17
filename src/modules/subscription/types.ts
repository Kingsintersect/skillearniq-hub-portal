/**
 * Subscription & group domain types.
 * Source: `plans`, `subscription_groups`, `subscription_group_members`,
 * `group_invitations` schema + Rule Block 3 (Group Subscription Mechanics).
 */

export type Gateway = "paystack" | "flutterwave" | "bank_transfer";

export type SubscriptionStatus =
  | "pending_payment"
  | "active"
  | "past_due"
  | "cancelled";

export type InvitationStatus = "pending" | "accepted";

export interface Plan {
  id: number;
  name: string;
  price: number;
  /** 1 = Individual, >1 = Group/Family (Rule 3.2 allocation). */
  max_members: number;
  is_active: boolean;
}

export interface GroupMemberSummary {
  user_id: number;
  name: string;
  role: string;
}

export interface PendingInvitationSummary {
  id: number;
  email: string;
  sent_at: string;
}

export interface MyGroup {
  id: number;
  owner_name: string;
  plan_name: string;
  max_slots: number;
  available_slots: number;
  active_members: GroupMemberSummary[];
  pending_invitations: PendingInvitationSummary[];
}

export interface InvitationTokenDetails {
  group_owner: string;
  plan_name: string;
  email_invited: string;
}

/** ---------------- Payloads ---------------- */

export interface SendInvitationPayload {
  email: string;
}

export interface SendInvitationData {
  invitation_id: number;
  email: string;
  status: InvitationStatus;
}

export interface AcceptInvitationPayload {
  token: string;
}

export interface AcceptInvitationData {
  group_id: number;
}

/** Business rule 3.3: invitation tokens are valid for exactly 72 hours. */
export const INVITATION_TTL_HOURS = 72;
/** Business rule 3.2: capacity formula is active members + pending invites <= max_members. */
export function computeAvailableSlots(group: MyGroup): number {
  return group.max_slots - group.active_members.length - group.pending_invitations.length;
}
