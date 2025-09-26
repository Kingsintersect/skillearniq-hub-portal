import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    description?: string
    trend?: {
        value: number
        label: string
    }
    className?: string
}

export function StatsCard({
    title,
    value,
    icon,
    description,
    trend,
    className
}: StatsCardProps) {
    return (
        <Card className={cn("hover:shadow-md transition-shadow border-none shadow-2xl", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-4 w-4">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className={cn(
                            trend.value >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {trend.value >= 0 ? "+" : ""}{trend.value}
                        </span> {trend.label}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}