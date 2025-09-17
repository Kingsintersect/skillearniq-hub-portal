"use client";

import { Input } from "@/components/layout/form";
import { signInFormData } from "@/schema/sign-in-schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";

// Password input with toggle component
interface PasswordInputProps {
    register: UseFormRegisterReturn;
    error?: boolean;
    placeholder?: string;
}

export const PasswordInput = ({ register, error, placeholder }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <Input
                {...register}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                error={error}
                className="h-12 pr-12"
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};

// Form header component
export const FormHeader = () => (
    <div className="mb-8 animate-in fade-in-50 duration-700 delay-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LOGIN</h1>
        <p className="text-gray-600">Please sign in to your account for more adventure!</p>
    </div>
);

// Remember me and forgot password section
interface FormActionsProps {
    register: UseFormRegister<signInFormData>;
    onForgotPassword: () => void;
}

export const FormActions = ({ register, onForgotPassword }: FormActionsProps) => (
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
        <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
            Forgot password?
        </button>
    </div>
);

// Apply section component
interface ApplySectionProps {
    onApplyInfo: () => void;
}

export const ApplySection = ({ onApplyInfo }: ApplySectionProps) => (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center animate-in fade-in-50 duration-700 delay-700">
        <p className="text-sm text-gray-600 mb-2">New to our platform?</p>
        <button
            type="button"
            onClick={onApplyInfo}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors cursor-pointer"
        >
            Apply for an admission
        </button>
    </div>
);
