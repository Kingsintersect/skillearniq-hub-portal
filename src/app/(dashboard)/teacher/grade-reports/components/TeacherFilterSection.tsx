'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Filter, RefreshCw, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { useTeacherGradeStore } from "@/store/teacher-grade-store";

export default function TeacherFilterSection() {
  const {
    courses,
    selectedCourse,
    isLoading,
    error,
    gradeData,
    setSelectedCourse,
    fetchGradeData,
    fetchCourses,
  } = useTeacherGradeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCourses();
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
      <Card className="bg-card border-border/70">
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <Card className="bg-card border-border/70 rounded-3xl shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Filter className="h-5 w-5 text-primary" />
                Filter Grades
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Select a course to view grade reports
              </CardDescription>
            </div>
            <Button
              onClick={handleRefreshCourses}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Select Course
              </label>
              {selectedCourse && (
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                  Selected
                </span>
              )}
            </div>
            <Select
              value={selectedCourse}
              onValueChange={handleCourseChange}
              disabled={isLoading || courses.length === 0}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={
                  isLoading ? "Loading your courses..." : 
                  courses.length === 0 ? "No courses assigned" : 
                  "Select a course"
                } />
              </SelectTrigger>
              {courses.length > 0 && (
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} {course.course_code && `(${course.course_code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
            
            {courses.length === 0 && !isLoading && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">No courses found</p>
                    <p className="text-xs mt-0.5">You may not be assigned to any courses yet.</p>
                  </div>
                </div>
              </div>
            )}
            
            {courses.length > 0 && !selectedCourse && !isLoading && (
              <p className="text-xs text-muted-foreground mt-2">
                {courses.length} course{courses.length !== 1 ? 's' : ''} assigned to you
              </p>
            )}
          </div>

          {/* Status Indicators */}
          {(selectedCourse || error) && (
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Selected Course:</span>
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    {selectedCourse ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
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
                        <CheckCircle className="h-3.5 w-3.5" />
                        {gradeData.length} students loaded
                      </>
                    ) : error ? (
                      <>
                        <AlertCircle className="h-3.5 w-3.5" />
                        Error loading data
                      </>
                    ) : selectedCourse ? (
                      "Ready to load"
                    ) : (
                      "Waiting for selection"
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleFetchData}
            disabled={!selectedCourse || isLoading}
            className="w-full sm:w-auto gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : gradeData.length > 0 ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Reload Grades
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Load Grade Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}