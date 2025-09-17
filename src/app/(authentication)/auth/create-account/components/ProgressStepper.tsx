import { Check } from 'lucide-react';
import React, { FC } from 'react'

interface ProgressStepperProps {
    steps: {
        id: string;
        title: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
    getStepStatus: (stepIndex: number) => "completed" | "current" | "upcoming";
    goToStep: (stepIndex: number) => Promise<void>;
    currentStep: number;
}

export const ProgressStepper: FC<ProgressStepperProps> = ({ steps, getStepStatus, goToStep, currentStep }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center flex-1">
                                <button
                                    onClick={() => goToStep(index)}
                                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-200 ${status === 'completed'
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : status === 'current'
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {status === 'completed' ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <Icon className="w-6 h-6" />
                                    )}
                                </button>
                                <div className="text-center">
                                    <p className={`text-sm font-medium ${status === 'current' ? 'text-blue-600' :
                                        status === 'completed' ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                    }`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}
