import { ROUTES } from "@/config";
import { SlideData } from "@/types/slide";

export const slidesData: SlideData[] = [
    {
        id: 1,
        title: "Future Leaders",
        subtitle: "Shape Tomorrow, Today",
        description: "Join a community of innovators and changemakers. Access world-class education, cutting-edge research opportunities, and connect with peers who share your ambition.",
        image: "/slides/ai1.jpg",
        category: "Academic Excellence",
        primaryAction: { text: "Explore Programs", icon: "▶", url: "programs" },
        secondaryAction: { text: "Learn More", icon: "ℹ", url: ROUTES.register }
    },
    {
        id: 2,
        title: "Breakthrough",
        subtitle: "Science That Matters",
        description: "Engage in groundbreaking research across multiple disciplines. Work alongside renowned faculty and contribute to discoveries that impact the world.",
        image: "/slides/ai2.jpg",
        category: "Research & Innovation",
        primaryAction: { text: "Research Centers", icon: "🔬", url: "programs" },
        secondaryAction: { text: "Join Teams", icon: "👥", url: ROUTES.register }
    },
    {
        id: 3,
        title: "Experience",
        subtitle: "Beyond the Classroom",
        description: "Immerse yourself in a vibrant campus community. From sports to arts, entrepreneurship to volunteer work - discover your passion and build lifelong connections.",
        image: "/slides/ai3.jpg",
        category: "Student Life",
        primaryAction: { text: "Campus Events", icon: "📅", url: "programs" },
        secondaryAction: { text: "Collaborative Learning", icon: "🏠", url: ROUTES.register }
    },
    {
        id: 4,
        title: "Your Success",
        subtitle: "Career Ready Graduates",
        description: "Launch your career with confidence. Access internships, mentorship programs, and career services that connect you with leading employers worldwide.",
        image: "/slides/ai4.jpg",
        category: "Career Development",
        primaryAction: { text: "Career Boost", icon: "💼", url: "programs" },
        secondaryAction: { text: "Alumni Network", icon: "🤝", url: ROUTES.register }
    }
];