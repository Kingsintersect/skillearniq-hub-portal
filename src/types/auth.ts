import { UserRole } from "@/config";
import { UserInterface } from "./global";

export type Department =
    | "accounting"
    | "business-admin"
    | "economics"
    | "finance"
    | "marketing"
    | "management";

export type Level = "100" | "200" | "300" | "400" | "500";

// Message Types
export interface MessageRecipient {
  id: number;
  message_id: number;
  recipient_type: string;
  recipient_id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  message: string;
  subject?: string;
  recipient_ids: number[] | null;
  created_at: string;
  updated_at: string;
  recipients: MessageRecipient[];
}

export interface MessageResponse {
  status: 'Success' | string;
  message: string;
  data: {
    sender_id: number;
    message: string;
    updated_at: string;
    created_at: string;
    id: number;
    recipients: MessageRecipient[];
  };
  recipient_count: number;
}

export interface MessagesListResponse {
  status: 'Success' | string;
  messages: Message[];
}

export interface SendMessagePayload {
  recipient_type: 'all_teachers' | 'all_students' | 'all_parents' | 'specific_teacher' | 'specific_student' | 'specific_parent';
  recipient_ids?: number[];
  message: string;
  subject?: string;
}

export interface UpdateMessagePayload {
  message: string;
  subject?: string;
}

// SIGNUP RESPONSE TYPES
export interface SignupResponse {
    status: number;
    response: string;
    user: UserInterface;
}

// LOGIN TYPES
export interface LoginResponse {
    status: boolean;
    message: string;
    data: {
        user: UserInterface;
        token: string;
        expires_in: number;
    };
}

export interface Student extends UserInterface {
    role: UserRole.STUDENT;
    studentId: string;
    course: string;
    enrollmentDate: string;
    passport: string;
}

export interface Admin extends UserInterface {
    role: UserRole.ADMIN;
    adminId: string;
    department: string;
    passport: string;
}

export interface Teacher extends UserInterface {
    role: UserRole.TEACHER;
    teacherId: string;
    department: string;
    passport: string;
}

export interface Parent extends UserInterface {
    role: UserRole.PARENT;
    teacherId: string;
    passport: string;
}

export type AuthUser = Student | Admin | Teacher | Parent;

export interface AuthenState {
    user: AuthUser | null;
    access_token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    parentOTP: boolean;
}

export interface ApiResponse<T = unknown> {
    status: number;
    data: T;
    message: string;
    errors?: Record<string, string[]>;

    meta?: {
        count?: number; // <-- ADD THIS
        pagination?: {
            total: number;
            perPage: number;
            currentPage: number;
            lastPage: number;
        };
        [key: string]: any; // allows extra keys safely
    };
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode: number;
}

export interface PaginationParams {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// ===============================
// PAYMENT TYPES
// ===============================

export interface Payment {
    id: number;
    student_id: number;
    amount: number;
    reference: string;
    status: "pending" | "successful" | "failed";
    created_at: string;
    updated_at: string;
}

export interface PaymentWithDetails extends Payment {
    student: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        studentId?: string;
        passport?: string;
        course?: string;
    };
}

