'use client';

import React from 'react';

interface ProgressBarProps {
    progress: number;
    className?: string;
    height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    className = '',
    height = 'h-1'
}) => {
    return (
        <div className={`w-full bg-gray-200 ${height} ${className}`}>
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
};