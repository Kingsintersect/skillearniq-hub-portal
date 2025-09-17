import { MainLayout } from "@/components/layout/main-layout"
import { SITE_NAME } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Login to your account",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <MainLayout requireAuth={false}>
            {children}
        </MainLayout>
    )
}

export default layout