import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Achievement } from "@/types/student"
import { Star, Calendar } from "lucide-react"

interface AchievementsListProps {
    achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
    return (
        <Card className="border-none shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Achievements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                                <Star className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{achievement.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {achievement.date.toLocaleDateString()}
                                    </div>
                                    <div className="text-xs font-medium text-primary">
                                        +{achievement.points} points
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}