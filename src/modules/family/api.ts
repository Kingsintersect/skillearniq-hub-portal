import { apiClient } from "@/core/client";
import type {
  InviteParentPayload,
  MonitoredStudent,
  MonitoringParent,
} from "./types";

/**
 * NOTE: The source spec only documents the registration-time parent link
 * (Rule Block 2 passive account conversion). These endpoints follow the same
 * REST conventions as the documented ones (`/v1/...`, `{ success, data }`
 * envelope) for the obvious post-registration management screens — adjust
 * the paths if your backend names them differently.
 */
const BASE = "/v1/family";

// ========== DUMMY DATA ==========
const DUMMY_MY_STUDENTS: MonitoredStudent[] = [
  {
    id: 1,
    first_name: "Emma",
    last_name: "Johnson",
    email: "emma.johnson@example.com",
    status: "active",
  },
  {
    id: 2,
    first_name: "Liam",
    last_name: "Johnson",
    email: "liam.johnson@example.com",
    status: "active",
  },
  {
    id: 3,
    first_name: "Sophie",
    last_name: "Johnson",
    email: "sophie.johnson@example.com",
    status: "pending",
  },
];

const DUMMY_MY_PARENTS: MonitoringParent[] = [
  {
    id: 1,
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    status: "active",
  },
  {
    id: 2,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    status: "active",
  },
];

// ========== API HANDLERS ==========

export const familyApi = {
  /** Parent dashboard: students this parent monitors. */
  getMyStudents: () => {
    console.log("[DUMMY] Getting my students...");
    return Promise.resolve({ success: true, data: DUMMY_MY_STUDENTS });
    // apiClient.get<MonitoredStudent[]>(`${BASE}/students`),
  },

  /** Student dashboard: parents monitoring this student. */
  getMyParents: () => {
    console.log("[DUMMY] Getting my parents...");
    return Promise.resolve({ success: true, data: DUMMY_MY_PARENTS });
    // apiClient.get<MonitoringParent[]>(`${BASE}/parents`),
  },

  /** Student-initiated: invite/link an additional parent post-registration. */
  inviteParent: (payload: InviteParentPayload) => {
    console.log("[DUMMY] Inviting parent:", payload);
    return Promise.resolve({
      success: true,
      data: { success: true, message: `Invitation sent to ${payload.parent_first_name} ${payload.parent_last_name}` },
    });
    // apiClient.post<{ success: boolean; message: string }>(
    //   `${BASE}/parents/invite`,
    //   payload
    // ),
  },

  /** Parent or student can unlink a monitoring relationship. */
  unlink: (relationshipId: number) => {
    console.log("[DUMMY] Unlinking relationship:", relationshipId);
    return Promise.resolve({ success: true, data: { success: true } });
    // apiClient.delete<{ success: boolean }>(`${BASE}/links/${relationshipId}`),
  },
};
