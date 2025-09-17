'use client'
import { useAuth } from '@/hooks/use-auth';
import { signInFormData } from '@/schema/sign-in-schema';
import { AuthenState } from '@/types/auth';
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import React, { createContext, useContext } from 'react';
interface AuthProviderProps {
    children: React.ReactNode
    session: Session | null
}
interface AuthContextType extends AuthenState {
    login: (credentials: signInFormData) => void;
    logout: (callbackUrl?: string) => void;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    clearAuthenticationData: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children, session }: AuthProviderProps) {
    const auth = useAuth();

    return (
        <SessionProvider session={session}>
            <AuthContext.Provider value={auth} >
                {children}

            </AuthContext.Provider>
        </SessionProvider>
    )
}


export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}