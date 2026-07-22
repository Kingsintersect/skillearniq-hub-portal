import { PieChart, Users, ClipboardList, LineChart, SendHorizonal } from "lucide-react";
import type { SidebarNavConfig } from "./types";

export const ManagerNavMain: SidebarNavConfig = {
    groups: [
        { title: "Dashboard", icon: PieChart, items: [{ title: "Overview", url: "/manager/dashboard" }] },
        {
            title: "Users",
            icon: Users,
            items: [
                { title: "Students", url: "/manager/students" },
                { title: "Teachers", url: "/manager/teachers" },
            ],
        },
        { title: "Analytics", icon: LineChart, items: [{ title: "Analytics", url: "/manager/analytics" }] },
        { title: "Student Reports", icon: ClipboardList, items: [{ title: "View Reports", url: "/manager/reports" }] },
        { title: "Messages", icon: SendHorizonal, items: [{ title: "Messages", url: "/manager/messages" }] },
    ],
};