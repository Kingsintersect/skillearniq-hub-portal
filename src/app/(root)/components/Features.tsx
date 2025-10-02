"use client";

import { SITE_TITLE } from '@/config';
import React, { RefObject, useRef } from 'react';
import { Card } from './HomeCard';
import { FEATURES } from '@/lib/constants';
import { useIntersectionObserver } from '@/hooks/animations/useScrollAnimation';

export const Features: React.FC = () => {
    const pRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(pRef as RefObject<HTMLElement>);

    return (
        <section
            ref={pRef}
            id="features"
            className="py-20 px-6 bg-gray-50"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Why Choose {SITE_TITLE}?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We provide comprehensive business education that combines theoretical knowledge
                        with practical skills to prepare leaders for the global marketplace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES.map((feature, index) => (
                        <Card key={index} className="text-center">
                            <div
                                className={`w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-all duration-300 hover:-translate-x-2 hover:shadow-lg border-t-4 border-t-accent 
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                    `}
                                style={{ transitionDelay: `${index * 300}ms` }}
                            >
                                {feature.icon}
                            </div>
                            <h3 className={`text-xl font-semibold text-gray-800 mb-4`}>
                                {feature.title}
                            </h3>
                            <p className={`text-gray-600 leading-relaxed transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                }`}
                                style={{ transitionDelay: `${index * 300 + 200}ms` }}
                            >
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
