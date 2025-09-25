import { Badge as BadgeType, BadgeRarity } from "@/types/student"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BadgeDisplayProps {
    badge: BadgeType
    size?: "sm" | "md" | "lg"
}

const rarityColors = {
    [BadgeRarity.COMMON]: "bg-gray-100 text-gray-800 border-gray-200",
    [BadgeRarity.UNCOMMON]: "bg-green-100 text-green-800 border-green-200",
    [BadgeRarity.RARE]: "bg-blue-100 text-blue-800 border-blue-200",
    [BadgeRarity.EPIC]: "bg-purple-100 text-purple-800 border-purple-200",
    [BadgeRarity.LEGENDARY]: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export function BadgeDisplay({ badge, size = "md" }: BadgeDisplayProps) {
    const sizeClasses = {
        sm: "p-2 text-sm",
        md: "p-4",
        lg: "p-6 text-lg"
    }

    return (
        <div className={cn(
            "rounded-lg border-2 transition-all hover:shadow-md",
            rarityColors[badge.rarity],
            sizeClasses[size],
            !badge.earnedAt && "opacity-50 grayscale"
        )}>
            <div className="text-center space-y-2">
                <div className="text-2xl">{badge.icon}</div>
                <div className="font-semibold">{badge.name}</div>
                <div className="text-xs opacity-75">{badge.description}</div>
                <Badge variant="outline" className="text-xs">
                    {badge.rarity}
                </Badge>
                {badge.earnedAt && (
                    <div className="text-xs opacity-60">
                        Earned {badge.earnedAt.toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    )
}