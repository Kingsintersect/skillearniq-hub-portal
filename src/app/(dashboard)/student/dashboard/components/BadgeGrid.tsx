import { BadgeDisplay } from './BadgeDisplay'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BadgeCategory } from '@/types/student'
import { Award, Users, Target, Star, Trophy } from 'lucide-react'
import { useBadges } from '../hooks/useStudentData'
import { useStudentStore } from '../../../../../../store/studentStore'

const categoryIcons = {
    [BadgeCategory.ACADEMIC]: <Award className="h-4 w-4" />,
    [BadgeCategory.SOCIAL]: <Users className="h-4 w-4" />,
    [BadgeCategory.ACHIEVEMENT]: <Star className="h-4 w-4" />,
    [BadgeCategory.PARTICIPATION]: <Target className="h-4 w-4" />,
    [BadgeCategory.MILESTONE]: <Trophy className="h-4 w-4" />,
}

const categories = [
    { id: 'all', label: 'All Badges' },
    { id: BadgeCategory.ACADEMIC, label: 'Academic' },
    { id: BadgeCategory.SOCIAL, label: 'Social' },
    { id: BadgeCategory.ACHIEVEMENT, label: 'Achievement' },
    { id: BadgeCategory.PARTICIPATION, label: 'Participation' },
    { id: BadgeCategory.MILESTONE, label: 'Milestone' },
]

export function BadgeGrid() {
    const { data: badges, isLoading, error } = useBadges()
    const { selectedCategory, setSelectedCategory } = useStudentStore()

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">
                        Failed to load badges. Please try again.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const filteredBadges = selectedCategory === 'all'
        ? badges
        : badges?.filter(badge => badge.category === selectedCategory)

    const earnedBadges = filteredBadges?.filter(badge => badge.earnedAt) || []
    const unearnedBadges = filteredBadges?.filter(badge => !badge.earnedAt) || []

    return (
        <Card className='border-none shadow-2xl'>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Badges Collection</span>
                    <Badge variant="secondary">
                        {earnedBadges.length} / {filteredBadges?.length || 0} earned
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === category.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {category.id !== 'all' && categoryIcons[category.id as BadgeCategory]}
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-3">
                            Earned Badges ({earnedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {earnedBadges.map((badge) => (
                                <BadgeDisplay key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Unearned Badges */}
                {unearnedBadges.length > 0 && (
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-3">
                            Available Badges ({unearnedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {unearnedBadges.map((badge) => (
                                <BadgeDisplay key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredBadges?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No badges found in this category.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}