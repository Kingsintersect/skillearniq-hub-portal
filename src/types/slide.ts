export interface SlideData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    category: string;
    primaryAction: {
        text: string;
        icon: string;
        url?: string;
    };
    secondaryAction: {
        text: string;
        icon: string;
        url?: string;
    };
}
