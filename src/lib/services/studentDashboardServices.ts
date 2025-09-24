import { StudentStats, Achievement, LeaderboardEntry, Badge, BadgeCategory, BadgeRarity } from '@/types/student'

// Dummy data
const DUMMY_BADGES: Badge[] = [
    {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first assignment',
        icon: '🎯',
        category: BadgeCategory.MILESTONE,
        rarity: BadgeRarity.COMMON,
        earnedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'Math Wizard',
        description: 'Score 100% on 5 math quizzes',
        icon: '🧮',
        category: BadgeCategory.ACADEMIC,
        rarity: BadgeRarity.RARE,
        earnedAt: new Date('2024-02-01')
    },
    {
        id: '3',
        name: 'Team Player',
        description: 'Participate in 10 group discussions',
        icon: '🤝',
        category: BadgeCategory.SOCIAL,
        rarity: BadgeRarity.UNCOMMON,
        earnedAt: new Date('2024-02-15')
    },
    {
        id: '4',
        name: 'Streak Master',
        description: 'Maintain a 30-day learning streak',
        icon: '🔥',
        category: BadgeCategory.ACHIEVEMENT,
        rarity: BadgeRarity.EPIC
    },
    {
        id: '5',
        name: 'Knowledge Seeker',
        description: 'Complete 50 lessons',
        icon: '📚',
        category: BadgeCategory.ACADEMIC,
        rarity: BadgeRarity.LEGENDARY
    }
]

const DUMMY_ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'Perfect Quiz Score',
        description: 'Scored 100% on Biology Quiz #3',
        points: 150,
        date: new Date('2024-03-01'),
        category: 'Academic'
    },
    {
        id: '2',
        title: 'Helpful Peer',
        description: 'Helped 5 classmates with assignments',
        points: 100,
        date: new Date('2024-02-28'),
        category: 'Social'
    },
    {
        id: '3',
        title: 'Early Bird',
        description: 'Submitted assignment 3 days early',
        points: 75,
        date: new Date('2024-02-25'),
        category: 'Participation'
    }
]

const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        points: 2850,
        level: 12,
        rank: 1
    },
    {
        id: '2',
        name: 'Alex Johnson',
        avatar: '/avatars/alex.jpg',
        points: 2720,
        level: 11,
        rank: 2
    },
    {
        id: '3',
        name: 'Maria Garcia',
        avatar: '/avatars/maria.jpg',
        points: 2650,
        level: 11,
        rank: 3
    },
    {
        id: 'current',
        name: 'You',
        avatar: '/avatars/default.jpg',
        points: 2450,
        level: 10,
        rank: 5
    }
]

// API Service Layer (following Repository pattern)
export class StudentService {
    private static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static async getStudentStats(): Promise<StudentStats> {
        await StudentService.delay(500) // Simulate API delay
        return {
            totalPoints: 2450,
            level: 10,
            experiencePoints: 450,
            experienceToNextLevel: 550,
            streak: 7,
            completedTasks: 45,
            badges: DUMMY_BADGES
        }
    }

    static async getRecentAchievements(): Promise<Achievement[]> {
        await StudentService.delay(300)
        return DUMMY_ACHIEVEMENTS
    }

    static async getLeaderboard(): Promise<LeaderboardEntry[]> {
        await StudentService.delay(400)
        return DUMMY_LEADERBOARD
    }

    static async getBadges(): Promise<Badge[]> {
        await StudentService.delay(200)
        return DUMMY_BADGES
    }
}