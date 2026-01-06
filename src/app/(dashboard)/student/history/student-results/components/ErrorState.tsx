// app/(student)/grade-reports/components/ErrorState.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useStudentGradeStore } from "@/store/student-grade-store";

export default function ErrorState() {
  const { error, fetchCourses, resetState } = useStudentGradeStore();

  const handleRetry = () => {
    fetchCourses();
  };

  const handleReset = () => {
    resetState();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Error Loading Data
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          There was a problem loading your grade data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive font-mono">{error}</p>
            </div>
          )}
          
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <h4 className="font-medium text-sm mb-2 text-foreground">Troubleshooting Steps:</h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="mr-2 font-bold">1.</span>
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">2.</span>
                <span>Verify you're logged in properly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">3.</span>
                <span>Try refreshing the page</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRetry}
              variant="default"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}