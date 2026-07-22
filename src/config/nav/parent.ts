import { PieChart, SendHorizonal, BookOpen, BanknoteArrowDown, ClipboardList, Settings2 } from "lucide-react";
import type { SidebarNavConfig } from "./types";

export const ParentNavMain: SidebarNavConfig = {
    groups: [
        { title: "Dashboard", icon: PieChart, items: [{ title: "Overview", url: "/parent/dashboard" }] },
        { title: "Messages", icon: SendHorizonal, items: [{ title: "Messages", url: "/parent/messages" }] },
        { title: "Courses", icon: BookOpen, items: [{ title: "My Children's Classes", url: "/parent/classes" }] },
        { title: "Payment History", icon: BanknoteArrowDown, items: [{ title: "Payments", url: "/parent/payments" }] },
        { title: "Student Reports", icon: ClipboardList, items: [{ title: "Reports", url: "/parent/reports" }] }, // fixed: was MessageSquare
        { title: "Settings", icon: Settings2, hidden: true, items: [{ title: "Settings", url: "/parent/settings" }] },
    ],
};