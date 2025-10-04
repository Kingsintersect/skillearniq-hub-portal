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
        <div className="mb-8 animate-in fade-in-50 duration-700 delay-200 flex inset-ring-accent justify-start gap-5">
            {Icon && (
                <div className="flex items-center justify-center">
                    <Icon className="h-10 w-10 mx-auto mb-4 text-blue-500" />
                </div>
            )}
            <div className="">
                <h2 className={cn("text-3xl font-bold text-gray-900 mb-2", headingClass)}>
                    {heading}
                </h2>
                <p className={cn("text-gray-600", subHeadingClass)}>
                    {subHeading}
                </p>
            </div>
        </div>
    )
}
