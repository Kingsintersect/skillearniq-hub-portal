'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NavigationContextType {
    isNavigating: boolean;
    progress: number;
    startNavigation: () => void;
    stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

interface NavigationProviderProps {
    children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startNavigation = useCallback(() => {
        setIsNavigating(true);
        setProgress(0);

        // Clear any existing interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        // Start progress simulation
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    return 90;
                }
                return prev + Math.random() * 20 + 5; // More consistent progress
            });
        }, 200);
    }, []);

    const stopNavigation = useCallback(() => {
        // Clear progress interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }

        // Complete progress quickly
        setProgress(100);
        setTimeout(() => {
            setIsNavigating(false);
            setProgress(0);
        }, 200);
    }, []);

    const value = {
        isNavigating,
        progress,
        startNavigation,
        stopNavigation,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};


// 'use client';

// import React, { createContext, useContext, useState, useCallback } from 'react';

// interface NavigationContextType {
//     isNavigating: boolean;
//     startNavigation: () => void;
//     stopNavigation: () => void;
// }

// const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// export const useNavigation = () => {
//     const context = useContext(NavigationContext);
//     if (!context) {
//         throw new Error('useNavigation must be used within a NavigationProvider');
//     }
//     return context;
// };

// interface NavigationProviderProps {
//     children: React.ReactNode;
// }

// export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
//     const [isNavigating, setIsNavigating] = useState(false);

//     const startNavigation = useCallback(() => {
//         alert(1)
//         setIsNavigating(true);
//     }, []);

//     const stopNavigation = useCallback(() => {
//         alert(2)
//         setIsNavigating(false);
//     }, []);

//     const value = {
//         isNavigating,
//         startNavigation,
//         stopNavigation,
//     };

//     return (
//         <NavigationContext.Provider value={value}>
//             {children}
//         </NavigationContext.Provider>
//     );
// };