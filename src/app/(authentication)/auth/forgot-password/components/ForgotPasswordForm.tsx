"use client";

import { FormField, Input } from '@/components/layout/form';
import { Button } from '@/components/ui/button';
import { useForgotPasswordForm } from '@/hooks/use-forgot-password';
import Link from 'next/link';
import React from 'react'

export const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        onSubmit,
        message,
        isProcessing,
    } = useForgotPasswordForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-7">
            <div className="animate-in fade-in-50 duration-700 delay-300">
                <FormField
                    label="Email address"
                    error={errors.email?.message}
                    required
                >
                    <Input
                        {...register("email")}
                        type="text"
                        placeholder="Enter your email address"
                        error={!!errors.email}
                        className="h-12"
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
                    disabled={!isValid || isProcessing}
                >
                    Sign in
                </Button>
            </div>

            {message && <h6 className='my-4 text-sm text-primary-600'><span className='text-red-500 text-2xl'>* </span> {message}</h6>}

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
