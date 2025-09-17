"use client";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import { Settings, User } from "lucide-react";
import SignOutButton from "../core/signout-button";

export function AuthHeader() {
    const { user } = useAuthContext();

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">UNI</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold text-gray-900">{APP_CONFIG.name}</h1>
                        </div>
                    </div>

                    {/* User menu */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                    <Settings className="w-4 h-4" />
                                </Button>

                                <SignOutButton />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}