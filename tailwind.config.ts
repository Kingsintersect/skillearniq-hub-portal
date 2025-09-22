import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                // Use CSS variables directly (Tailwind v4 syntax)
                background: 'var(--background)',
                foreground: 'var(--foreground)',

                // Primary (flat definitions)
                'primary': 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                'primary-50': 'var(--primary-50)',
                'primary-100': 'var(--primary-100)',
                'primary-200': 'var(--primary-200)',
                'primary-300': 'var(--primary-300)',
                'primary-400': 'var(--primary-400)',
                'primary-500': 'var(--primary-500)',
                'primary-600': 'var(--primary-600)',
                'primary-700': 'var(--primary-700)',
                'primary-800': 'var(--primary-800)',
                'primary-900': 'var(--primary-900)',
                'primary-950': 'var(--primary-950)',

                // Secondary
                'secondary': 'var(--secondary)',
                'secondary-foreground': 'var(--secondary-foreground)',
                'secondary-50': 'var(--secondary-50)',
                'secondary-100': 'var(--secondary-100)',
                'secondary-200': 'var(--secondary-200)',
                'secondary-300': 'var(--secondary-300)',
                'secondary-400': 'var(--secondary-400)',
                'secondary-500': 'var(--secondary-500)',
                'secondary-600': 'var(--secondary-600)',
                'secondary-700': 'var(--secondary-700)',
                'secondary-800': 'var(--secondary-800)',
                'secondary-900': 'var(--secondary-900)',
                'secondary-950': 'var(--secondary-950)',

                // Muted / Accent / etc
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                accent: 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',

                destructive: 'var(--destructive)',
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',

                // Charts
                'chart-1': 'var(--chart-1)',
                'chart-2': 'var(--chart-2)',
                'chart-3': 'var(--chart-3)',
                'chart-4': 'var(--chart-4)',
                'chart-5': 'var(--chart-5)',

                // Sidebar
                sidebar: 'var(--sidebar)',
                'sidebar-foreground': 'var(--sidebar-foreground)',
                'sidebar-primary': 'var(--sidebar-primary)',
                'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
                'sidebar-accent': 'var(--sidebar-accent)',
                'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
                'sidebar-border': 'var(--sidebar-border)',
                'sidebar-ring': 'var(--sidebar-ring)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [],
}

export default config