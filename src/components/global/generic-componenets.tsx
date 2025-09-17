import { APP_CONFIG } from "@/config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Separate component for the branding panel
export const BrandingPanel = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col items-center justify-center text-white overflow-hidden", className)}>
            {/* Background Pattern */}
            <BackgroundPattern />

            {/* Logo */}
            <LogoBox />

            {/* Institution Info */}
            <InstitutionInfo />

            {/* Decorative Elements */}
            <DecorativeElements />
        </div>
    );
};

// Background pattern component
export const BackgroundPattern = () => (
    <div className="absolute inset-0 opacity-10">
        <div
            className="absolute inset-0 animate-float"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
        />
    </div>
);


// Logo component
export const LogoBox = () => (
    <div className="relative z-10 mb-8">
        <Link href={'/'} className="w-28 h-28 bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex flex-col items-center justify-center mb-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-black">
                <div className="relative h-16 w-16">
                    {/* {APP_CONFIG.short_name} */}
                    <Image
                        src={`/logo/logo.jpg`}
                        alt="LOGO IMAGE"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="text-xs opacity-90 mt-1">{APP_CONFIG.institution}</div>
        </Link>
    </div>
);


// Institution info component
export const InstitutionInfo = () => (
    <div className="relative z-10 text-center max-w-sm">
        <h2 className="text-2xl font-bold mb-3">{APP_CONFIG.name}</h2>
        <p className="text-blue-100 leading-relaxed">
            {APP_CONFIG.description}
        </p>
    </div>
);

// Decorative elements component
export const DecorativeElements = () => (
    <>
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full animate-pulse animate-float" />
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-1000 animate-float" />
    </>
);