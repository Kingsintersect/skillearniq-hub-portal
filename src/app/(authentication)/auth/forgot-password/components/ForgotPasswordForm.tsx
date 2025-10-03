"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForgotPasswordForm } from '@/hooks/use-forgot-password';
import Link from 'next/link';
import React from 'react'
import { FormState } from 'react-hook-form';

export const ForgotPasswordForm = () => {
    const {
        form,
        onSubmit,
        message,
        isProcessing,
    } = useForgotPasswordForm();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-7">
                <div className="animate-in fade-in-50 duration-700 delay-300">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eneter email address" {...field} />
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
                        Request Token
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
        </Form>
    )
}
