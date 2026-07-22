"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { LOCAL_STORAGE_KEYS } from '@/config'
import { UserInterface } from '@/types/global'
import { toast } from 'sonner'
import Image from 'next/image'
import AuthSidebar from '../../components/AuthSidebar'
import { AuthContainerHeader } from '../components/AuthContainerHeader'
import { Fingerprint } from 'lucide-react'
import { RegisterCompleteData, RegistrationWizard } from '@/modules/auth'

function dashboardPathForRole(role: string): string {
    switch (role.toLowerCase()) {
        case "student":
            return "/subscription";
        case "parent":
            return "/subscription/family";
        case "teacher":
        case "tutor":
            return "/teacher/dashboard";
        case "admin":
        case "manager":
        case "super_admin":
            return "/admin/dashboard";
        default:
            return "/subscription";
    }
}

const RegisterPage = () => {
    const router = useRouter();
    const [, setAccessToken] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.accessToken, null);
    const [, setUser] = useLocalStorage<UserInterface | null>(LOCAL_STORAGE_KEYS.user, null);

    const handleComplete = async (result: RegisterCompleteData) => {
        const signInResult = await signIn("direct-login-auth", {
            access_token: result.accessToken,
            user_id: String(result.user.id),
            user_email: result.user.email,
            user_first_name: result.user.first_name,
            user_last_name: result.user.last_name,
            user_role: result.user.role,
            redirect: false,
        });

        if (!signInResult?.error) {
            // Sync the NextAuth session into localStorage so apiClient.isAuthenticated()
            // and useAuthContext() recognise the new session immediately.
            const session = await getSession();
            if (session?.user) {
                const userData = session.user as UserInterface & { access_token: string; expires_in: number };
                setUser(userData);
                setAccessToken(userData.access_token);
            }
            toast.success(`Welcome, ${result.user.first_name}! Your account is ready.`);
            router.push(dashboardPathForRole(result.user.role));
        } else {
            toast.error("Account created but session setup failed. Please sign in.");
            router.push("/auth/signin");
        }
    };

    return (
        <div className="min-h-screen font-outfit flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-0">
                {/* Left Sidebar Content (Hidden on Mobile) */}
                <div className="min-h-screen hidden lg:block  lg:col-span-5 xl:col-span-4">
                    <AuthSidebar />
                </div>

                {/* Right Side Form (Takes full width on Mobile) */}
                <div className="auth-scope min-h-screen lg:col-span-7 xl:col-span-8 flex flex-col justify-center  px-10 bg-secondary-50 dark:bg-gray-950">
                    <div className="mb-6 flex justify-start lg:hidden">
                        <Image src="/logo/logo.jpg" alt="SkillearnIQ Hub" width={140} height={140} className="h-16 w-16 object-contain" />
                    </div>
                    <AuthContainerHeader
                        heading='Create your account'
                        subHeading='Follow the steps below to create your account and access the Learning Management System.'
                        Icon={Fingerprint}
                    />
                    <RegistrationWizard onComplete={handleComplete} />
                </div>
            </div>
        </div>
    )
}

export default RegisterPage