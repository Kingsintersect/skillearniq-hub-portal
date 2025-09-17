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
            <div className="slide-category inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
                {data.category}
            </div>

            <h1 className="slide-title text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
                {data.title}
            </h1>

            <h2 className="slide-subtitle text-xl lg:text-2xl text-blue-400 mb-6 font-light">
                {data.subtitle}
            </h2>

            <p className="slide-description text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
                {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button className="slide-btn flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
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
                    className="block slide-btn px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                >
                    <span className="mr-2">{data.secondaryAction.icon}</span>
                    {data.secondaryAction.text}
                </Link>
            </div>
        </div>
    );
};