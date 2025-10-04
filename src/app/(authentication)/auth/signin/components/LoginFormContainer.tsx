"use client";

import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginFormContext } from '@/contexts/FormContext';
import RoleSelector, { FormActions } from './LoginFormFields';
import { Button } from '@/components/ui/button';

const LoginFormContainer = () => {
    const { form, onSubmit, isLoggingIn, userType } = useLoginFormContext()

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <RoleSelector />

                <div className="grid gap-6 mt-10 mb-10">
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

                    {(userType === "parent") && <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{`OTP (Check your email address)`}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eneter the OTP you recieved in youe email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}

                    {(userType === "general") && <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}
                </div>

                <FormActions
                    register={form.register}
                />

                <div className="animate-in fade-in-50 duration-700 delay-600">
                    <Button
                        type="submit"
                        variant="gradient"
                        size="xl"
                        className="w-full"
                        loading={isLoggingIn}
                        disabled={!form.formState.isValid || isLoggingIn}
                    >
                        Sign in
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default LoginFormContainer

