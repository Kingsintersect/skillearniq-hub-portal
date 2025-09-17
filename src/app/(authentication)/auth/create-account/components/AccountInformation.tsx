"use client";

import { InputField } from '@/components/core/forms/input-field'
import { SignUpFormData } from '@/schema/sign-up-schema';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import { GenericHookFormProps } from '@/types/forms';

type AccountInformationProps = GenericHookFormProps<SignUpFormData>;

export const AccountInformation: React.FC<AccountInformationProps> = ({ register, errors }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <InputField
                    id='email'
                    {...register('email')}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your university email"
                    error={errors.email?.message}
                    required
                />

                {/* <InputField
                    id='regNumber'
                    {...register('regNumber')}
                    label="Student Registration Number"
                    placeholder="Enter your student Registration Number"
                    error={errors.regNumber?.message}
                    required
                /> */}

                <InputField
                    id='username'
                    {...register('username')}
                    label="Username"
                    placeholder="Enter your username"
                    error={errors.username?.message}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <InputField
                        id='password'
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="Create a password"
                        error={errors.password?.message}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative">
                    <InputField
                        id='confirmPassword'
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        error={errors.confirmPassword?.message}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>
        </div>
    )
}
