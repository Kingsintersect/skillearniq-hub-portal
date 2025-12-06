import React from "react";
import { useInView } from 'react-intersection-observer';

// Load More Component
export const LoadMoreTrigger: React.FC<{ onLoadMore: () => void; hasMore: boolean }> = ({ onLoadMore, hasMore }) => {
    const { ref, inView } = useInView();

    React.useEffect(() => {
        if (inView && hasMore) {
            onLoadMore();
        }
    }, [inView, hasMore, onLoadMore]);

    if (!hasMore) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                All students loaded
            </div>
        );
    }

    return (
        <div ref={ref} className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
    );
};
