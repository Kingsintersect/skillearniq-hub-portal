

import { baseUrl } from '@/config';
import { SignUpFormData, signUpSchema } from '@/schema/sign-up-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/services/auth';
import { toast } from 'sonner';
import { ApiError, SignupResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { STEPS, useSignupSteps } from './use-signup-steps';

interface UseSignupReturn extends UseFormReturn<SignUpFormData> {
    error: string | null;
    onSubmit: (data: SignUpFormData) => Promise<void>

    getStepStatus: (stepIndex: number) => "completed" | "current" | "upcoming";
    goToStep: (stepIndex: number) => Promise<void>;
    STEPS: typeof STEPS;
    currentStep: number;
    completedSteps?: number[];
    nextStep: () => Promise<void>;
    prevStep: () => void;
    delta: number;
}

export function useSignup(): UseSignupReturn {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            username: '',
            gender: '',
            nationality: '',
            phone: '',
        },
    });

    const {
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        getStepStatus,
        setCurrentStep,
        setCompletedSteps,
        delta,
    } = useSignupSteps(form);

    // const { data: currentSession, isSuccess: isSessionLoaded } = useCurrentSession();
    // const { data: currentSemester, isSuccess: isSemesterLoaded } = useCurrentSemester();


    // useEffect(() => {
    //     if (isSessionLoaded && isSemesterLoaded) {
    //         form.reset({
    //             academic_session: currentSession?.name ?? "",
    //             academic_semester: currentSemester?.name ?? "",
    //             start_year: "2025",
    //             amount: APPLICATION_FEE.toString(),
    //         });
    //     }
    // }, [isSessionLoaded, isSemesterLoaded, currentSession, currentSemester, form]);


    // Create Account Mutation
    const signup = useMutation({
        mutationFn: (credentials: SignUpFormData) => authApi.signup(credentials),
        onSuccess: async (res: SignupResponse) => {
            toast.success(`Welcome back!`)
            const redirectUrl = (res.user) ? res.user.email : "";

            router.push(`${baseUrl}/auth/signin?email=${redirectUrl}`);
            form.reset();
            setCurrentStep(0);
            setCompletedSteps([]);
        },
        onError: (error: ApiError) => {
            const message = error.message || "Login failed. Please try again.";
            toast.error(message);

            setError(message);
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

    const onSubmit = async (data: SignUpFormData) => {
        signup.mutate(data);
    };

    return {
        ...form,
        formState: form.formState,
        onSubmit,
        error,
        // signup

        getStepStatus,
        goToStep,
        STEPS,
        currentStep,
        nextStep,
        prevStep,
        delta,
    };
}
