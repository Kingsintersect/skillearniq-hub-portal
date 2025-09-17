'use client'

import React from 'react'
import { FormField, Input } from "@/components/layout/form";
import { Button } from "@/components/ui/button";
import { useLoginForm, useLoginHandlers } from '@/hooks/use-login';
import { ApplySection, FormActions, FormHeader, PasswordInput } from './components/login-form';
import { BrandingPanel } from '@/components/global/generic-componenets';

const LoginFormPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        onSubmit,
        isLoggingIn,
    } = useLoginForm();

    const { handleApplyInfo, handleForgotPassword } = useLoginHandlers();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                <div className="grid md:grid-cols-2 min-h-[600px]">
                    {/* Left Panel - Branding */}
                    <BrandingPanel />

                    {/* Right Panel - Login Form */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            {/* Header */}
                            <FormHeader />

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
                                            className="h-12"
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
                                    onForgotPassword={handleForgotPassword}
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
                            <ApplySection onApplyInfo={handleApplyInfo} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginFormPage
