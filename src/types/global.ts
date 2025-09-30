import { UserRole } from "@/config";

export enum AdmissionStatusType {
    ADMITTED = "ADMITTED",
    INPROGRESS = "INPROGRESS",
    PENDING = "PENDING",
    "NOT_ADMITTED" = "NOT_ADMITTED"
}
export enum StatusType {
    FULLY_PAID = "FULLY_PAID",
    PART_PAID = "PART_PAID",
    UNPAID = "UNPAID"
}

export interface UserInterface extends Record<string, unknown> {
    id: string;
    first_name: string;
    last_name: string;
    username: string | null;
    email: string;
    phone: string;
    role: UserRole | string; // extend as needed
    is_active: number;
    email_verified: number;
    phone_verified: number;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    last_login_at: string; // ISO datetime
    meta: unknown | null;
}
