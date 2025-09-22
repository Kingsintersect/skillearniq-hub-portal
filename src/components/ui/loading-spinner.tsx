import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div
            className={cn(
                'inline-block animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        />
    );
};