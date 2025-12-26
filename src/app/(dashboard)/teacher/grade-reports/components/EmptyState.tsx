// app/(admin)/grade-reports/components/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Filter } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({ 
  title = "No Data Available", 
  message = "Select a course category and course, then click 'Load Grade Report' to view student grade data." 
}: EmptyStateProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <BarChart3 className="h-16 w-16 text-muted-foreground/60" />
            <Filter className="h-8 w-8 text-primary absolute -top-2 -right-2" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-card-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}