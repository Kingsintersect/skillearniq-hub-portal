// components/LoadingState.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                        Loading Grade Data
                    </h3>
                    <p className="text-muted-foreground text-center">
                        Please wait while we fetch the student grade information.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}