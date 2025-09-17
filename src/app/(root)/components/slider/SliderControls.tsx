"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderControlsProps {
    onPrevious: () => void;
    onNext: () => void;
    currentSlide: number;
    totalSlides: number;
}

export const SliderControls = ({
    onPrevious,
    onNext,
    currentSlide,
    totalSlides
}: SliderControlsProps) => {
    return (
        <>
            {/* Arrow Controls */}
            <button
                onClick={onPrevious}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 group-hover:animate-pulse" />
            </button>

            <button
                onClick={onNext}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 group-hover:animate-pulse" />
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div
                    className="progress-bar-fill h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
            </div>

            {/* Slide Counter */}
            <div className="absolute top-8 right-8 z-20 text-white">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
                    <span className="text-lg font-semibold">
                        {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white/60">/</span>
                    <span className="text-white/60">
                        {String(totalSlides).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </>
    );
};