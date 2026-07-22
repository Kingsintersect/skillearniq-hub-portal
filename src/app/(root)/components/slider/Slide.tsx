"use client";

import { SlideData } from "@/types/slide";
import { SlideContent } from "./SlideContent";

interface SlideProps {
    data: SlideData;
    isActive: boolean;
    slideRef?: (el: HTMLDivElement | null) => void;
}

export const Slide = ({ data, isActive, slideRef }: SlideProps) => {
    return (
        <div
            ref={slideRef}
            className={`absolute inset-0 opacity-0 ${isActive ? 'z-10' : 'z-0'}`}
            style={{
                backgroundImage: `url(${data.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            }}
        >
            {/* Legibility scrim: single neutral overlay so hero copy stays readable over any photo */}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            {/* Content positioned in the center-left */}
            <div className="absolute left-8 lg:left-16 top-1/2 transform -translate-y-1/2">
                <SlideContent data={data} />
            </div>
        </div>
    );
};