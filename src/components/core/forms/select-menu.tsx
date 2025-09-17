import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    onValueChange?: (value: string) => void;
    value?: string;
    defaultValue?: string;
    className?: string;
    size?: "sm" | "default";
    required?: boolean;
}

export const DynamicSelect: React.FC<SelectProps> = ({
    label,
    error,
    options = [],
    placeholder = "Select an option",
    disabled = false,
    value,
    defaultValue,
    onValueChange,
    className = "",
    size = "default",
    required = false,
    // ...props
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {/* Label */}
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Select Component */}
            <Select
                disabled={disabled}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
            // {...props}
            >
                <SelectTrigger
                    className={`w-full ${error ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''}`}
                    size={size}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <SelectItem
                                key={`${option.value}-${index}`}
                                value={String(option.value)}
                            >
                                {option.label}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="" disabled>
                            No options available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};
