'use client';

import { useEffect, useState } from 'react';

export const useScrollAnimation = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { isScrolled };
};

export const useIntersectionObserver = (
    elementRef: React.RefObject<HTMLElement>,
    threshold: number = 0.1
) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold }
        );

        observer.observe(element);
        return () => observer.unobserve(element);
    }, [elementRef, threshold]);

    return isVisible;
};