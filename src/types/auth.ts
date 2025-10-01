
import { UserRole } from "@/config";
import { UserInterface } from "./global";

export type Department =
    | 'accounting'
    | 'business-admin'
    | 'economics'
    | 'finance'
    | 'marketing'
    | 'management';
export type Level = '100' | '200' | '300' | '400' | '500';

// SIGNUP RESPONSE TYPES
export interface SignupResponse {
    status: number,
    response: string,
    user: UserInterface
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
    enrollmentDate: string
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
}

export interface ApiResponse<T = unknown> { //or any
    status: number;
    data: T;
    message: string;
    errors?: Record<string, string[]>;
    meta?: {
        pagination?: {
            total: number;
            perPage: number;
            currentPage: number;
            lastPage: number;
        };
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
    sortOrder?: 'asc' | 'desc';
}
