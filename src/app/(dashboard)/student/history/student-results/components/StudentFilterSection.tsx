// app/(student)/grade-reports/components/StudentFilterSection.tsx
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Filter, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useStudentGradeStore } from "@/store/student-grade-store";

export default function StudentFilterSection() {
  const {
    courses,
    selectedCourse,
    isLoading,
    error,
    gradeData,
    setSelectedCourse,
    fetchGradeData,
    fetchCourses,
    resetState
  } = useStudentGradeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
  };

  const handleFetchData = async () => {
    await fetchGradeData();
  };

  const handleRefreshCourses = async () => {
    await fetchCourses();
  };

  if (!mounted) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const getSelectedCourseName = () => {
    if (!selectedCourse) return "Not selected";
    const course = courses.find(c => c.id === selectedCourse);
    return course ? `${course.course_code || 'N/A'}: ${course.name}` : "Unknown course";
  };

  const getCourseDisplayName = (course: any) => {
    if (course.name && course.course_code) {
      return `${course.course_code} - ${course.name}`;
    } else if (course.name) {
      return course.name;
    } else {
      return `Course ${course.id}`;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Grade Reports Filter
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select a course to view your grade reports
            </CardDescription>
          </div>
          <Button
            onClick={handleRefreshCourses}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Select Course
              </label>
              {selectedCourse && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  Selected
                </span>
              )}
            </div>
            <Select
              value={selectedCourse}
              onValueChange={handleCourseChange}
              disabled={isLoading || courses.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoading ? "Loading your courses..." : 
                  courses.length === 0 ? "No courses enrolled" : 
                  "Select a course"
                } />
              </SelectTrigger>
              {courses.length > 0 && (
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex flex-col">
                        <span>{getCourseDisplayName(course)}</span>
                        {course.summary && (
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {course.summary.substring(0, 50)}...
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
            
            {courses.length === 0 && !isLoading && (
              <div className="mt-2">
                <p className="text-sm text-red-600 font-medium">
                  No courses found. You may not be enrolled in any courses yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check with your administrator or try refreshing the page.
                </p>
              </div>
            )}
            
            {courses.length > 0 && !selectedCourse && !isLoading && (
              <p className="text-xs text-muted-foreground mt-2">
                {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
              </p>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        {(selectedCourse || error) && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Selected Course:</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {selectedCourse ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {getSelectedCourseName()}
                    </>
                  ) : (
                    "Not selected"
                  )}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Status:</span>
                <span className={`text-sm font-medium flex items-center gap-2 ${
                  gradeData.length > 0 ? 'text-green-600' : 
                  error ? 'text-destructive' : 
                  'text-amber-600'
                }`}>
                  {gradeData.length > 0 ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Your grade data loaded
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      Error loading data
                    </>
                  ) : selectedCourse ? (
                    "Ready to load your grades"
                  ) : (
                    "Waiting for selection"
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={handleFetchData}
            disabled={!selectedCourse || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : gradeData.length > 0 ? (
              'Reload Grade Report'
            ) : (
              'Load My Grades'
            )}
          </Button>
          
          {/* <Button
            onClick={resetState}
            variant="outline"
            disabled={!selectedCourse && gradeData.length === 0}
          >
            Clear Selection
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}