import { SignUpFormData } from "@/schema/sign-up-schema";
import { apiClient } from "./client";
import type { LoginResponse, SignupResponse } from "@/types/auth";
import { UserInterface } from "@/types/global";
import { forgotPasswordFormData, resetPasswordFormData, signInFormData } from "@/schema/auth-schema";

export const authApi = {
    login: async (credentials: signInFormData): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/application/login", credentials);
        return response as unknown as LoginResponse;
    },

    signup: async (data: SignUpFormData): Promise<SignupResponse> => {
        const response = await apiClient.post<SignupResponse>("/application/purchase", data);

        return { ...response, user: { email: data.email } } as unknown as SignupResponse;
    },

    logout: () => apiClient.post("/auth/logout"),

    refreshToken: (refreshToken: string) =>
        apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
            refreshToken,
        }),

    getProfile: () => apiClient.get<UserInterface>("/application/profile"),

    forgotPassword: (forgotCredention: forgotPasswordFormData) =>
        apiClient.post("/auth/forgot-password", { ...forgotCredention }),

    verifyResetPasswordToken: (token: string) =>
        apiClient.get(`/verify-token?token=${token}`),

    resetPassword: (resetPasswordCredention: resetPasswordFormData) =>
        apiClient.post("/auth/reset-password", { ...resetPasswordCredention }),

    changePassword: (currentPassword: string, newPassword: string, passwordConfirmation: string) =>
        apiClient.post("/auth/change-password", {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation,
        }),

    updateProfile: (data: Partial<UserInterface>) =>
        apiClient.put<UserInterface>("/application/profile", data),
};