// components/ErrorState.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

export default function ErrorState() {
    const { error, fetchGradeData } = useGradeStore();

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Error Loading Data
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    There was a problem loading the grade data
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                        onClick={() => fetchGradeData()}
                        variant="outline"
                        className="border-input hover:bg-accent hover:text-accent-foreground"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}