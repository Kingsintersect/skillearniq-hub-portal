"use client";

import { FormField } from '@/components/layout/form';
import { Button } from '@/components/ui/button';
import { useResetPasswordForm } from '@/hooks/use-reset-password';
import Link from 'next/link';
import React from 'react'
import { PasswordInput } from '../../signin/components/login-form';

export const ResetPasswordForm = ({ verifyState }: { verifyState: boolean }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        onSubmit,
        isProcessing,
    } = useResetPasswordForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-7">
            <div className="animate-in fade-in-50 duration-700 delay-300">
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
            <div className="animate-in fade-in-50 duration-700 delay-500">
                <FormField
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                    required
                >
                    <PasswordInput
                        register={register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        placeholder="Confirm your password"
                    />
                </FormField>
            </div>

            <div className="animate-in fade-in-50 duration-700 delay-600">
                <Button
                    type="submit"
                    variant="gradient"
                    size="xl"
                    className="w-full"
                    loading={isProcessing}
                    disabled={!isValid || isProcessing || !verifyState}
                >
                    Sign in
                </Button>
            </div>

            <div className="text-center">
                <Link
                    href="/auth/signin"
                    className="font-medium text-secondary-600 hover:text-secondary-500"
                >
                    Back to login
                </Link>
            </div>
        </form>
    )
}
