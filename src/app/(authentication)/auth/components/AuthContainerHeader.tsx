import { cn } from '@/lib/utils';
import React, { FC } from 'react'

interface AuthContainerHeaderProps {
    heading: string;
    subHeading: string;
    headingClass?: string;
    subHeadingClass?: string;
}
export const AuthContainerHeader: FC<AuthContainerHeaderProps> = ({ heading, subHeading, headingClass, subHeadingClass }) => {
    return (
        <div className="mb-8 animate-in fade-in-50 duration-700 delay-200">
            <h2 className={cn("text-3xl font-bold text-gray-900 mb-2", headingClass)}>
                {heading}
            </h2>
            <p className={cn("text-gray-600", subHeadingClass)}>
                {subHeading}
            </p>
        </div>
    )
}
