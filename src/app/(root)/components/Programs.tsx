import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PROGRAMS } from '@/lib/constants';
import React from 'react';

export const Programs: React.FC = () => {
    return (
        <section id="programs" className="py-20 px-6 bg-white min-h-[85vh] flex items-center justify-center">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Featured Academic Programs
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Choose from our comprehensive range of business programs designed to meet
                        diverse career goals and industry demands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PROGRAMS.map((program, index) => (
                        <Card key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-t-4 border-t-accent">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <div className="bg-[#23608c]/10 p-2 rounded-md">
                                    <program.icon className="h-6 w-6 text-[#23608c]" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-800 mb-4">{program.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className='text-gray-600 mb-6 leading-relaxed'>{program.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {program.duration}
                                </span>
                                <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 cursor-pointer bg-transparent border-none">
                                    Learn More →
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};