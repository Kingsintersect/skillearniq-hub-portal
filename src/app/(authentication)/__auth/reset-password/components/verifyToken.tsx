"use client";

import React from 'react'
import Lottie from "lottie-react";
import animationData from "@/assets/Change Passwords.json"
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const VerifyToken = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // Light: rich deep navy (brand primary-950 → primary-700)
    // Dark:  slightly lighter navy (primary-800 → primary-600 approximations)
    const gradients = isDark
        ? [
            "linear-gradient(160deg, #1a3258 0apiclient%, #263f6e 100%)",
            "linear-gradient(160deg, #263f6e 0%, #1a3258 100%)",
            "linear-gradient(160deg, #1a3258 0%, #263f6e 100%)",
        ]
        : [
            "linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)",
            "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)",
            "linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)",
        ];

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            animate={{ background: gradients }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <div className="text-center px-8">
                <div className="flex justify-center mb-4">
                    <Lottie animationData={animationData} />
                </div>
                <div className="text-center text-white/80 text-xl font-light tracking-wide drop-shadow">
                    Enter new password to reset your old password
                </div>
            </div>
        </motion.div>
    )
}
