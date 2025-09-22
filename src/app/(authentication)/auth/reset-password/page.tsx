'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await fetch(`/api/auth/verify-token?token=${token}`);
            const data = await response.json();
            setTokenValid(data.valid);
        } catch (error) {
            setTokenValid(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setMessage(data.message || 'An error occurred.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (tokenValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Verifying token...</div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Invalid or expired token</h2>
                    <p className="mt-2">The reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            New Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="New password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md ${message.includes('error') || message.includes('not match') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting...' : 'Reset password'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}