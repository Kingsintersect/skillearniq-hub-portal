'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { UserRole } from '@/config';
import { LoadingSpinner } from './ui/loading-spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/signin');
        } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
            if ([UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
                if (pathname !== '/admin') {
                    router.push('/admin/dashboard');
                }
            } else if ([UserRole.TEACHER].includes(user.role as UserRole)) {
                if (pathname !== '/teacher') {
                    router.push('/teacher/dashboard');
                }
            } else if ([UserRole.PARENT].includes(user.role as UserRole)) {
                if (pathname !== '/parent') {
                    router.push('/parent/dashboard');
                }
            } else {
                if (pathname !== '/student') {
                    router.push('/student/dashboard');
                }
            }
        }
    }, [user, isLoading, router, allowedRoles, pathname]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
