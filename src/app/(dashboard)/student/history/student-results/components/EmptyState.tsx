// app/(student)/grade-reports/components/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, BookOpen } from "lucide-react";

export default function EmptyState() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative mb-6">
                        <BookOpen className="h-16 w-16 text-muted-foreground/60" />
                        <BarChart3 className="h-8 w-8 text-primary absolute -top-2 -right-2" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                        No Course Selected
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Select a course from the dropdown to view your grade reports
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}