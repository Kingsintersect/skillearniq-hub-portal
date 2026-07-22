"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/modules/shared";
import { LucideIcon } from "lucide-react";

export interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description?: string;
	className?: string;
	Icon?: LucideIcon;
}

/**
 * Centered card shell reused by every auth screen (register, login,
 * forgot/reset password). Keeps a consistent frame while the inner
 * content animates between steps.
 */
export function AuthLayout({
	children,
	title,
	description,
	className,
	Icon,
}: AuthLayoutProps) {
	return (
		<div className="flex font-outfit items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className={cn(
					"auth-scope w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-black/5 sm:p-8 dark:border-gray-800 dark:bg-gray-900",
					className
				)}
			>
				<div className="mb-6 flex justify-center lg:hidden">
					<Image
						src="/logo/logo.jpg"
						alt="SkillearnIQ Hub"
						width={140}
						height={140}
						className="h-16 w-16 object-contain"
					/>
				</div>
				<div className="mb-6 flex items-center gap-4">
					{Icon && (
						<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
							<Icon className="h-6 w-6" />
						</span>
					)}
					<div>
						<h1 className="text-2xl font-bold text-foreground">{title}</h1>
						{description && (
							<p className="mt-1 text-sm text-muted-foreground">{description}</p>
						)}
					</div>
				</div>
				{children}
			</motion.div>
		</div>
	);
}

export interface StepTransitionProps {
	children: React.ReactNode;
	stepKey: string;
}

/** Wraps step content so switching steps animates as a slide/fade. */
export function StepTransition({ children, stepKey }: StepTransitionProps) {
	return (
		<motion.div
			key={stepKey}
			initial={{ opacity: 0, x: 24 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -24 }}
			transition={{ duration: 0.25, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}
