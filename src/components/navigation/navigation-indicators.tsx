'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavigation } from '@/providers/navigation-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProgressBar } from '@/components/ui/progress-bar';

export const NavigationIndicators: React.FC = () => {
    const { isNavigating, progress, stopNavigation } = useNavigation();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Stop loading when route actually changes
    useEffect(() => {
        if (isNavigating) {
            // Small delay to ensure the page starts loading
            const timer = setTimeout(() => {
                stopNavigation();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [pathname, searchParams, isNavigating, stopNavigation]);

    if (!isNavigating) return null;

    return (
        <>
            {/* Top Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <ProgressBar
                    progress={progress}
                    className="bg-transparent"
                    height="h-0.5"
                />
            </div>

            {/* Top Right Spinner */}
            <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <LoadingSpinner size="sm" />
            </div>
        </>
    );
};


// 'use client';

// import React from 'react';
// import { ConfigurableNavigationIndicators } from './configurable-navigation-indicators';
// import { useMediaQuery } from '@/hooks/use-media-query';

// export const NavigationIndicators: React.FC = () => {
//     const isMobile = useMediaQuery('(max-width: 768px)');
//     // const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
//     // const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
//     // const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

//     const mobileConfig = {
//         showSpinner: false, // Hide spinner on mobile to save space
//         showProgressBar: true,
//         progressBarHeight: 'thick' as const, // Thicker bar for easier visibility on mobile
//         colors: {
//             spinner: 'green-600',
//             progressBar: 'green-500',
//         },
//     };

//     const desktopConfig = {
//         showSpinner: true,
//         showProgressBar: true,
//         spinnerPosition: 'top-right' as const,
//         progressBarHeight: 'thin' as const,
//         colors: {
//             spinner: 'blue-600',
//             progressBar: 'blue-500',
//         },
//     };

//     return (
//         <ConfigurableNavigationIndicators
//             config={isMobile ? mobileConfig : desktopConfig}
//         />
//     );
// };