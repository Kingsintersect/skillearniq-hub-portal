'use client'

import React from 'react';

interface CompletionGaugeProps {
  value: number;
  max: number;
  title: string;
  subtitle: string;
  color?: string;
}

export const CompletionGauge: React.FC<CompletionGaugeProps> = ({ 
  value, 
  max, 
  title, 
  subtitle, 
  color = '#4f46e5' 
}) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{value}/{max}</div>
            <div className="text-sm text-gray-600">{percentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </div>
  );
};