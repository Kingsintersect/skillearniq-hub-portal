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
        sm: { icon: 'w-8 h-8 text-xs', text: 'text-sm' },
        md: { icon: 'w-12 h-12 text-sm', text: 'text-lg' },
        lg: { icon: 'w-20 h-20 text-base', text: 'text-xl' },
    };

    return (
        <Link href="/" className="flex items-center gap-3 text-inherit no-underline">
            <div
                className={`relative ${sizes[size].icon} bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold`}
            >
                <Image
                    src={`/logo/logo.jpg`}
                    alt="LOGO IMAGE"
                    fill
                    className="object-contain"
                />
            </div>
            {showText && (
                <span className={`${sizes[size].text} font-bold text-gray-800`}>
                    {SITE_TITLE}
                </span>
            )}
        </Link>
    );
};