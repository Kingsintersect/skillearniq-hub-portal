"use client";

interface NavigationProps {
    totalSlides: number;
    currentSlide: number;
    onSlideSelect: (index: number) => void;
}

export const SliderNavigation = ({ totalSlides, currentSlide, onSlideSelect }: NavigationProps) => {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-3">
                {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => onSlideSelect(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-accent w-8'
                            : 'bg-white/40 hover:bg-white/70 w-2.5'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};