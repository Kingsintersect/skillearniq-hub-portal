import { SITE_NAME, UserRole } from "@/config";
import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: "Teacher Dashboard",
};

const layout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
            {children}
        </ProtectedRoute>
    )
}

export default layout