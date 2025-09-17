
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
    access_token: string;
    expires_in: number;
    token_type: string;
    user: UserInterface

    status: number,
    response: string,
}

export interface AuthenticationState {
    user: UserInterface | null;
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
