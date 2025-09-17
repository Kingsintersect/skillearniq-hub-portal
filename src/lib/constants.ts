import { NavItem, Feature, Program, Stat, FooterSection } from "../types";

export const NAV_ITEMS: NavItem[] = [
    { href: '#home', label: 'Home' },
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
                    url: "/dashboard/admin",
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
                    url: "/dashboard/admin/manage-admissions",
                },
                // {
                // 	title: "Student Listing",
                // 	url: "/dashboard/admin/users",
                // },
                {
                    title: "Add New User",
                    url: "/dashboard/admin/users/create",
                },
                {
                    title: "Tutors Enrolment",
                    url: "/dashboard/admin/users/tutors-enrollment",
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
                    url: "/dashboard/admin/session-migrations",
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
                    url: "/dashboard/admin/students-grade-report",
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
                    url: "/dashboard/admin/course-management/faculty",
                },
                {
                    title: "Departments",
                    url: "/dashboard/admin/course-management/department",
                },
                {
                    title: "Courses",
                    url: "/dashboard/admin/course-management/courses",
                },
                {
                    title: "Course Categories",
                    url: "/dashboard/admin/course-management/course-categories",
                },
                {
                    title: "Course Assignments",
                    url: "/dashboard/admin/course-management/course-assignment",
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
                    url: "/dashboard/admin/region/countries",
                },
                {
                    title: "States",
                    url: "/dashboard/admin/region/states",
                },
                {
                    title: "Local Government Areas",
                    url: "/dashboard/admin/region/local-gov",
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
                    url: "/dashboard/student",
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
                    url: "/dashboard/history/student-payments/acceptance",
                },
                {
                    title: "Pay Tuition Fee",
                    url: "/dashboard/history/student-payments/tuition",
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
                    url: "/dashboard/student/history/student-payments",
                },
                {
                    title: "Result History",
                    url: "/dashboard/student/history/student-results",
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
                    url: "/dashboard/student/enrolled-courses",
                },
                {
                    title: "Profile",
                    url: "/dashboard/student/profile",
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
                    url: "/dashboard/student/grade-report",
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
                    url: "/dashboard/teacher",
                },
            ],
            display: true,
        },
    ],
    flat: [
        {
            title: "My COURSES",
            url: "/dashboard/teacher/enrolled-courses",
            icon: GraduationCap,
            display: true,
        },
        {
            title: "ASSIGNMENTS",
            url: "/dashboard/teacher/assignments",
            icon: School2,
            display: true,
        },
        {
            title: "CALENDER",
            url: "/dashboard/teacher/calender",
            icon: CalendarCheck,
            display: true,
        },
        {
            title: "DISCUSSIONS",
            url: "/dashboard/teacher/discussions",
            icon: MessageSquare,
            display: true,
        },
        {
            title: "SETTINGS",
            url: "/dashboard/teacher/settings",
            icon: Settings2,
            display: false,
        },
    ],
};