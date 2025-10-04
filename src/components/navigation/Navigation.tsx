'use client';

import React, { useState } from 'react';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '../ui/mood-toggle';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isLoggingOut } = useAuthContext();
    const pathname = usePathname();
    const role = user?.role.toLocaleLowerCase();

    const isHomepage = pathname === '/'

    const handleNavClick = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group cursor-pointer bg-transparent border-none ${!isHomepage ? " hidden" : ""}`}
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
                    </button>
                ))}
                {user ? (
                    <>
                        <div className="hidden md:block">
                            <Link href={`/${role}/profile`} className='flex gap-3 items-center'>
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                            </Link>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            loading={isLoggingOut}
                            className="text-red-500 hover:text-red-700"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Sign Out</span>
                        </Button>
                    </>
                ) : (
                    <Button
                        size='sm'
                        // onClick={onLoginClick}
                        asChild
                    >
                        <Link href={`/auth/signin`}>
                            Sign In
                        </Link>
                    </Button>
                )}
                <ModeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-gray-600 text-2xl cursor-pointer bg-transparent border-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                ☰
            </button>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <nav className="absolute top-full left-0 right-0 bg-white shadow-lg p-5 flex flex-col gap-4 md:hidden">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-left cursor-pointer bg-transparent border-none ${!isHomepage ? " hidden" : ""}`}
                        >
                            {item.label}
                        </button>
                    ))}
                    {user ? (
                        <>
                            <div className="block">
                                <Link href={`/${role}/profile`} className='flex gap-3 items-center'>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                                </Link>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                loading={isLoggingOut}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="inline ml-1">Sign Out</span>
                            </Button>
                        </>
                    ) : (
                        <Button
                            size='sm'
                            className='mt-2'
                            asChild
                        >
                            <Link href={`/auth/signin`}>
                                Sign In
                            </Link>
                        </Button>
                    )}
                </nav>
            )}
        </>
    );
};