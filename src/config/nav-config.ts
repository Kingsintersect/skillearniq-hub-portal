import type { LucideIcon } from "lucide-react";
import {
    PieChart,
    Users,
    CreditCard,
    SendHorizonal,
    ClipboardList,
    BanknoteArrowDown,
    School,
    BookOpenCheck,
    Gamepad2,
    MessageSquare,
    ShieldUser,
    BookOpen,
    LineChart,
    UserCog,
    ScrollText,
    Settings2,
} from "lucide-react";
import { UserRole } from "@/config";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    roles: UserRole[];
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

const { STUDENT, TEACHER, PARENT, MANAGER, ADMIN, SUPER_ADMIN } = UserRole;

export const NAV_SECTIONS: NavSection[] = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", href: "/admin/dashboard", icon: PieChart, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Dashboard", href: "/student/dashboard", icon: PieChart, roles: [STUDENT] },
            { label: "Dashboard", href: "/teacher/dashboard", icon: PieChart, roles: [TEACHER] },
            { label: "Dashboard", href: "/parent/dashboard", icon: PieChart, roles: [PARENT] },
            { label: "Dashboard", href: "/manager/dashboard", icon: PieChart, roles: [MANAGER] },
        ],
    },
    {
        title: "Learning",
        items: [
            { label: "My Subjects", href: "/student/subjects", icon: School, roles: [STUDENT] },
            { label: "My Classes", href: "/teacher/classes", icon: School, roles: [TEACHER] },
            { label: "My Children's Classes", href: "/parent/classes", icon: BookOpen, roles: [PARENT] },
            { label: "Grade Reports", href: "/teacher/grade-reports", icon: BookOpenCheck, roles: [TEACHER] },
            { label: "Attendance", href: "/teacher/attendance", icon: ClipboardList, roles: [TEACHER] },
            { label: "Leaderboard", href: "/student/leaderboard", icon: Gamepad2, roles: [STUDENT] },
        ],
    },
    {
        title: "Subscriptions",
        items: [
            { label: "My Subscription", href: "/subscription", icon: CreditCard, roles: [STUDENT, PARENT] },
            { label: "Billing", href: "/subscription/billing", icon: CreditCard, roles: [STUDENT, PARENT] },
            { label: "Family Plan", href: "/subscription/family", icon: Users, roles: [STUDENT, PARENT] },
            { label: "Referrals", href: "/subscription/referrals", icon: Users, roles: [STUDENT, PARENT] },
            { label: "Plans", href: "/admin/subscriptions", icon: CreditCard, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Coupons", href: "/admin/coupons", icon: CreditCard, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Invoices", href: "/admin/invoices", icon: BanknoteArrowDown, roles: [ADMIN, SUPER_ADMIN] },
        ],
    },
    {
        title: "People",
        items: [
            { label: "Students", href: "/admin/students", icon: Users, roles: [ADMIN, SUPER_ADMIN, MANAGER] },
            { label: "Teachers", href: "/admin/teachers", icon: Users, roles: [ADMIN, SUPER_ADMIN, MANAGER] },
            { label: "Parents", href: "/admin/parents", icon: Users, roles: [ADMIN, SUPER_ADMIN] },
        ],
    },
    {
        title: "Reports",
        items: [
            { label: "View Reports", href: "/admin/reports", icon: ClipboardList, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Reports", href: "/manager/reports", icon: ClipboardList, roles: [MANAGER] },
            { label: "Result History", href: "/student/history/student-results", icon: ClipboardList, roles: [STUDENT] },
            { label: "Reports", href: "/parent/reports", icon: ClipboardList, roles: [PARENT] },
            { label: "Analytics", href: "/manager/analytics", icon: LineChart, roles: [MANAGER, ADMIN, SUPER_ADMIN] },
        ],
    },
    {
        title: "Payments",
        items: [
            { label: "Payments", href: "/admin/payments", icon: BanknoteArrowDown, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Payment History", href: "/student/history/student-payments", icon: BanknoteArrowDown, roles: [STUDENT] },
            { label: "Payment History", href: "/parent/payments", icon: BanknoteArrowDown, roles: [PARENT] },
        ],
    },
    {
        title: "Messages",
        items: [
            { label: "Messages", href: "/admin/messages", icon: SendHorizonal, roles: [ADMIN, SUPER_ADMIN] },
            { label: "Messages", href: "/student/messages", icon: MessageSquare, roles: [STUDENT] },
            { label: "Messages", href: "/teacher/messages", icon: MessageSquare, roles: [TEACHER] },
            { label: "Messages", href: "/parent/messages", icon: SendHorizonal, roles: [PARENT] },
            { label: "Messages", href: "/manager/messages", icon: SendHorizonal, roles: [MANAGER] },
        ],
    },
    {
        title: "Platform",
        items: [
            { label: "Users & Roles", href: "/admin/platform/users", icon: UserCog, roles: [SUPER_ADMIN] },
            { label: "Audit Logs", href: "/admin/platform/audit", icon: ScrollText, roles: [SUPER_ADMIN] },
            { label: "Application Settings", href: "/admin/settings", icon: Settings2, roles: [SUPER_ADMIN] },
        ],
    },
    {
        title: "Account",
        items: [{ label: "Profile Settings", href: "/student/profile", icon: ShieldUser, roles: [STUDENT] }],
    },
];

export function getNavForRole(role: UserRole): NavSection[] {
    return NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
}