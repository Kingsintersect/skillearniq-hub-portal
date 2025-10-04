"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLoginFormContext } from '@/contexts/FormContext';
import { signInFormData } from '@/schema/auth-schema';
import Link from 'next/link';
import React from 'react'
import { UseFormRegister } from 'react-hook-form';

const RoleSelector = () => {
    const { form } = useLoginFormContext()

    return (
        <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className='text-accent'>I Am A...</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center gap-5"
                        >
                            <FormItem className="flex items-center gap-3">
                                <FormControl className='rounded-none'>
                                    <RadioGroupItem value="general" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    GENERAL LOGIN
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-3">
                                <FormControl className='rounded-none'>
                                    <RadioGroupItem value="parentotprequest" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    PARENT LOGIN
                                </FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RoleSelector

// Remember me and forgot password section
interface FormActionsProps {
    register: UseFormRegister<signInFormData>;
}
export const FormActions = ({ register }: FormActionsProps) => (
    <div className="flex items-center justify-between animate-in fade-in-50 duration-700 delay-500">
        <div className="flex items-center">
            <input
                {...register("rememberMe")}
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Remember me
            </label>
        </div>
        <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
        >
            Forgot password?
        </Link>
    </div>
);

// Apply section component

export const ApplySection = () => (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center animate-in fade-in-50 duration-700 delay-700">
        <p className="text-sm text-gray-600 mb-2">New to our platform?</p>
        <Link
            href="/auth/create-account"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors cursor-pointer"
        >
            Apply for an admission
        </Link>
    </div>
);