'use client'

import React, { ReactNode } from 'react'
import { BrandingPanel } from '@/components/global/generic-componenets';

const AuthContauiner = ({ children }: { children: ReactNode }) => {

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                <div className="grid md:grid-cols-2 min-h-[600px]">
                    {/* Left Panel - Branding */}
                    <BrandingPanel />

                    {/* Right Panel - Login Form */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthContauiner
