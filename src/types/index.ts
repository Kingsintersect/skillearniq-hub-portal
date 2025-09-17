export interface NavItem {
    href: string;
    label: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Program {
    title: string;
    description: string;
    duration: string;
}

export interface Stat {
    number: string;
    label: string;
}

export interface FooterSection {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}