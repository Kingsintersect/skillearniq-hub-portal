import { NavItem, Feature, Program, Stat, FooterSection, CampusHighlights } from "../types";

export const NAV_ITEMS: NavItem[] = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'features' },
    { href: '#programs', label: 'Programs' },
    { href: '#calender_view', label: 'Updates' },
    { href: '#campus_highlight', label: 'Highlights' },
    // { href: '#about', label: 'About' },
    // { href: '#contact', label: 'Contact' },
];

export const FEATURES: Feature[] = [
    {
        icon: '🎓',
        title: 'World-Class Faculty',
        description: 'Learn from distinguished professors and industry experts who bring real-world experience to the classroom.',
    },
    {
        icon: '💼',
        title: 'Industry Connections',
        description: 'Access our extensive network of corporate partners and alumni for internships, mentorship, and career opportunities.',
    },
    {
        icon: '🌍',
        title: 'Global Perspective',
        description: 'Gain international exposure through exchange programs, global case studies, and multicultural learning environments.',
    },
];

export const PROGRAMS: Program[] = [
    {
        title: "Computer Science",
        description: "Explore cutting-edge technology and software development",
        icon: Code,
        duration: '2 Years',
    },
    {
        title: "Business Administration",
        description: "Develop leadership skills for the modern business world",
        icon: Briefcase,
        duration: '4 Years',
    },
    {
        title: "Biology",
        description: "Discover the science of life through innovative research",
        icon: Microscope,
        duration: '4 Years',
    },
    {
        title: "Literature",
        description: "Analyze great works and develop critical thinking skills",
        icon: Book,
        duration: '4 Years',
    },
    {
        title: "Physics",
        description: "Understand the fundamental laws that govern our universe",
        icon: Atom,
        duration: '4 Years',
    },
    {
        title: "International Relations",
        description: "Study global politics and cross-cultural communication",
        icon: Globe,
        duration: '4 Years',
    },
];

export const CAMPUSHIGHLIGHTS: CampusHighlights[] = [
    {
        title: "Modern Library",
        imageUrl: "/campus/ca-1.jpeg",
    },
    {
        title: "Research Facilities",
        imageUrl: "/campus/ca-2.jpeg",
    },
    {
        title: "Sports Complex",
        imageUrl: "/campus/ca-3.jpeg",
    },
    {
        title: "tudent Housing",
        imageUrl: "/campus/ca-4.jpeg",
    },
];

export const STATS: Stat[] = [
    { number: '5000+', label: 'Alumni Network' },
    { number: '95%', label: 'Employment Rate' },
    { number: '50+', label: 'Industry Partners' },
    { number: '25', label: 'Years of Excellence' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: 'Quick Links',
        links: [
            { label: 'Programs', href: '#programs' },
            { label: 'Admissions', href: '#admissions' },
            { label: 'Research', href: '#research' },
            { label: 'Faculty', href: '#faculty' },
            { label: 'Careers', href: '#careers' },
        ],
    },
    {
        title: 'Student Resources',
        links: [
            { label: 'Student Portal', href: '/auth/signin' },
            { label: 'Library', href: '#library' },
            { label: 'Academic Calendar', href: '#calendar' },
            { label: 'Student Services', href: '#services' },
            { label: 'Alumni Network', href: '#alumni' },
        ],
    },
];


// AUTH DASHBOARD CONFIG
import {
    BookOpen,
    DollarSign,
    Flag,
    GraduationCap,
    MapPinHouse,
    PieChart,
    UserRoundPen,
    CalendarCheck,
    School2,
    MessageSquare,
    Settings2,
    LucideIcon,
    School,
    ClipboardList,
    BookOpenCheck,
    Gamepad,
    Gamepad2,
    ShieldUser,
    SendHorizonal,
    BanknoteArrowDown,
    Users,
    CreditCard,
    Atom,
    Book,
    Briefcase,
    Code,
    Globe,
    Microscope
} from "lucide-react";
export interface SidebarNavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
    display: boolean;
}

export interface SidebarNavConfig {
    compound: SidebarNavItem[];
    flat?: {
        title: string;
        url: string;
        icon: LucideIcon;
        display: boolean;
    }[];
}

