"use client";

import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "../../__auth/forgot-password/components/ForgotPasswordForm";
import AuthSidebar from "../../components/AuthSidebar";

export default function ForgotPasswordPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex-1">
			<div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
				{/* Left Sidebar Content (Hidden on Mobile) */}
				<div className="min-h-screen hidden lg:block lg:col-span-6 xl:col-span-7">
					<AuthSidebar />
				</div>

				{/* Right Side Form (Takes full width on Mobile) */}
				<div className="auth-scope min-h-screen lg:col-span-6 xl:col-span-5 flex flex-col justify-center bg-secondary-50 dark:bg-gray-950 px-6 lg:px-16 py-16">
					<div className="w-full max-w-md mx-auto rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-black/5 dark:border-gray-800 dark:bg-gray-900">
						<div className="mb-6 flex items-center gap-4">
							<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
								<KeyRound className="h-6 w-6" />
							</span>
							<div>
								<h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
								<p className="mt-1 text-sm text-muted-foreground">
									Enter your email and we&apos;ll send you a reset link.
								</p>
							</div>
						</div>
						<ForgotPasswordForm />

						<div className="mt-6 text-center">
							<button
								onClick={() => router.push("/auth/signin")}
								className="text-sm font-medium text-accent hover:text-accent-600 hover:underline"
							>
								Back to Sign In
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
