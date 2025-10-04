'use client'

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordFormData, forgotPasswordSchema } from "@/schema/auth-schema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";
import { authApi } from "@/lib/services/auth";

export const useForgotPasswordForm = () => {
    const [message, setMessage] = useState('');

    const form = useForm<forgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema) as Resolver<forgotPasswordFormData>,
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: async (forgotCredention: forgotPasswordFormData) => authApi.forgotPassword(forgotCredention),
        onSuccess: async () => {
            toast.success(`A reset password link has been sent to your email`)
            setMessage("A reset password link has been sent to your email");
            form.reset();
        },
        onError: (error: ApiError) => {
            const message = error.message || "Failed to obtain token. Please try again.";
            toast.error(message);
            setMessage(message)

            if (error.errors) {
                // Handle validation errors
                Object.values(error.errors).forEach((messages: unknown) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => toast.error(msg));
                    }
                });
            }
        }
    })


    const onSubmit = async (data: forgotPasswordFormData) => {
        setMessage("");
        forgotPasswordMutation.mutate(data);
    };

    return {
        form,
        isProcessing: forgotPasswordMutation.isPending,
        message,
        onSubmit,
    };
};
