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