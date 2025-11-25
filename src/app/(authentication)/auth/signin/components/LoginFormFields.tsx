"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLoginFormContext } from '@/contexts/FormContext';
import { signInFormData } from '@/schema/auth-schema';
import Link from 'next/link';
import React from 'react'
import { UseFormRegister } from 'react-hook-form';

const RoleSelector = () => {
    const { form, clearOTP, parentOTP } = useLoginFormContext()

    return (
        <div className="mb-5 text-center">
            <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className='text-accent dark:text-accent/90 text-base font-semibold'>
                            I Am A...
                        </FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                            >
                                <FormItem className="flex items-center gap-3 group cursor-pointer">
                                    <FormControl>
                                        <RadioGroupItem
                                            value="general"
                                            className="text-blue-600 dark:text-blue-400 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group-hover:scale-110"
                                        />
                                    </FormControl>
                                    <FormLabel className="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white cursor-pointer">
                                        GENERAL LOGIN
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-3 group cursor-pointer">
                                    <FormControl>
                                        <RadioGroupItem
                                            value="parentotprequest"
                                            className="text-blue-600 dark:text-blue-400 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group-hover:scale-110"
                                        />
                                    </FormControl>
                                    <FormLabel className="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white cursor-pointer">
                                        PARENT LOGIN
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {parentOTP && (
                <div className="w-full my-3 text-right">
                    <Button
                        onClick={clearOTP}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                    >
                        Clear OTP
                    </Button>
                </div>
            )}
        </div>
    )
}

export default RoleSelector

// Remember me and forgot password section
interface FormActionsProps {
    register: UseFormRegister<signInFormData>;
}
export const FormActions = ({ register }: FormActionsProps) => (
    <div className="flex items-center justify-between animate-in fade-in-50 duration-700 delay-500">
        <div className="flex items-center group cursor-pointer">
            <input
                {...register("rememberMe")}
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400"
            />
            <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white"
            >
                Remember me
            </label>
        </div>
        <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-300 cursor-pointer hover:underline underline-offset-2"
        >
            Forgot password?
        </Link>
    </div>
);

// Apply section component
export const ApplySection = () => (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center animate-in fade-in-50 delay-700 transition-colors duration-300">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
            New to our platform?
        </p>
        <Link
            href="/auth/create-account"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-all duration-300 cursor-pointer hover:underline underline-offset-4 group"
        >
            Apply for an admission
            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
    </div>
);