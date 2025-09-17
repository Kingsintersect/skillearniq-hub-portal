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
    id?: string;
    pictureRef: string;
    last_name: string;
    first_name: string;
    other_name: string;
    username: string;
    faculty_id: string;
    department_id: string;
    program: string;
    program_id: string;
    nationality: string;
    state: string;
    phone_number: string;
    email: string;
    password: string;
    reference: string;
    amount: number;
    reg_number: string;
    is_applied: number;
    reason_for_denial: string;
    admission_status: AdmissionStatusType;
    acceptance_fee_payment_status: StatusType;
    tuition_payment_status: StatusType;
    application_payment_status: StatusType;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at: Date | string;
    role: UserRole;
    level: string;
    tuition_amount_paid: number;
}
