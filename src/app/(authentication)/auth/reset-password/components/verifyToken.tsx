import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { FC } from 'react'

interface VerifyTokenProps {
    isTokenValid: boolean | null;
    isVerifying: boolean;
}
export const VerifyToken: FC<VerifyTokenProps> = ({ isTokenValid, isVerifying }) => {
    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Loader2 size={60} className="text-secondary animate-spin" />
                    </div>
                    <div className="text-center text-primary">Verifying token...</div>
                </div>
            </div>
        );
    }
    if (!isVerifying && isTokenValid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <XCircle size={60} className="text-red-600 animate-pulse" />
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-10">
                        <h2 className="text-3xl font-bold text-primary">Invalid or expired token</h2>
                        <p className="mt-2 text-gray-600">The reset link is invalid or has expired.</p>
                    </div>
                    <Link
                        href="/auth/forgot-password"
                        className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle size={60} className="text-green-600 animate-pulse" />
                </div>
                <div className="text-center text-primary">Token Verified</div>
            </div>
        </div>
    )
}
