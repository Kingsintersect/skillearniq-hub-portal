import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LeaderboardEntry } from "@/types/student"
import { Trophy, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardCardProps {
    entries: LeaderboardEntry[]
}

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <Trophy className="h-5 w-5 text-yellow-500" />
        case 2:
            return <Medal className="h-5 w-5 text-gray-400" />
        case 3:
            return <Award className="h-5 w-5 text-amber-600" />
        default:
            return <span className="text-sm font-bold">#{rank}</span>
    }
}

export function LeaderboardCard({ entries }: LeaderboardCardProps) {
    return (
        <Card className="border-none shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg",
                                entry.id === 'current' ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-sm">
                                        {entry.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-sm">{entry.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Level {entry.level}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">{entry.points}</div>
                                <div className="text-xs text-muted-foreground">points</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}