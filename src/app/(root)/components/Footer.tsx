import React from 'react';
import Link from 'next/link';
import { SITE_TITLE } from '@/config';
import { FOOTER_SECTIONS } from '@/lib/constants';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    {/* University Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-5">{SITE_TITLE}</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Leading business education institution in Nigeria, committed to developing
                            ethical leaders and innovative thinkers for the global economy.
                        </p>
                    </div>

                    {/* Footer Sections */}
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xl font-semibold mb-5">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-5">Contact Info</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li>📍 Awka, Anambra State, Nigeria</li>
                            <li>📞 +234 (0) 48 550 940</li>
                            <li>✉️ info@unizikbusiness.edu.ng</li>
                            <li>🌐 www.unizikbusiness.edu.ng</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 {SITE_TITLE}. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
};