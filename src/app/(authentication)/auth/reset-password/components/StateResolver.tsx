"use client";

import React from 'react'
import { VerifyToken } from './verifyToken';
import { ResetPasswordForm } from './resetPasswordForm';
import { AuthContainerHeader } from '../../components/AuthContainerHeader';
import { Fingerprint } from 'lucide-react';

export const StateResolver = () => {
    return (
        <section className='grid grid-cols-1 md:grid-cols-3'>
            <div
                className={`hidden md:block col-span-2 bg-primary-100`}
            >
                <VerifyToken />
            </div>

            <div className="min-h-screen col-span-1 flex flex-col justify-center px-10 bg-primary-50">
                <AuthContainerHeader
                    heading='Reset your password'
                    subHeading='Enter your new password below.'
                    Icon={Fingerprint}
                />
                <ResetPasswordForm />
            </div>
        </section>
    );
};
