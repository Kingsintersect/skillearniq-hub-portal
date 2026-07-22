"use client";

import { SlideData } from "@/types/slide";
import Link from "next/link";

interface SlideContentProps {
    data: SlideData;
}

export const SlideContent = ({ data }: SlideContentProps) => {

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative z-10 p-8 lg:p-12 max-w-2xl">
            <div className="slide-category inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {data.category}
            </div>

            <h1 className="slide-title text-4xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                {data.title}
            </h1>

            <h2 className="slide-subtitle text-xl lg:text-2xl text-accent-300 mb-6 font-light">
                {data.subtitle}
            </h2>

            <p className="slide-description text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
                {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button className="slide-btn inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-200 shadow-sm cursor-pointer"
                    onClick={() => {
                        if (data.primaryAction.url) {
                            scrollToSection(data.primaryAction.url);
                        }
                    }}
                >
                    <span className="text-lg">{data.primaryAction.icon}</span>
                    {data.primaryAction.text}
                </button>

                <Link
                    href={`${data.secondaryAction.url}`}
                    className="inline-flex items-center justify-center slide-btn px-8 py-4 border border-white/40 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                    <span className="mr-2">{data.secondaryAction.icon}</span>
                    {data.secondaryAction.text}
                </Link>
            </div>
        </div>
    );
};