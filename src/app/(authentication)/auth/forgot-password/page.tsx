"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/modules/auth";
import AuthSidebar from "../../components/AuthSidebar";

export default function ForgotPasswordPage() {
	const router = useRouter();

	const handleRequested = (resetReference: string, identity: string) => {
		const params = new URLSearchParams({
			ref: resetReference,
			identity,
		});
		router.push(`/auth/reset-password?${params.toString()}`);
	};

	// return <ForgotPasswordForm onRequested={handleRequested} />;
	return (
		<div className="min-h-screen flex-1">
			<div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
				{/* Left Sidebar Content (Hidden on Mobile) */}
				<div className="min-h-screen hidden lg:block lg:col-span-6 xl:col-span-7">
					<AuthSidebar />
				</div>

				{/* Right Side Form (Takes full width on Mobile) */}
				<div className="min-h-screen lg:col-span-6 xl:col-span-5 flex flex-col justify-center bg-primary-50">
					<ForgotPasswordForm onRequested={handleRequested} />

					{/* OTP Alternative */}
					<div className="mt-4 text-center">
						<button
							onClick={() => router.push("/auth/signin")}
							className="text-sm text-blue-500 hover:text-blue-600 underline"
						>
							Back to Sign In
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
