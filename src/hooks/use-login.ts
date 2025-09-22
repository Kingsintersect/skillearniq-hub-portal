'use client'

import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormData, signInSchema } from "@/schema/sign-in-schema";

export const useLoginForm = () => {
    const searchParams = useSearchParams();
    const referenceNumber = searchParams.get('email') || '';
    const { login, isLoggingIn } = useAuthContext();

    const form = useForm<signInFormData>({
        resolver: zodResolver(signInSchema) as Resolver<signInFormData>,
        mode: "onChange",
        defaultValues: {
            reference: referenceNumber || undefined,
            password: "",
            rememberMe: false,
        },
    });

    useEffect(() => {
        if (referenceNumber) {
            form.setValue('reference', referenceNumber);
        }
    }, [referenceNumber, form]);

    const onSubmit = async (data: signInFormData) => {
        login(data);
    };

    return {
        ...form,
        onSubmit,
        isLoggingIn,
    };
};

// Custom hook for handlers
export const useLoginHandlers = () => {
    const router = useRouter()

    const handleApplyInfo = () => {
        router.push('/auth/create-account')
    };

    const handleForgotPassword = () => {
        alert("Forgot password functionality would redirect to password reset page.");
    };

    return {
        handleApplyInfo,
        handleForgotPassword,
    };
};