import React from "react";

interface OtpLoginCardProps {
    otpStep: "identity" | "code";
    otpIdentity: string;
    otpLoading: boolean;
    otpError: string | null;
    onIdentitySubmit: (identity: string) => void;
    onCodeSubmit: (code: string) => void;
    onBackToPassword: () => void;
    onResetStep: () => void;
}

export const OtpLoginCard: React.FC<OtpLoginCardProps> = ({
    otpStep,
    otpIdentity,
    otpLoading,
    otpError,
    onIdentitySubmit,
    onCodeSubmit,
    onBackToPassword,
    onResetStep,
}) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (otpStep === "identity") {
            const identity = formData.get("identity") as string;
            if (identity) onIdentitySubmit(identity);
        } else {
            const code = formData.get("otp_code") as string;
            if (code) onCodeSubmit(code);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="w-full max-w-md space-y-8">

                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Sign in with OTP</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        {otpStep === "identity"
                            ? "Enter your email or phone number"
                            : "Enter the 6-digit code sent to you"}
                    </p>
                </div>

                {/* Dynamic Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {otpStep === "identity" ? (
                        <div>
                            <label htmlFor="identity" className="block text-sm font-medium text-white">
                                Email or Phone Number
                            </label>
                            <input
                                id="identity"
                                name="identity"
                                type="text"
                                defaultValue={otpIdentity}
                                placeholder="john@example.com or +2348012345678"
                                className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                disabled={otpLoading}
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="otp_code" className="block text-sm font-medium text-white">
                                OTP Code
                            </label>
                            <input
                                id="otp_code"
                                name="otp_code"
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                                disabled={otpLoading}
                                required
                            />
                            <p className="mt-2 text-xs text-slate-400">
                                Sent to: <span className="text-slate-300 font-medium">{otpIdentity}</span>
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {otpError && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
                            {otpError}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                    >
                        {otpLoading ? "Processing..." : otpStep === "identity" ? "Send OTP" : "Verify OTP"}
                    </button>
                </form>

                {/* Navigation / Action Footer */}
                <div className="space-y-3 text-center">
                    <div>
                        <button
                            onClick={onBackToPassword}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Back to password login
                        </button>
                    </div>

                    {otpStep === "code" && (
                        <div>
                            <button
                                onClick={onResetStep}
                                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                Use different email/phone
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};