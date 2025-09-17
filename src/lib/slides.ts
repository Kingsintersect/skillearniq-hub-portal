import { SlideData } from "@/types/slide";

export const slidesData: SlideData[] = [
    {
        id: 1,
        title: "Future Leaders",
        subtitle: "Shape Tomorrow, Today",
        description: "Join a community of innovators and changemakers. Access world-class education, cutting-edge research opportunities, and connect with peers who share your ambition.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop",
        category: "Academic Excellence",
        primaryAction: { text: "Explore Programs", icon: "▶", url: "programs" },
        secondaryAction: { text: "Learn More", icon: "ℹ", url: "/auth/create-account" }
    },
    {
        id: 2,
        title: "Breakthrough",
        subtitle: "Science That Matters",
        description: "Engage in groundbreaking research across multiple disciplines. Work alongside renowned faculty and contribute to discoveries that impact the world.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop",
        category: "Research & Innovation",
        primaryAction: { text: "Research Centers", icon: "🔬", url: "programs" },
        secondaryAction: { text: "Join Teams", icon: "👥", url: "/auth/create-account" }
    },
    {
        id: 3,
        title: "Experience",
        subtitle: "Beyond the Classroom",
        description: "Immerse yourself in a vibrant campus community. From sports to arts, entrepreneurship to volunteer work - discover your passion and build lifelong connections.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
        category: "Student Life",
        primaryAction: { text: "Campus Events", icon: "📅", url: "programs" },
        secondaryAction: { text: "Student Housing", icon: "🏠", url: "/auth/create-account" }
    },
    {
        id: 4,
        title: "Your Success",
        subtitle: "Career Ready Graduates",
        description: "Launch your career with confidence. Access internships, mentorship programs, and career services that connect you with leading employers worldwide.",
        image: "https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?w=1920&h=1080&fit=crop",
        category: "Career Development",
        primaryAction: { text: "Career Services", icon: "💼", url: "programs" },
        secondaryAction: { text: "Alumni Network", icon: "🤝", url: "/auth/create-account" }
    }
];