"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LOCAL_STORAGE_KEYS, QUERY_KEYS, ROUTES } from "@/config";
import { AuthenState, ApiError, AuthUser } from "@/types/auth";
import { authApi } from "@/lib/services/auth";
import { UserInterface } from "@/types/global";
import { useLocalStorage } from "./use-local-storage";
import { getSession, signIn, signOut } from "next-auth/react";
import { signInFormData } from "@/schema/auth-schema";
import { apiClient } from "@/lib/services/client";

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>(
        LOCAL_STORAGE_KEYS.accessToken,
        null
    );

    const [parentOTP, setparentOTP, removeparentOTP] = useLocalStorage<boolean>(
        LOCAL_STORAGE_KEYS.parentOTP,
        false
    );

    // const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>(
    //     LOCAL_STORAGE_KEYS.refreshToken,
    //     null
    // );

    const [user, setUser, removeUser] = useLocalStorage<UserInterface | null>(
        LOCAL_STORAGE_KEYS.user,
        null
    );

    // Get user profile
    const {
        data: profile,
        isLoading: isLoadingProfile,
        error: profileError,
    } = useQuery({
        queryKey: QUERY_KEYS.auth.profile,
        queryFn: async () => {
            const response = await authApi.getProfile();
            return response.data;
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: ApiError) => {
            // Don't retry if unauthorized
            if (error.statusCode === 401) return false;
            return failureCount < 2;
        },
    });

    // Login mutation
    const loginMutation = useMutation({
        // mutationFn: (credentials: signInFormData) => authApi.login(credentials),
        mutationFn: async (credentials: signInFormData) => {
            const result = await signIn('credentials', {
                ...credentials,
                redirect: false,
            })

            if (result?.error) {
                throw new Error(result.error)
            }

            return result
        },
        onSuccess: async () => {
            const session = await getSession()

            if (session?.user) {
                setUser(session.user as UserInterface & { access_token: string, expires_in: number })
                // setRefreshToken(refreshToken);
                setAccessToken(session.user.access_token);

                // Invalidate and refetch profile
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.profile });

                toast.success(`Welcome back, ${session.user.first_name}!`);
                setparentOTP(false);

                if (session.user?.role === "STUDENT") router.push(`/course-overview`)
                else router.push(`/${session.user?.role.toLocaleLowerCase() + ROUTES.dashboard}`)
            }
        },
        onError: (error: ApiError) => {
            const message = error.message || "Login failed. Please try again.";
            toast.error(message);

            if (error.errors) {
                // Handle validation errors
                Object.values(error.errors).forEach((messages: unknown) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => toast.error(msg));
                    }
                });
            }
        },
    });

    // Parent OPT request  mutation
    const parentOTPRequestMutation = useMutation({
        mutationFn: (credentials: signInFormData) => authApi.parentLoginOtpRequest(credentials),
        onSuccess: async () => {
            toast.success(`OTP has been sent to your email address!`);
            setparentOTP(true);
        },
        onError: (error: ApiError) => {
            const message = error.message || "Login failed. Please try again.";
            toast.error(message);

            if (error.errors) {
                // Handle validation errors
                Object.values(error.errors).forEach((messages: unknown) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => toast.error(msg));
                    }
                });
            }
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async (callbackUrl?: string) => {
            // await authApi.logout();
            await signOut({ callbackUrl: callbackUrl ?? '/auth/signin' })
        },
        onSuccess: () => {
            clearAuthenticationData();
            toast.success("Logged out successfully");
            router.push(ROUTES.login);
        },
        onError: (error: ApiError) => {
            // Even if API call fails, clear local data
            clearAuthenticationData();
            toast.error(error.message || "Logout failed, but you've been signed out locally");
            router.push(ROUTES.login);
        },
    });

    // Clear all auth data
    const clearAuthenticationData = () => {
        removeAccessToken();
        removeparentOTP();
        // removeRefreshToken();
        removeUser();
        queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.profile });
        queryClient.clear();
    };

    // Check if user is authenticated
    const isAuthenticated = apiClient.isAuthenticated();

    // Loading state
    const isLoading = loginMutation.isPending || isLoadingProfile || parentOTPRequestMutation.isPending;

    // Auth state object
    const authState: AuthenState = {
        user: (profile ?? user) as AuthUser,
        access_token: accessToken,
        isAuthenticated,
        isLoading,
        error: profileError?.message || null,
        parentOTP: parentOTP,
    };

    return {
        ...authState,
        login: loginMutation.mutate,
        requestParentOTP: parentOTPRequestMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending || parentOTPRequestMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        clearAuthenticationData,
        loginError: loginMutation.error,
        logoutError: logoutMutation.error,
    };
}
