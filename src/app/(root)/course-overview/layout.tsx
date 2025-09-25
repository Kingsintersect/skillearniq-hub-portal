import { MainLayout } from "@/components/layout/dashboard/main-layout"
import { SITE_NAME } from "@/config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Dashboard Overview",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <MainLayout requireAuth revealHeader={true}>
            <div className="flex flex-col">
                {children}
            </div>
        </MainLayout>
    )
}

export default layout