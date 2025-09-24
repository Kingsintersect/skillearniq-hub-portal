export interface Badge {
    id: string
    name: string
    description: string
    icon: string
    category: BadgeCategory
    rarity: BadgeRarity
    earnedAt?: Date
}

export enum BadgeCategory {
    ACADEMIC = 'academic',
    PARTICIPATION = 'participation',
    ACHIEVEMENT = 'achievement',
    SOCIAL = 'social',
    MILESTONE = 'milestone'
}

export enum BadgeRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary'
}

export interface StudentStats {
    totalPoints: number
    level: number
    experiencePoints: number
    experienceToNextLevel: number
    streak: number
    completedTasks: number
    badges: Badge[]
}

export interface Achievement {
    id: string
    title: string
    description: string
    points: number
    date: Date
    category: string
}

export interface LeaderboardEntry {
    id: string
    name: string
    avatar: string
    points: number
    level: number
    rank: number
}