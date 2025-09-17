import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hover = true
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300',
                hover && 'hover:-translate-y-2 hover:shadow-xl',
                className
            )}
        >
            {children}
        </div>
    );
};
