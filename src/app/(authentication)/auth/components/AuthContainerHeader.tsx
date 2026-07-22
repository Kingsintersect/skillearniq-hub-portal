import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React, { FC } from 'react'

interface AuthContainerHeaderProps {
    heading: string;
    subHeading: string;
    headingClass?: string;
    subHeadingClass?: string;
    Icon?: LucideIcon;
}
export const AuthContainerHeader: FC<AuthContainerHeaderProps> = ({ heading, subHeading, headingClass, subHeadingClass, Icon }) => {
    return (
        <div className="mb-8 animate-in fade-in-50 duration-700 delay-200 flex items-center justify-start gap-4">
            {Icon && (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                </span>
            )}
            <div>
                <h2 className={cn(
                    "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300",
                    headingClass
                )}>
                    {heading}
                </h2>
                <p className={cn(
                    "mt-1 text-gray-600 dark:text-gray-300 transition-colors duration-300",
                    subHeadingClass
                )}>
                    {subHeading}
                </p>
            </div>
        </div>
    )
}
