'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/animations/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '../navigation/Navigation';
import { ModeToggle } from '@/components/ui/mood-toggle';

export const HomeHeader: React.FC = () => {
    const { isScrolled } = useScrollAnimation();

    return (
        <header className="fixed top-4 inset-x-0 z-50 px-4">
            <div
                className={cn(
                    'relative mx-auto max-w-6xl flex justify-between items-center gap-4',
                    'rounded-full border border-gray-200/70 dark:border-gray-700/70',
                    'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
                    'px-4 sm:px-6 py-2.5 transition-all duration-300',
                    isScrolled ? 'shadow-xl shadow-black/5' : 'shadow-md shadow-black/5'
                )}
            >
                <Logo size="md" />
                <div className="flex items-center gap-2">
                    <Navigation />
                    {/* <ModeToggle /> */}
                </div>
            </div>
        </header>
    );
};
