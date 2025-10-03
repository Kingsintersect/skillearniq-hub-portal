'use client'

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormData, resetPasswordSchema } from "@/schema/auth-schema";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";
import { authApi } from "@/lib/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const form = useForm<resetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema) as Resolver<resetPasswordFormData>,
        mode: "onChange",
        defaultValues: {
            email: "",
            token: token || "",
            password: "",
            password_confirmation: "",
        },
    });

    useEffect(() => {
        if (token) {
            form.setValue('token', token);
        }
    }, [token, form]);
    useEffect(() => {
        if (email) {
            form.setValue('email', email);
        }
    }, [email, form]);

    const resetPasswordMutation = useMutation({
        mutationFn: async (resetPasswordCredentials: resetPasswordFormData) => {
            const dataWithToken = {
                ...resetPasswordCredentials,
                token: token || resetPasswordCredentials.token,
            };
            return authApi.resetPassword(dataWithToken);
        },
        onSuccess: async () => {
            toast.success(`Password has been successfully updated`)
            form.reset();
            router.push(`/auth/signin?email${email}`);
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
        form,
        isProcessing: resetPasswordMutation.isPending,
        onSubmit,
    };
};
