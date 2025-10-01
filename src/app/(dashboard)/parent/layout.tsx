import { SITE_NAME, UserRole } from "@/config";
import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Parent Dashboard",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <ProtectedRoute allowedRoles={[UserRole.PARENT]}>
            {children}
        </ProtectedRoute>
    )
}

export default layout