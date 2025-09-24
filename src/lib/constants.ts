import { NavItem, Feature, Program, Stat, FooterSection } from "../types";

export const NAV_ITEMS: NavItem[] = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'features' },
    { href: '#programs', label: 'Programs' },
    // { href: '#admissions', label: 'Admissions' },
    // { href: '#research', label: 'Research' },
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
        title: 'Master of Business Administration (MBA)',
        description: 'A comprehensive program for experienced professionals seeking to advance their careers and develop strategic leadership skills.',
        duration: '2 Years',
    },
    {
        title: 'Bachelor of Business Administration (BBA)',
        description: 'Build a strong foundation in business principles with specializations in finance, marketing, management, and entrepreneurship.',
        duration: '4 Years',
    },
    {
        title: 'Executive Education',
        description: 'Short-term intensive programs for working professionals to enhance specific skills and stay current with industry trends.',
        duration: 'Flexible',
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
    LucideIcon
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
            icon: GraduationCap,
            items: [
                {
                    title: "Manage Admission",
                    url: "/admin/manage-admissions",
                },
                // {
                // 	title: "Student Listing",
                // 	url: "/admin/users",
                // },
                {
                    title: "Add New User",
                    url: "/admin/users/create",
                },
                {
                    title: "Tutors Enrolment",
                    url: "/admin/users/tutors-enrollment",
                },
            ],
            display: true,
        },
        {
            title: "SESSION MIGRTION",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Migrate Students",
                    url: "/admin/session-migrations",
                },
            ],
            display: true,
        },
        {
            title: "STUDENT GRADES",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Veiw Student Report",
                    url: "/admin/students-grade-report",
                },
            ],
            display: true,
        },
        {
            title: "COURSE MANAGEMENT",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Faculties",
                    url: "/admin/course-management/faculty",
                },
                {
                    title: "Departments",
                    url: "/admin/course-management/department",
                },
                {
                    title: "Courses",
                    url: "/admin/course-management/courses",
                },
                {
                    title: "Course Categories",
                    url: "/admin/course-management/course-categories",
                },
                {
                    title: "Course Assignments",
                    url: "/admin/course-management/course-assignment",
                },
            ],
            display: false,
        },
        {
            title: "REGION MANAGEMENT",
            url: "#",
            icon: MapPinHouse,
            items: [
                {
                    title: "Countries",
                    url: "/admin/region/countries",
                },
                {
                    title: "States",
                    url: "/admin/region/states",
                },
                {
                    title: "Local Government Areas",
                    url: "/admin/region/local-gov",
                },
            ],
            display: false,
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
            title: "MANAGE ACCOUNT",
            url: "#",
            icon: UserRoundPen,
            items: [
                {
                    title: "Enrolled Courses",
                    url: "/student/enrolled-courses",
                },
                {
                    title: "Profile",
                    url: "/student/profile",
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
            title: "My COURSES",
            url: "/teacher/enrolled-courses",
            icon: GraduationCap,
            display: true,
        },
        {
            title: "ASSIGNMENTS",
            url: "/teacher/assignments",
            icon: School2,
            display: true,
        },
        {
            title: "CALENDER",
            url: "/teacher/calender",
            icon: CalendarCheck,
            display: true,
        },
        {
            title: "DISCUSSIONS",
            url: "/teacher/discussions",
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
            title: "My COURSES",
            url: "/parent/enrolled-courses",
            icon: GraduationCap,
            display: true,
        },
        {
            title: "ASSIGNMENTS",
            url: "/parent/assignments",
            icon: School2,
            display: true,
        },
        {
            title: "CALENDER",
            url: "/parent/calender",
            icon: CalendarCheck,
            display: true,
        },
        {
            title: "DISCUSSIONS",
            url: "/parent/discussions",
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