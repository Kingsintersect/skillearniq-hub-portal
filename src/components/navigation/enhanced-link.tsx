'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React, { MouseEvent, ReactNode } from 'react';
import { useNavigation } from '@/providers/navigation-provider';

interface EnhancedLinkProps extends Omit<LinkProps, 'href'> {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const EnhancedLink: React.FC<EnhancedLinkProps> = ({
    href,
    children,
    className,
    onClick,
    ...props
}) => {
    const router = useRouter();
    const { startNavigation } = useNavigation();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Call custom onClick if provided
        onClick?.(e);

        // Don't show loading for external links
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        // Don't show loading if default was prevented
        if (e.defaultPrevented) return;

        // Don't show loading for hash links on same page
        if (href.startsWith('#')) return;

        // Check if it's the same page (including search params)
        const currentPath = window.location.pathname + window.location.search;
        const targetPath = href.includes('?') ? href : href + window.location.search;

        if (targetPath === currentPath) return;

        // Start loading indicator immediately on click
        startNavigation();
    };

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
};


// 'use client';

// import Link, { LinkProps } from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { MouseEvent, ReactNode } from 'react';
// import { useNavigation } from '@/providers/navigation-provider';

// interface EnhancedLinkProps extends Omit<LinkProps, 'href'> {
//     href: string;
//     children: ReactNode;
//     className?: string;
//     onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
// }

// export const EnhancedLink: React.FC<EnhancedLinkProps> = ({
//     href,
//     children,
//     className,
//     onClick,
//     ...props
// }) => {
//     const router = useRouter();
//     const { startNavigation } = useNavigation();

//     const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
//         // Call custom onClick if provided
//         onClick?.(e);

//         // Don't show loading for external links
//         if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
//             return;
//         }

//         // Don't show loading if default was prevented
//         if (e.defaultPrevented) return;

//         // Don't show loading for same page navigation
//         if (href === window.location.pathname + window.location.search) return;

//         // Start loading indicator
//         startNavigation();
//     };

//     return (
//         <Link
//             href={href}
//             className={className}
//             onClick={handleClick}
//             {...props}
//         >
//             {children}
//         </Link>
//     );
// };