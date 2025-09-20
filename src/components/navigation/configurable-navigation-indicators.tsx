'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavigation } from '@/providers/navigation-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProgressBar } from '@/components/ui/progress-bar';
import { NavigationConfig } from '@/types/navigation';
import { defaultNavigationConfig } from './utils/navigation-config';

interface ConfigurableNavigationIndicatorsProps {
    config?: Partial<NavigationConfig>;
}

export const ConfigurableNavigationIndicators: React.FC<ConfigurableNavigationIndicatorsProps> = ({
    config = {},
}) => {
    const { isNavigating, progress, stopNavigation } = useNavigation();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const finalConfig = { ...defaultNavigationConfig, ...config };

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

    const spinnerPositionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
    };

    const progressBarHeights = {
        thin: 'h-0.5',
        medium: 'h-1',
        thick: 'h-2',
    };

    return (
        <>
            {/* Progress Bar */}
            {finalConfig.showProgressBar && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <ProgressBar
                        progress={progress}
                        className="bg-transparent"
                        height={progressBarHeights[finalConfig.progressBarHeight]}
                    />
                </div>
            )}

            {/* Spinner */}
            {finalConfig.showSpinner && (
                <div className={`fixed ${spinnerPositionClasses[finalConfig.spinnerPosition]} z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg`}>
                    <LoadingSpinner size="sm" />
                </div>
            )}
        </>
    );
};

// 'use client';

// import React from 'react';
// import { useNavigationLoading } from '@/hooks/use-navigation-loading';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';
// import { ProgressBar } from '@/components/ui/progress-bar';
// import { NavigationConfig } from '@/types/navigation';
// import { defaultNavigationConfig } from '@/components/navigation/utils/navigation-config';

// interface ConfigurableNavigationIndicatorsProps {
//     config?: Partial<NavigationConfig>;
// }

// export const ConfigurableNavigationIndicators: React.FC<ConfigurableNavigationIndicatorsProps> = ({
//     config = {},
// }) => {
//     const { isLoading, progress } = useNavigationLoading();
//     const finalConfig = { ...defaultNavigationConfig, ...config };

//     if (!isLoading) return null;

//     const spinnerPositionClasses = {
//         'top-right': 'top-4 right-4',
//         'top-left': 'top-4 left-4',
//         'bottom-right': 'bottom-4 right-4',
//         'bottom-left': 'bottom-4 left-4',
//     };

//     const progressBarHeights = {
//         thin: 'h-0.5',
//         medium: 'h-1',
//         thick: 'h-2',
//     };

//     return (
//         <>
//             {/* Progress Bar */}
//             {finalConfig.showProgressBar && (
//                 <div className="fixed top-0 left-0 right-0 z-50">
//                     <ProgressBar
//                         progress={progress}
//                         className="bg-transparent"
//                         height={progressBarHeights[finalConfig.progressBarHeight]}
//                     />
//                 </div>
//             )}

//             {/* Spinner */}
//             {finalConfig.showSpinner && (
//                 <div className={`fixed ${spinnerPositionClasses[finalConfig.spinnerPosition]} z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg`}>
//                     <LoadingSpinner size="sm" />
//                 </div>
//             )}
//         </>
//     );
// };