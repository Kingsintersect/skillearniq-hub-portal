"use client";

import { Button } from '@/components/ui/button';
import {
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPasswordForm } from '@/hooks/use-reset-password';
import Link from 'next/link';
import React from 'react'

export const ResetPasswordForm = () => {
    const {
        form,
        onSubmit,
        isProcessing,
    } = useResetPasswordForm();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-7">
                <div className="animate-in fade-in-50 duration-700 delay-300">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="animate-in fade-in-50 duration-700 delay-500">
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="animate-in fade-in-50 duration-700 delay-600">
                    <Button
                        type="submit"
                        variant="gradient"
                        size="xl"
                        className="w-full"
                        loading={isProcessing}
                        disabled={!form.formState.isValid || isProcessing}
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
        </Form>
    )
}
