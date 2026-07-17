"use client";

import * as React from "react";
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
		<div className="flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className={cn(
					"w-full rounded-xl p-6 sm:p-8",
					className
				)}
			>
				<div className="mb-6 space-y-1.5 animate-in fade-in-50 duration-700 delay-200 flex inset-ring-accent justify-start gap-3">
					{Icon && (
						<div className="flex items-center justify-center">
							<Icon className="h-10 w-10 mx-auto mb-4 text-blue-500 dark:text-blue-400 transition-colors duration-300" />
						</div>
					)}
					<div className="">
						<h1 className="text-3xl font-semibold text-foreground mb-2 transition-colors duration-300">{title}</h1>
						{description && (
							<p className="text-muted-foreground transition-colors duration-300">{description}</p>
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
