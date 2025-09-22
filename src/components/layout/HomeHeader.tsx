'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/animations/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '../navigation/Navigation';

export const HomeHeader: React.FC = () => {
    const { isScrolled } = useScrollAnimation();

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300',
                isScrolled ? 'shadow-lg' : 'shadow-md'
            )}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-1">
                <Logo size='lg' />

                <Navigation />
            </div>
        </header>
    );
};
