import { SignUpFormData } from "@/schema/sign-up-schema";
import { apiClient } from "./client";
import type { LoginResponse, SignupResponse } from "@/types/auth";
import { UserInterface } from "@/types/global";
import { forgotPasswordFormData, resetPasswordFormData, signInFormData } from "@/schema/auth-schema";

export const authApi = {
    login: async (credentials: signInFormData): Promise<LoginResponse> => {
        const requestUrl = (credentials.userType === "parent")
            ? `/auth/parent/verify-otp`
            : `/auth/login`;

        const response = await apiClient.post<LoginResponse>(requestUrl, credentials);
        return response as unknown as LoginResponse;
    },

    parentLoginOtpRequest: (parentCredentials: forgotPasswordFormData) =>
        apiClient.post("/auth/parent/request-otp", { ...parentCredentials }),
    // simulateApiRequest(),

    signup: async (data: SignUpFormData): Promise<SignupResponse> => {
        const response = await apiClient.post<SignupResponse>("/auth/register", data);

        return { ...response, user: { email: data.email } } as unknown as SignupResponse;
    },

    logout: () => apiClient.post("/auth/logout"),

    refreshToken: (refreshToken: string) =>
        apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
            refreshToken,
        }),

    getProfile: () => apiClient.get<UserInterface>("/application/profile"),

    forgotPassword: (forgotCredention: forgotPasswordFormData) =>
        apiClient.post("/auth/password/forgot", { ...forgotCredention }),


    resetPassword: (resetPCredention: resetPasswordFormData) => {
        const { token, email, ...passwordFeilds } = resetPCredention;
        return apiClient.post(`/auth/password/reset?token=${token}&email=${email}`, { ...passwordFeilds })
    },

    verifyResetPasswordToken: (token: string) =>
        apiClient.get(`/verify-token?token=${token}`),

    changePassword: (currentPassword: string, newPassword: string, passwordConfirmation: string) =>
        apiClient.post("/auth/change-password", {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation,
        }),

    updateProfile: (data: Partial<UserInterface>) =>
        apiClient.put<UserInterface>("/application/profile", data),
};

const simulateApiRequest = (): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'API request completed after 30 seconds',
                data: { /* your mock data */ }
            });
        }, 500);
    });
};