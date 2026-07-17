import { apiClient } from "@/core/client";
import type {
  AcceptInvitationData,
  AcceptInvitationPayload,
  InvitationTokenDetails,
  MyGroup,
  Plan,
  SendInvitationData,
  SendInvitationPayload,
} from "./types";

const BASE = "/v1/groups";

// ========== DUMMY DATA ==========
const DUMMY_PLANS: Plan[] = [
  {
    id: 1,
    name: "Individual Plan",
    price: 5000,
    max_members: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Family Plan (2-3 members)",
    price: 8000,
    max_members: 3,
    is_active: true,
  },
  {
    id: 3,
    name: "Family Plan (4-5 members)",
    price: 12000,
    max_members: 5,
    is_active: true,
  },
];

const DUMMY_MY_GROUP: MyGroup = {
  id: 101,
  owner_name: "John Doe",
  plan_name: "Family Plan (2-3 members)",
  max_slots: 3,
  available_slots: 1,
  active_members: [
    { user_id: 1, name: "John Doe", role: "owner" },
    { user_id: 2, name: "Jane Doe", role: "member" },
    { user_id: 3, name: "Jim Doe", role: "member" },
  ],
  pending_invitations: [
    { id: 1, email: "pending@example.com", sent_at: "2024-01-15T10:30:00Z" },
  ],
};

const DUMMY_INVITATION_DETAILS: InvitationTokenDetails = {
  group_owner: "John Doe",
  plan_name: "Family Plan (2-3 members)",
  email_invited: "newmember@example.com",
};

const DUMMY_SEND_INVITATION_DATA: SendInvitationData = {
  invitation_id: 2,
  email: "newmember@example.com",
  status: "pending",
};

const DUMMY_ACCEPT_INVITATION_DATA: AcceptInvitationData = {
  group_id: 101,
};

// ========== API HANDLERS ==========

export const subscriptionApi = {
  /**
   * NOTE: not in the documented endpoint list — assumed alongside
   * `plans` table for the plan-selection screen. Adjust path if different.
   */
  getPlans: () => {
    console.log("[DUMMY] Getting plans...");
    return Promise.resolve({ success: true, data: DUMMY_PLANS });
    // apiClient.get<Plan[]>("/v1/plans"),
  },

  getMyGroup: () => {
    console.log("[DUMMY] Getting my group...");
    return Promise.resolve({ success: true, data: DUMMY_MY_GROUP });
    // apiClient.get<MyGroup>(`${BASE}/my-group`),
  },

  sendInvitation: (payload: SendInvitationPayload) => {
    console.log("[DUMMY] Sending invitation to:", payload.email);
    return Promise.resolve({ success: true, data: { ...DUMMY_SEND_INVITATION_DATA, email: payload.email } });
    // apiClient.post<SendInvitationData>(`${BASE}/invitations`, payload),
  },

  verifyInvitationToken: (token: string) => {
    console.log("[DUMMY] Verifying invitation token:", token);
    return Promise.resolve({ success: true, data: DUMMY_INVITATION_DETAILS });
    // apiClient.get<InvitationTokenDetails>(
    //   `${BASE}/invitations/verify/${token}`
    // ),
  },

  acceptInvitation: (payload: AcceptInvitationPayload) => {
    console.log("[DUMMY] Accepting invitation with token:", payload.token);
    return Promise.resolve({ success: true, data: DUMMY_ACCEPT_INVITATION_DATA });
    // apiClient.post<AcceptInvitationData>(`${BASE}/invitations/accept`, payload),
  },

  /**
   * NOTE: assumed alongside Rule 3.3 revocation rule — not explicitly listed
   * as an endpoint in the spec. Frees the reserved slot instantly per the rule.
   */
  revokeInvitation: (invitationId: number) => {
    console.log("[DUMMY] Revoking invitation:", invitationId);
    return Promise.resolve({ success: true, data: { success: true } });
    // apiClient.delete<{ success: boolean }>(
    //   `${BASE}/invitations/${invitationId}`
    // ),
  },

  /** Rule 3.4: removing an active member instantly revokes their access. */
  removeMember: (userId: number) => {
    console.log("[DUMMY] Removing member:", userId);
    return Promise.resolve({ success: true, data: { success: true } });
    // apiClient.delete<{ success: boolean }>(`${BASE}/members/${userId}`),
  },
};
