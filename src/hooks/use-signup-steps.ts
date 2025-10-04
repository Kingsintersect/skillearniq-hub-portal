import { useState } from 'react'
import { FileText, GraduationCap, User } from "lucide-react";
import { parentInfoSchema, accouintInfoSchema, personalInfoSchema } from "@/schema/sign-up-schema";
import { UseFormReturn } from 'react-hook-form';

// Step configuration
export const STEPS = [
    {
        id: 'personal',
        title: 'Personal Information',
        description: 'Basic personal details',
        icon: User,
        schema: personalInfoSchema,
    },
    {
        id: 'parent',
        title: 'Parent Information',
        description: `parent's first name, last name. email ...`,
        icon: GraduationCap,
        schema: parentInfoSchema,
    },
    {
        id: 'Account',
        title: 'Account Information',
        description: 'Username, Email and password info',
        icon: FileText,
        schema: accouintInfoSchema,
    },
];

export const useSignupSteps = <T extends Record<string, unknown>>(
    form: UseFormReturn<T>
) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [previousStep, setPreviousStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const delta = currentStep - previousStep;


    // Validate current step
    const validateStep = async (stepIndex: number) => {
        const currentStepSchema = STEPS[stepIndex].schema;
        const currentValues = form.getValues();

        try {
            currentStepSchema.parse(currentValues);
            if (!completedSteps.includes(stepIndex)) {
                setCompletedSteps([...completedSteps, stepIndex]);
            }
            return true;
        } catch (error) {
            // Trigger validation to show errors
            console.error('error', error)
            await form.trigger();
            return false;
        }
    };

    // Navigation handlers
    const nextStep = async () => {
        if (await validateStep(currentStep)) {
            if (currentStep < STEPS.length) {
                setPreviousStep(currentStep);
                setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
            }
        }
    };

    const prevStep = () => {
        setPreviousStep(currentStep);
        setCurrentStep(Math.max(currentStep - 1, 0));
    };

    const goToStep = async (stepIndex: number) => {
        if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
            setCurrentStep(stepIndex);
        } else if (stepIndex === currentStep + 1) {
            await nextStep();
        }
    };

    // Get step status
    const getStepStatus = (stepIndex: number) => {
        if (completedSteps.includes(stepIndex)) return 'completed';
        if (stepIndex === currentStep) return 'current';
        if (stepIndex < currentStep) return 'completed';
        return 'upcoming';
    };

    return {
        delta,
        steps: STEPS,
        setCurrentStep,
        setCompletedSteps,
        currentStep,
        completedSteps,
        nextStep,
        prevStep,
        goToStep,
        getStepStatus,
        validateStep,
    }
}
