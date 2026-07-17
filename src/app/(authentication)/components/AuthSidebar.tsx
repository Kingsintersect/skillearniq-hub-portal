import { LottiePlayer } from '@/components/global/LottiePlayer';
import animationData from "@/assets/SecureCare Login Pulse.json";
import React from 'react';
import Link from 'next/link';

export default function AuthSidebar() {
    return (
        <div className="flex flex-col justify-between h-full w-full min-h-[600px] bg-gradient-to-br from-slate-900 via-blue-950 to-zinc-950 p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Background Decorative Ambient Light */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Section: Branding & Motto */}
            <div className="space-y-6">
                <Link href="/" className="flex items-center gap-3">
                    {/* Graduation Cap/LMS Icon */}

                    <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174L10.74 14.12a2.25 2.25 0 002.52 0l6.48-3.946m-15.48 0L12 5.25l7.74 4.924M3 10.5a3.5 3.5 0 107 0V9m3 1.5a3.5 3.5 0 107 0V9m-1.5-3.5h.008v.008h-.008V5.5zm0 3h.008v.008h-.008V8.5z" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        SKILLEARN E-Learning
                    </span>
                </Link>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
                        Welcome to SKILLEARN LMS
                    </h1>
                    <p className="text-slate-400 max-w-md leading-relaxed text-sm md:text-base">
                        Please authenticate your account to access the Learning Management System.
                    </p>
                </div>

                {/* Steps Visual List */}
                <div className="pt-6 space-y-4 max-w-sm">
                    <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-xs font-bold shrink-0">
                            1
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Identity Verification</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Enter valide informations</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-xs font-bold shrink-0">
                            2
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Secure Gateway</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Provide your secure account password.</p>
                        </div>
                    </div>
                    {/* LOTTI ANIMATION */}
                    <div className="flex justify-center">
                        <LottiePlayer
                            animationData={animationData}
                            width={200}
                            height={200}
                            speed={0.4} // Slowed down significantly
                            loop={true}
                        />
                    </div>
                </div>
            </div>
            {/* Bottom Section: Support Callout Card */}
            <div className="mt-12 md:mt-0 p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md max-w-md">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
                    {/* Info Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.014m-2.107-.407a1.75 1.75 0 112.783-1.607m0 0v5.25m1.5-5.25l-.007.008m0 5.25a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-3.75c0-.414.336-.75.75-.75h1.5a.75.75 0 01.75.75v3.75z" />
                    </svg>
                    Need Assistance?
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                    If you are experiencing issues accessing your courses or validating your registration number, please be sure you registered your courses or contact the <span className="text-slate-200 font-medium">SKILLEARN ICT Support Desk</span> or reach out to your faculty administrator.
                </p>
            </div>
        </div>
    );
}