import { SITE_TITLE } from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LogoProps {
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ showText = true, size = 'md' }) => {
    const sizes = {
        sm: { icon: 'w-8 h-8', text: 'text-base' },
        md: { icon: 'w-10 h-10', text: 'text-lg' },
        lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    };

    // Playful wordmark: accent a trailing "IQ" if present (e.g. SkillEarnIQ)
    const title = SITE_TITLE;
    const hasIQ = /IQ$/.test(title);
    const base = hasIQ ? title.slice(0, -2) : title;

    return (
        <Link href="/" className="flex items-center gap-2.5 text-inherit no-underline">
            <div
                className={`relative ${sizes[size].icon} bg-primary rounded-xl overflow-hidden flex items-center justify-center text-white font-bold shrink-0`}
            >
                <Image
                    src={`/logo/logo.jpg`}
                    alt={`${title} logo`}
                    fill
                    className="object-contain"
                />
            </div>
            {showText && (
                <span className={`${sizes[size].text} font-extrabold tracking-tight text-gray-900 dark:text-white`}>
                    {base}
                    {hasIQ && <span className="text-accent">IQ</span>}
                </span>
            )}
        </Link>
    );
};
