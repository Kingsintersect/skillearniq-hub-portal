'use client'

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormData, resetPasswordSchema } from "@/schema/auth-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";
import { authApi } from "@/lib/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const {
        data: verifyState,
        isLoading: isVerifying,
        error: tokenVerifyError,
    } = useQuery({
        queryKey: ['verify-token', token],
        queryFn: async () => {
            if (!token) throw new Error('Token is required');
            const response = await authApi.verifyResetPasswordToken(token);

            if (!response) {
                throw new Error(`Token verification failed: ${response}`);
            }

            return true;
        },
        enabled: !!token,
        retry: false,
    });

    // Handle query errors with useEffect
    useEffect(() => {
        if (tokenVerifyError) {
            console.error('Token verification error:', tokenVerifyError);
            toast.error('Invalid or expired reset token');
            setTimeout(() => router.push('/auth/forgot-password'), 3000);
        }
    }, [tokenVerifyError, router]);

    const form = useForm<resetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema) as Resolver<resetPasswordFormData>,
        mode: "onChange",
        defaultValues: {
            token: token || "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (token) {
            form.setValue('token', token);
        }
    }, [token, form]);

    const resetPasswordMutation = useMutation({
        mutationFn: async (resetPasswordCredentials: resetPasswordFormData) => {
            const dataWithToken = {
                ...resetPasswordCredentials,
                token: token || resetPasswordCredentials.token
            };
            return authApi.resetPassword(dataWithToken);
        },
        onSuccess: async (res) => {
            toast.success(`Password has been successfully updated`)
            console.log('response', res)
            form.reset();
            router.push("/auth/signin");
        },
        onError: (error: ApiError) => {
            const message = error.message || "Failed to Reset your password. Please try again.";
            toast.error(message);

            if (error.errors) {
                Object.values(error.errors).forEach((messages: unknown) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => toast.error(msg));
                    }
                });
            }
        }
    })

    const onSubmit = async (data: resetPasswordFormData) => {
        const submitData = {
            ...data,
            token: token || ""
        };
        resetPasswordMutation.mutate(submitData);
    };

    return {
        isVerifying,
        tokenVerifyError,
        verifyState: !!verifyState,

        ...form,
        isProcessing: resetPasswordMutation.isPending,
        onSubmit,
    };
};
