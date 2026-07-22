import { PieChart, Users, CreditCard, SendHorizonal, ClipboardList, BanknoteArrowDown } from "lucide-react";
import type { SidebarNavConfig } from "./types";

export const AdminNavMain: SidebarNavConfig = {
    groups: [
        { title: "Dashboard", icon: PieChart, items: [{ title: "Statistics", url: "/admin/dashboard" }] },
        {
            title: "Users",
            icon: Users,
            items: [
                { title: "Students", url: "/admin/students" },
                { title: "Teachers", url: "/admin/teachers" },
                { title: "Parents", url: "/admin/parents" },
            ],
        },
        {
            title: "Subscriptions",
            icon: CreditCard, // was duplicated with Users' icon
            items: [
                { title: "Plans", url: "/admin/subscriptions" },
                { title: "Coupons", url: "/admin/coupons" },
                { title: "Invoices", url: "/admin/invoices" },
            ],
        },
        { title: "Messages", icon: SendHorizonal, items: [{ title: "Messages", url: "/admin/messages" }] },
        { title: "Payment History", icon: BanknoteArrowDown, items: [{ title: "Payments", url: "/admin/payments" }] },
        { title: "Student Reports", icon: ClipboardList, items: [{ title: "View Reports", url: "/admin/reports" }] },
    ],
};