export const AdminNavMain: SidebarNavConfig = {
    compound: [
        {
            title: "DASHBOARD",
            url: "#",
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: "Statistics",
                    url: "/admin/dashboard",
                },
            ],
            display: true,
        },
        {
            title: "USERS",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Students Listing",
                    url: "/admin/students",
                },
                {
                    title: "Teachers Listing",
                    url: "/admin/teachers",
                },
                {
                    title: "Parents Listing",
                    url: "/admin/parents",
                },
            ],
            display: true,
        },

        {
            title: "MESSAGES",
            url: "#",
            icon: SendHorizonal,
            items: [
                {
                    title: "Messages",
                    url: "/admin/messages",
                },



            ],
            display: true,
        },
        {
            title: "PAYMENT HISTORY",
            url: "#",
            icon: CreditCard,
            items: [
                {
                    title: "Payments",
                    url: "/admin/payments",
                },
            ],
            display: true,
        },
        {
            title: "STUDENT REPORTS",
            url: "#",
            icon: ClipboardList,
            items: [
                {
                    title: "View Reports",
                    url: "/admin/reports",
                },
            ],
            display: true,
        },
        {
            title: "SETTINGS",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Profile Settings",
                    url: "/admin/settings",
                },
            ],
            display: true,
        },
    ]
}
export const StudentNavMain: SidebarNavConfig = {
    compound: [
        {
            title: "DASHBOARD",
            url: "#",
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: "Statistics",
                    url: "/student/dashboard",
                },
            ],
            display: true,
        },
        {
            title: "PAYMENTS",
            url: "#",
            icon: DollarSign,
            items: [
                {
                    title: "Pay Acceptance Fee",
                    url: "/history/student-payments/acceptance",
                },
                {
                    title: "Pay Tuition Fee",
                    url: "/history/student-payments/tuition",
                },
            ],
            display: false,
        },
        {
            title: "MY CLASSES",
            url: "#",
            icon: School,
            items: [
                {
                    title: "My Classes",
                    url: "/student/classes",
                },

            ],
            display: true,
        },
        {
            title: "HISTORY",
            url: "#",
            icon: DollarSign,
            items: [
                {
                    title: "Payment History",
                    url: "/student/history/student-payments",
                },
                {
                    title: "Result History",
                    url: "/student/history/student-results",
                },
            ],
            display: true,
        },
        {
            title: "LEADERBOARD & PERFORMANCES",
            url: "#",
            icon: Gamepad2,
            items: [
                {
                    title: "Leaderboard & Performances",
                    url: "/student/leaderboard",
                },

            ],
            display: true,
        },
        {
            title: "REPORTS",
            url: "#",
            icon: Flag,
            items: [
                {
                    title: "Grade Report",
                    url: "/student/grade-report",
                },
            ],
            display: true,
        },

        {
            title: "PROFILE",
            url: "#",
            icon: ShieldUser,
            items: [
                {
                    title: "Profile Settings",
                    url: "/student/profile",
                },
            ],
            display: true,
        },
    ]
}
export const TeacherNavMain: SidebarNavConfig = {
    compound: [
        {
            title: "DASHBOARD",
            url: "#",
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/teacher/dashboard",
                },
            ],
            display: true,
        },
    ],
    flat: [

        {
            title: "STUDENTS",
            url: "/teacher/students",
            icon: GraduationCap,
            display: true,
        },
        {
            title: "CLASSES",
            url: "/teacher/classes",
            icon: School,
            display: true,
        },
        {
            title: "ASSIGNMENTS",
            url: "/teacher/assessments",
            icon: BookOpenCheck,
            display: true,
        },
        // {
        //     title: "CALENDER",
        //     url: "/teacher/calender",
        //     icon: CalendarCheck,
        //     display: true,
        // },
        {
            title: "ATTENDANCE",
            url: "/teacher/attendance",
            icon: ClipboardList,
            display: true,
        },
        {
            title: "MESSAGES",
            url: "/teacher/messages",
            icon: MessageSquare,
            display: true,
        },

        {
            title: "SETTINGS",
            url: "/teacher/settings",
            icon: Settings2,
            display: false,
        },
    ],
};
export const ParentNavMain: SidebarNavConfig = {
    compound: [
        {
            title: "DASHBOARD",
            url: "#",
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/parent/dashboard",
                },
            ],
            display: true,
        },
    ],
    flat: [

        {
            title: "MESSAGES",
            url: "/parent/messages",
            icon: SendHorizonal,
            display: true,
        },
        {
            title: "CLASSES",
            url: "/parent/classes",
            icon: BookOpen,
            display: true,
        },
        {
            title: "PAYMENT HISTORY",
            url: "/parent/payments",
            icon: BanknoteArrowDown,
            display: true,
        },
        {
            title: "STUDENT REPORTS",
            url: "/parent/reports",
            icon: MessageSquare,
            display: true,
        },
        {
            title: "SETTINGS",
            url: "/parent/settings",
            icon: Settings2,
            display: false,
        },
    ],
};