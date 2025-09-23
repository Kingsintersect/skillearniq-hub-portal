'use client'

import { useAuthContext } from "@/providers/AuthProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormData, signInSchema } from "@/schema/auth-schema";

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
