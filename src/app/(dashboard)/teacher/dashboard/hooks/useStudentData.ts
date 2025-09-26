import { StudentService } from '@/lib/services/studentDashboardServices'
import { useQuery } from '@tanstack/react-query'

export const useStudentStats = () => {
    return useQuery({
        queryKey: ['student-stats'],
        queryFn: StudentService.getStudentStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

export const useRecentAchievements = () => {
    return useQuery({
        queryKey: ['recent-achievements'],
        queryFn: StudentService.getRecentAchievements,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

export const useLeaderboard = () => {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: StudentService.getLeaderboard,
        staleTime: 1 * 60 * 1000, // 1 minute
    })
}

export const useBadges = () => {
    return useQuery({
        queryKey: ['badges'],
        queryFn: StudentService.getBadges,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}