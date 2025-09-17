'use client';

import React, { RefObject, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/animations/useScrollAnimation';
import { STATS } from '@/lib/constants';

export const Stats: React.FC = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(statsRef as RefObject<HTMLElement>);

    return (
        <section
            ref={statsRef}
            className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-16 px-6 text-center"
        >
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {STATS.map((stat, index) => (
                        <div key={index} className="text-center">
                            <span
                                className={`text-4xl md:text-5xl font-extrabold block mb-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                {stat.number}
                            </span>
                            <span
                                className={`text-base opacity-90 transition-all duration-1000 ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}
                                style={{ transitionDelay: `${index * 200 + 100}ms` }}
                            >
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};