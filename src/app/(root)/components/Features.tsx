import { SITE_TITLE } from '@/config';
import React from 'react';
import { Card } from './HomeCard';
import { FEATURES } from '@/lib/constants';

export const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 px-6 bg-gray-50">
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
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

