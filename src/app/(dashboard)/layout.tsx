import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import TeacherFeedbackIntegration from "@/components/core/FeedbackIntegration";
import PageWrapper from "@/components/layout/dashboard/PageWrapper";
import { MainLayout } from "@/components/layout/dashboard/main-layout"
import { SITE_NAME } from "@/config";
import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import SiteHeader from "@/components/site-header";
import { auth } from "@/auth";
import { AuthUser } from "@/types/auth";
import { Suspense } from "react";
import { ExtensionCleanup } from "@/components/layout/ClientOnly";
import { SafeSidebarProvider } from "@/components/layout/dashboard/safe-sidebar-provider";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Dashboard Overview",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()

    return (
        <MainLayout requireAuth revealHeader={true}>
            <ExtensionCleanup />
            <SidebarProvider>
                <SafeSidebarProvider>
                    <Suspense fallback={<div>Loading sidebar...</div>}>
                        <AppSidebar user={session?.user as unknown as AuthUser} />
                    </Suspense>
                    <SidebarInset>
                        <SiteHeader />
                        <PageWrapper>{children}</PageWrapper>
                        <TeacherFeedbackIntegration />
                    </SidebarInset>
                </SafeSidebarProvider>
            </SidebarProvider>
        </MainLayout>
    )
}

export default layout