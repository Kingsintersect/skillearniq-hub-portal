"use client";

import React from 'react'
import Lottie from "lottie-react";
import animationData from "@/assets/Change Passwords.json"

export const VerifyToken = () => {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <Lottie animationData={animationData} />
                </div>
                <div className="text-center text-primary text-xl">Enter new password to reset your old password</div>
            </div>
        </div>
    )
}
