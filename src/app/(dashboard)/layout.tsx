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
            {children}
        </MainLayout>
    )
}

export default layout