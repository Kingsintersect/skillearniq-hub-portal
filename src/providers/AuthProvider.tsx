'use client'
import { useAuth } from '@/hooks/use-auth';
import { signInFormData } from '@/schema/auth-schema';
import { AuthenState } from '@/types/auth';
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import React, { createContext, useContext } from 'react';
import { ClientOnly } from '@/components/layout/ClientOnly';
interface AuthProviderProps {
    children: React.ReactNode
    session: Session | null
}
interface AuthContextType extends AuthenState {
    login: (credentials: signInFormData) => void;
    requestParentOTP: (credentials: signInFormData) => void;
    logout: (callbackUrl?: string) => void;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    clearAuthenticationData: () => void;
    removeparentOTP: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children, session }: AuthProviderProps) {
    return (
        <SessionProvider session={session}>
            <AuthContextBridge>
                <ClientOnly>{children}</ClientOnly>
            </AuthContextBridge>
        </SessionProvider>
    )
}

/** Rendered inside SessionProvider so useSession() is available inside useAuth(). */
function AuthContextBridge({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}