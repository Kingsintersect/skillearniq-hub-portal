import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, required, id, ...props }, ref) => {
        const reactId = useId();
        const inputId = id || reactId;

        return (
            <div className="space-y-2">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <Input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'transition-all duration-200',
                        error && 'border-red-300 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'Input';
