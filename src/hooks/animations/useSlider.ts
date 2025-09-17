"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSliderOptions {
    totalSlides: number;
    autoplayDelay?: number;
    onSlideChange?: (index: number) => void;
}

export const useSlider = ({
    totalSlides,
    autoplayDelay = 5000,
    onSlideChange
}: UseSliderOptions) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const startAutoplay = useCallback(() => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);

        autoplayRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const nextSlide = (prev + 1) % totalSlides;
                onSlideChange?.(nextSlide);
                return nextSlide;
            });
        }, autoplayDelay);
    }, [totalSlides, autoplayDelay, onSlideChange]);

    const stopAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const resetAutoplay = useCallback(() => {
        stopAutoplay();
        startAutoplay();
    }, [stopAutoplay, startAutoplay]);

    const goToSlide = useCallback((index: number) => {
        if (isAnimating || index === currentSlide) return;
        setCurrentSlide(index);
        onSlideChange?.(index);
        resetAutoplay();
    }, [currentSlide, isAnimating, onSlideChange, resetAutoplay]);

    const nextSlide = useCallback(() => {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }, [currentSlide, totalSlides, goToSlide]);

    const prevSlide = useCallback(() => {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }, [currentSlide, totalSlides, goToSlide]);

    // Initialize autoplay
    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, [startAutoplay, stopAutoplay]);

    return {
        currentSlide,
        isAnimating,
        setIsAnimating,
        nextSlide,
        prevSlide,
        goToSlide,
        startAutoplay,
        stopAutoplay,
        resetAutoplay
    };
};