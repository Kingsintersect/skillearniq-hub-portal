'use client'
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
    const { logout, isLoggingOut } = useAuthContext();

    const handleLogout = () => {
        logout();
    };
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            loading={isLoggingOut}
            className="text-gray-500 hover:text-gray-700 bg-transparent"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Sign Out</span>
        </Button>
    )
}
