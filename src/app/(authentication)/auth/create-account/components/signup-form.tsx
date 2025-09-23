'use client';

import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSignup } from '@/hooks/use-signup';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PersonalInformation } from './PersonalInformation';
import { AcademicInformation } from './AcademicInformation';
import { AccountInformation } from './AccountInformation';
import { ProgressStepper } from './ProgressStepper';
import { FormErrorList } from '@/components/core/forms/errors';
import { motion } from "framer-motion";

export function SignupForm() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        control,
        setValue,
        getValues,
        watch,
        // HELPERS
        getStepStatus,
        goToStep,
        STEPS: steps,
        currentStep,
        nextStep,
        prevStep,
        delta,
        // DATA & ACTIONS
        error,
        onSubmit
    } = useSignup();

    return (
        <div className="block">

            {/* Progress Stepper */}
            <ProgressStepper steps={steps} getStepStatus={getStepStatus} goToStep={goToStep} currentStep={currentStep} />

            {/* displaying error in the form */}
            <FormErrorList errors={errors} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >

                        <PersonalInformation register={register} errors={errors} control={control} />
                    </motion.div>
                )}

                {/* Step 2: Academic Information */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <AcademicInformation register={register} errors={errors} control={control} setValue={setValue} getValues={getValues} watch={watch} />
                    </motion.div>
                )}

                {/* Step 3: Account Information */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ x: delta >= 1 ? '80%' : '-80%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <AccountInformation register={register} errors={errors} />
                    </motion.div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 border-t mt-20">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>

                    <div className="text-sm text-gray-500">
                        Step {currentStep + 1} of {steps.length}
                    </div>

                    {currentStep === steps.length - 1 ? (
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            loading={isSubmitting}
                            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <Check className="w-4 h-4 ml-1" />
                            Complete Registration
                        </Button>
                    ) : (
                        <Button
                            // type="Button"
                            onClick={nextStep}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                        Sign in here
                    </Link>
                </div>
            </form>
        </div>
    );
}