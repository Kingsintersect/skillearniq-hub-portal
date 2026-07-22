import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Building2, ArrowRight } from 'lucide-react';
import { SITE_TITLE } from '@/config';
import { FOOTER_SECTIONS } from '@/lib/constants';

const CONTACT_ITEMS = [
    { icon: MapPin, label: 'Federal Capital Territory, Abuja, Nigeria' },
    { icon: Building2, label: 'SkillEarnIQ Hub' },
    { icon: Phone, label: '+234 (0) 48 550 940', href: 'tel:+2340485550940' },
    { icon: Mail, label: 'info@skillearniqhub.edu.ng', href: 'mailto:info@skillearniqhub.edu.ng' },
    { icon: Globe, label: 'skillearniq-hub-portal.vercel.app', href: 'https://skillearniq-hub-portal.vercel.app' },
];

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
            {/* Call to action band */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">Ready to level up?</h3>
                        <p className="text-gray-400 mt-1">Join 12,000+ learners earning XP and badges every day. Free to start.</p>
                    </div>
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-accent-foreground font-medium py-3 px-6 rounded-full transition-colors whitespace-nowrap"
                    >
                        Start learning free
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">{SITE_TITLE}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            The playful way to build real skills. We turn learning into a game
                            of XP, badges and streaks — so curiosity keeps winning.
                        </p>
                    </div>

                    {/* Link sections */}
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={`${section.title}-${link.href}-${link.label}`}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white text-sm transition-colors duration-200 no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => (
                                <li key={label} className="flex items-start gap-3">
                                    <Icon className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                                    {href ? (
                                        <a href={href} className="text-gray-400 hover:text-white transition-colors break-all">
                                            {label}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">{label}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
