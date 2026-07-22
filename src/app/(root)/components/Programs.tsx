"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/animations/useScrollAnimation';
import { PROGRAMS } from '@/lib/constants';
import React, { RefObject, useRef } from 'react';

export const Programs: React.FC = () => {
    const pRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(pRef as RefObject<HTMLElement>);

    return (
        <section
            ref={pRef}
            id="programs"
            className="py-20 px-6 bg-white dark:bg-gray-800 min-h-[85vh] flex items-center justify-center"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        Programs
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Academic Programs
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose from our comprehensive range of programs designed to meet
                        diverse career goals and industry demands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROGRAMS.map((program, index) => (
                        <Card key={index}
                            className={`group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                            style={{ transitionDelay: `${index * 120}ms` }}
                        >
                            <CardHeader className="flex flex-row items-center gap-3 p-0">
                                <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-lg">
                                    <program.icon className="h-6 w-6 text-primary dark:text-primary-400" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{program.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                                <CardDescription className='text-gray-600 dark:text-gray-300 text-base leading-relaxed'>{program.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center p-0 mt-6">
                                <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {program.duration}
                                </span>
                                <Button className="text-accent font-medium hover:text-accent-600 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 h-auto shadow-none group-hover:translate-x-0.5">
                                    Learn More →
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};