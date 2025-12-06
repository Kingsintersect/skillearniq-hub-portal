// components/EmptyState.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function EmptyState() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                        No Data Available
                    </h3>
                    <p className="text-muted-foreground text-center">
                        Select a course category and course, then click &quot;Load Grade Report&quot; to view student grade data.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}