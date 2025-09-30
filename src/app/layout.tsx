import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/config";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ActiveThemeProvider } from "@/components/active-theme";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import AuthProvider from "@/providers/AuthProvider";
import { PageLoadProviders } from "@/providers/page-load-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const META_THEME_COLORS = {
	light: "#ffffff",
	dark: "#09090b",
}

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_CONFIG.name}`,
		default: `${APP_CONFIG.name} - Student Portal`,
	},
	description: APP_CONFIG.description,
	keywords: [...APP_CONFIG.keywords],
	authors: [...APP_CONFIG.authors],
	creator: APP_CONFIG.creator,
	publisher: APP_CONFIG.publisher,
	applicationName: APP_CONFIG.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	other: {
		version: APP_CONFIG.version,
	},
	icons: [...APP_CONFIG.icons],
};

export const viewport: Viewport = {
	themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth()

	const cookieStore = await cookies()
	const activeThemeValue = cookieStore.get("active_theme")?.value
	const isScaled = activeThemeValue?.endsWith("-scaled")

	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/logo/logo.jpg" type="image/x-icon" />
			</head>
			<body
				className={cn(
					`${geistSans.variable} ${geistMono.variable} h-full antialiased`,
					activeThemeValue ? `theme-${activeThemeValue}` : "",
					isScaled ? "theme-scaled" : "",
				)}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
					enableColorScheme
				>
					<PageLoadProviders>
						<ActiveThemeProvider initialTheme={activeThemeValue}>
							<QueryProvider>
								<AuthProvider session={session}>
									{children}
									<Toaster
										position="top-right"
										expand={true}
										richColors
										toastOptions={{
											duration: 4000,
											style: {
												background: "#363636",
												color: "#fff",
											},
											// success: {
											//     duration: 3000,
											//     iconTheme: {
											//         primary: "#10b981",
											//         secondary: "#fff",
											//     },
											// },
											// error: {
											//     duration: 5000,
											//     iconTheme: {
											//         primary: "#ef4444",
											//         secondary: "#fff",
											//     },
											// },
										}}
									/>
								</AuthProvider>
							</QueryProvider>
						</ActiveThemeProvider>
					</PageLoadProviders>
				</ThemeProvider>
			</body>
		</html>
	);
}
