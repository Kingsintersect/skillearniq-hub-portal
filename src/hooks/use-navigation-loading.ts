'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const useNavigationLoading = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleComplete = () => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        };

        // Complete loading when route actually changes
        if (isLoading) {
            handleComplete();
        }
    }, [pathname, searchParams, isLoading]);

    // Function to start loading manually (called from enhanced link)
    const startLoading = () => {
        setIsLoading(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 30;
            });
        }, 200);

        // Store interval ID for cleanup
        return interval;
    };

    return { isLoading, progress, startLoading };
};



// 'use client';

// import { useEffect, useState } from 'react';
// import { usePathname, useSearchParams } from 'next/navigation';

// export const useNavigationLoading = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const pathname = usePathname();
//     const searchParams = useSearchParams();

//     useEffect(() => {
//         const handleStart = () => {
//             alert(123)
//             setIsLoading(true);
//             setProgress(0);

//             // Simulate progress
//             const interval = setInterval(() => {
//                 setProgress(prev => {
//                     if (prev >= 90) {
//                         clearInterval(interval);
//                         return 90;
//                     }
//                     return prev + Math.random() * 30;
//                 });
//             }, 200);

//             return () => clearInterval(interval);
//         };

//         const handleComplete = () => {
//             setProgress(100);
//             setTimeout(() => {
//                 setIsLoading(false);
//                 setProgress(0);
//             }, 200);
//         };

//         // Start loading on route change
//         setIsLoading(true);
//         const cleanup = handleStart();

//         // Complete loading after a short delay (simulating page load)
//         const timer = setTimeout(handleComplete, 100);

//         return () => {
//             cleanup?.();
//             clearTimeout(timer);
//         };
//     }, [pathname, searchParams]);

//     return { isLoading, progress };
// };