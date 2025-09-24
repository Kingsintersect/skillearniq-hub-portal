import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
    title: string
    current: number
    total: number
    label?: string
}

export function ProgressCard({ title, current, total, label }: ProgressCardProps) {
    const percentage = (current / total) * 100

    return (
        <Card className="border-none shadow-2xl">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{current} / {total}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
                {label && (
                    <p className="text-sm text-muted-foreground">{label}</p>
                )}
            </CardContent>
        </Card>
    )
}