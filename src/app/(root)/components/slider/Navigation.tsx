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
                        className={`w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden group ${index === currentSlide
                            ? 'bg-blue-500 scale-125'
                            : 'bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    </button>
                ))}
            </div>
        </div>
    );
};