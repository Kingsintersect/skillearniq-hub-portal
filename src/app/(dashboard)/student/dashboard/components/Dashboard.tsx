'use client'

import { StatsCard } from './StatsCard'
import { ProgressCard } from './ProgressCard'
import { BadgeGrid } from './BadgeGrid'
import { LeaderboardCard } from './LeaderboardCard'
import { AchievementsList } from './AchievementsList'
import { Trophy, Star, Flame, BookOpen, Users, Award } from 'lucide-react'
import { useEffect } from 'react'
import { useLeaderboard, useRecentAchievements, useStudentStats } from '../hooks/useStudentData'
import { useStudentStore } from '../../../../../../store/studentStore'

export function Dashboard() {
    const {
        data: stats,
        isLoading: statsLoading,
        error: statsError
    } = useStudentStats()

    const {
        data: achievements,
        isLoading: achievementsLoading
    } = useRecentAchievements()

    const {
        data: leaderboard,
        isLoading: leaderboardLoading
    } = useLeaderboard()

    const { setStudentStats } = useStudentStore()

    // Update global state when stats are loaded
    useEffect(() => {
        if (stats) {
            setStudentStats(stats)
        }
    }, [stats, setStudentStats])

    if (statsLoading) {
        return <DashboardSkeleton />
    }

    if (statsError || !stats) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Unable to load dashboard
                    </h2>
                    <p className="text-gray-600">
                        Please check your connection and try again.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Student Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Track your progress and achievements
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Points"
                    value={stats.totalPoints.toLocaleString()}
                    icon={<Trophy className="h-4 w-4 text-yellow-500" />}
                    description="Lifetime points earned"
                    trend={{ value: 12, label: "from last week" }}
                />
                <StatsCard
                    title="Current Level"
                    value={stats.level}
                    icon={<Star className="h-4 w-4 text-blue-500" />}
                    description={`${stats.experiencePoints}/${stats.experienceToNextLevel + stats.experiencePoints} XP`}
                />
                <StatsCard
                    title="Current Streak"
                    value={`${stats.streak} days`}
                    icon={<Flame className="h-4 w-4 text-orange-500" />}
                    description="Keep it up!"
                    trend={{ value: 2, label: "days this week" }}
                />
                <StatsCard
                    title="Completed Tasks"
                    value={stats.completedTasks}
                    icon={<BookOpen className="h-4 w-4 text-green-500" />}
                    description="This semester"
                    trend={{ value: 5, label: "this week" }}
                />
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressCard
                    title="Level Progress"
                    current={stats.experiencePoints}
                    total={stats.experienceToNextLevel + stats.experiencePoints}
                    label={`${stats.experienceToNextLevel} XP needed for Level ${stats.level + 1}`}
                />
                <ProgressCard
                    title="Badge Collection"
                    current={stats.badges.filter(b => b.earnedAt).length}
                    total={stats.badges.length}
                    label="Badges earned this semester"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <BadgeGrid />
                </div>

                <div className="space-y-6">
                    {!leaderboardLoading && leaderboard && (
                        <LeaderboardCard entries={leaderboard} />
                    )}

                    {!achievementsLoading && achievements && (
                        <AchievementsList achievements={achievements} />
                    )}
                </div>
            </div>
        </div>
    )
}



// Loading skeleton
function DashboardSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <div className="h-10 w-96 mx-auto bg-muted animate-pulse rounded" />
                <div className="h-6 w-64 mx-auto bg-muted animate-pulse rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="h-96 bg-muted animate-pulse rounded-lg" />
                </div>
                <div className="space-y-6">
                    <div className="h-64 bg-muted animate-pulse rounded-lg" />
                    <div className="h-64 bg-muted animate-pulse rounded-lg" />
                </div>
            </div>
        </div>
    )
}
