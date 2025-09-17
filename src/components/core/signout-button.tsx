'use client'
import { useAuthContext } from '@/app/providers/AuthProvider';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
    const { logout, isLoggingOut } = useAuthContext();
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => logout}
            loading={isLoggingOut}
            className="text-gray-500 hover:text-gray-700"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Sign Out</span>
        </Button>
    )
}