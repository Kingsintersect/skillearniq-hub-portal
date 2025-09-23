"use client";

import { useResetPasswordForm } from '@/hooks/use-reset-password';
import React from 'react'
import { VerifyToken } from './verifyToken';
import { ResetPasswordForm } from './resetPasswordForm';
import { AuthContainerHeader } from '../../components/AuthContainerHeader';

export const StateResolver = () => {
    const { verifyState, isVerifying } = useResetPasswordForm();

    return (
        <section className='grid grid-cols-1 md:grid-cols-3'>
            <div
                className={`
                    ${verifyState ? "hidden md:block" : "block"} 
                    col-span-2 bg-primary-100
                `}
            >
                <VerifyToken isTokenValid={verifyState} isVerifying={isVerifying} />
            </div>

            <div className="min-h-screen col-span-1 flex flex-col justify-center px-10 bg-primary-50">
                <AuthContainerHeader
                    heading='Reset your password'
                    subHeading='Enter your new password below.'
                />
                <ResetPasswordForm verifyState={verifyState} />
            </div>
        </section>
    );
};
