import TeacherFeedbackIntegration from "@/components/core/FeedbackIntegration";
import MarginWidthWrapper from "@/components/layout/dashboard/MarginWidthWrapper";
import PageWrapper from "@/components/layout/dashboard/PageWrapper";
import { MainLayout } from "@/components/layout/main-layout"
import { SITE_NAME } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Dashboard Overview",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <MainLayout requireAuth revealHeader={false}>
            <MarginWidthWrapper>
                <PageWrapper>{children}</PageWrapper>
                <TeacherFeedbackIntegration />
            </MarginWidthWrapper>
        </MainLayout>
    )
}

export default layout