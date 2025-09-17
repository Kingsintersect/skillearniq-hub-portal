import { academicsServices } from "@/lib/services/academicsServices";
import { useQuery } from "@tanstack/react-query";


export const useCurrentSession = () => {
    return useQuery({
        queryKey: ['academic-info-currentSession'],
        queryFn: academicsServices.getCurrentSession,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    });
};

export const useCurrentSemester = () => {
    return useQuery({
        queryKey: ['academic-info-currentSemester'],
        queryFn: academicsServices.getCurrentSemester,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    });
};

