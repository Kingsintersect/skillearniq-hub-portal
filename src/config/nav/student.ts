import { PieChart, Users, DollarSign, School, Gamepad2, MessageSquare, ShieldUser } from "lucide-react";
import type { SidebarNavConfig } from "./types";

export const StudentNavMain: SidebarNavConfig = {
    groups: [
        { title: "Dashboard", icon: PieChart, items: [{ title: "Statistics", url: "/student/dashboard" }] },
        {
            title: "Subscriptions",
            icon: Users,
            items: [
                { title: "My Subscription", url: "/subscription" },
                { title: "Billing", url: "/subscription/billing" },
                { title: "Family Plan", url: "/subscription/family" },
                { title: "Referrals", url: "/subscription/referrals" },
            ],
        },
        {
            title: "Payments",
            icon: DollarSign,
            hidden: true, // kept exactly as you had it — not launched yet
            items: [
                { title: "Pay Acceptance Fee", url: "/history/student-payments/acceptance" },
                { title: "Pay Tuition Fee", url: "/history/student-payments/tuition" },
            ],
        },
        { title: "My Courses", icon: School, items: [{ title: "My Courses", url: "/student/classes" }] },
        {
            title: "History",
            icon: DollarSign,
            items: [
                { title: "Payment History", url: "/student/history/student-payments" },
                { title: "Result History", url: "/student/history/student-results" },
            ],
        },
        { title: "Performance", icon: Gamepad2, items: [{ title: "Leaderboard", url: "/student/leaderboard" }] },
        { title: "Messages", icon: MessageSquare, items: [{ title: "Messages", url: "/student/messages" }] },
        { title: "Profile", icon: ShieldUser, items: [{ title: "Profile Settings", url: "/student/profile" }] },
    ],
};