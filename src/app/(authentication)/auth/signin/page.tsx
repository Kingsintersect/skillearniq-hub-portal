'use client'

import React from 'react'
import { FormField, Input } from "@/components/layout/form";
import { Button } from "@/components/ui/button";
import { useLoginForm } from '@/hooks/use-login';
import { ApplySection, FormActions, PasswordInput } from './components/login-form';
import AuthContauiner from '../components/AuthContainer';
import { AuthContainerHeader } from '../components/AuthContainerHeader';

const LoginFormPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        onSubmit,
        isLoggingIn,
    } = useLoginForm();


    return (
        <AuthContauiner>
            {/* Header */}
            <AuthContainerHeader
                heading='Sign In'
                subHeading={`Please sign in to your account for more adventure!`}
            />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="animate-in fade-in-50 duration-700 delay-300">
                    <FormField
                        label="Email or Reference Number"
                        error={errors.reference?.message}
                        required
                    >
                        <Input
                            {...register("reference")}
                            type="text"
                            placeholder="Enter your email or reference number"
                            error={!!errors.reference}
                            className="h-12 text-black"
                        />
                    </FormField>
                </div>

                <div className="animate-in fade-in-50 duration-700 delay-400">
                    <FormField
                        label="Password"
                        error={errors.password?.message}
                        required
                    >
                        <PasswordInput
                            register={register("password")}
                            error={!!errors.password}
                            placeholder="Enter your password"
                        />
                    </FormField>
                </div>

                <FormActions
                    register={register}
                />

                <div className="animate-in fade-in-50 duration-700 delay-600">
                    <Button
                        type="submit"
                        variant="gradient"
                        size="xl"
                        className="w-full"
                        loading={isLoggingIn}
                        disabled={!isValid || isLoggingIn}
                    >
                        Sign in
                    </Button>
                </div>
            </form>

            {/* Apply Section */}
            <ApplySection />
        </AuthContauiner>
    );
}

export default LoginFormPage
