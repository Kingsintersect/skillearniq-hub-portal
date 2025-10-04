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
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/auth/signin');
            return;
        }

        if (user && !allowedRoles.includes(user.role)) {
            const roleRoutes = {
                [UserRole.ADMIN]: '/admin/dashboard',
                [UserRole.MANAGER]: '/admin/dashboard',
                [UserRole.TEACHER]: '/teacher/dashboard',
                [UserRole.PARENT]: '/parent/dashboard',
                [UserRole.STUDENT]: '/student/dashboard',
            };

            const redirectPath = roleRoutes[user.role as UserRole] || '/auth/signin';

            if (!pathname.startsWith(redirectPath.replace('/dashboard', ''))) {
                router.push(redirectPath);
            }
        }
    }, [user, isLoading, isAuthenticated, router, allowedRoles, pathname]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
