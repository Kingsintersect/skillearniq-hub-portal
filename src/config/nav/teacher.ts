import { PieChart, School, BookOpenCheck, ClipboardList, MessageSquare, Settings2 } from "lucide-react";
import type { SidebarNavConfig } from "./types";

export const TeacherNavMain: SidebarNavConfig = {
    groups: [
        { title: "Dashboard", icon: PieChart, items: [{ title: "Overview", url: "/teacher/dashboard" }] },
        { title: "Courses", icon: School, items: [{ title: "My Classes", url: "/teacher/classes" }] },
        { title: "Student Reports", icon: BookOpenCheck, items: [{ title: "Grade Reports", url: "/teacher/grade-reports" }] },
        { title: "Attendance", icon: ClipboardList, items: [{ title: "Attendance", url: "/teacher/attendance" }] },
        { title: "Messages", icon: MessageSquare, items: [{ title: "Messages", url: "/teacher/messages" }] },
        { title: "Settings", icon: Settings2, hidden: true, items: [{ title: "Settings", url: "/teacher/settings" }] },
    ],
};