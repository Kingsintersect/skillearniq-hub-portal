"use client";

import { useRef, useEffect } from "react";
import { slidesData } from "@/lib/slides";
import { useSlider } from "@/hooks/animations/useSlider";
import { useGSAPAnimations } from "@/hooks/animations/useGsapAnimation";
import { Particles } from "./Particles";
import { Slide } from "./Slide";
import { SliderNavigation } from "./Navigation";
import { SliderControls } from "./SliderControls";

export const HomepageSlider = () => {
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastSlideRef = useRef<number>(0);

    const {
        initializeFloatingElements,
        animateSlideTransition,
        animateContentIn,
        animateContentOut,
        animateProgressBar,
    } = useGSAPAnimations();

    const {
        currentSlide,
        setIsAnimating,
        nextSlide,
        prevSlide,
        goToSlide,
        startAutoplay,
        stopAutoplay,
    } = useSlider({
        totalSlides: slidesData.length,
        autoplayDelay: 5000,
        onSlideChange: (newSlideIndex: number) => {
            const currentSlideEl = slideRefs.current[lastSlideRef.current];
            const newSlideEl = slideRefs.current[newSlideIndex];

            if (!currentSlideEl || !newSlideEl) return;

            setIsAnimating(true);

            const direction =
                newSlideIndex > lastSlideRef.current ? "next" : "prev";

            // Animate content out
            const currentContent = currentSlideEl.querySelector(
                ".relative.z-10"
            ) as HTMLElement;
            if (currentContent) {
                animateContentOut(currentContent);
            }

            // Animate slide transition
            animateSlideTransition(currentSlideEl, newSlideEl, direction, () => {
                setIsAnimating(false);
            });

            // Animate new content in
            const newContent = newSlideEl.querySelector(
                ".relative.z-10"
            ) as HTMLElement;
            if (newContent) {
                setTimeout(() => {
                    animateContentIn(newContent);
                }, 400);
            }

            lastSlideRef.current = newSlideIndex;
        },
    });

    // Initialize animations on mount
    useEffect(() => {
        initializeFloatingElements();

        // Animate first slide content
        const firstSlideContent = slideRefs.current[0]?.querySelector(
            ".relative.z-10"
        ) as HTMLElement;
        if (firstSlideContent) {
            setTimeout(() => {
                animateContentIn(firstSlideContent);
            }, 100);
        }

        // Initialize progress bar
        animateProgressBar(1 / slidesData.length);
    }, [initializeFloatingElements, animateContentIn, animateProgressBar]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [prevSlide, nextSlide]);

    // Touch/Swipe support
    useEffect(() => {
        let startX: number | null = null;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (startX === null) return;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startX = null;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("touchstart", handleTouchStart);
            container.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchend", handleTouchEnd);
            }
        };
    }, [nextSlide, prevSlide]);

    return (
        <section
            id={`home`}
            ref={containerRef}
            className="relative w-full h-screen bg-black text-white overflow-hidden"
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
        >
            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="floating-element absolute top-[10%] left-[10%] w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="floating-element absolute top-[60%] right-[15%] w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
                <div className="floating-element absolute bottom-[20%] left-[70%] w-56 h-56 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* Background Particles */}
            <Particles />

            {/* Slides */}
            {slidesData.map((slide, index) => (
                <Slide
                    key={slide.id}
                    data={slide}
                    isActive={index === currentSlide}
                    slideRef={(el) => (slideRefs.current[index] = el)}
                />
            ))}

            {/* Navigation Controls */}
            <SliderNavigation
                totalSlides={slidesData.length}
                currentSlide={currentSlide}
                onSlideSelect={goToSlide}
            />

            {/* Slider Controls */}
            <SliderControls
                onPrevious={prevSlide}
                onNext={nextSlide}
                currentSlide={currentSlide}
                totalSlides={slidesData.length}
            />
        </section>
    );
};

