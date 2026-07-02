// app/(admin)/grade-reports/components/FilterSection.tsx
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Filter, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

export default function FilterSection() {
  const {
    courseCategories,
    courses,
    selectedCategory,
    selectedCourse,
    isLoading,
    error,
    gradeData,
    setSelectedCategory,
    setSelectedCourse,
    fetchGradeData,
    fetchCategories,
  } = useGradeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
  };

  const handleFetchData = async () => {
    await fetchGradeData();
  };

  const handleRefreshCategories = async () => {
    await fetchCategories();
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

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return "Not selected";
    const category = courseCategories.find(cat => cat.id === selectedCategory);
    return category ? category.name : "Unknown category";
  };

  const getSelectedCourseName = () => {
    if (!selectedCourse) return "Not selected";
    const course = courses.find(c => c.id === selectedCourse);
    return course ? `${course.course_code || 'N/A'}: ${course.name}` : "Unknown course";
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Filter Grade Reports
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select a course category and specific course to view grade reports
            </CardDescription>
          </div>
          <Button
            onClick={handleRefreshCategories}
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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Course Category
              </label>
              {selectedCategory && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  Selected
                </span>
              )}
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {courseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Course
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
              disabled={!selectedCategory || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCategory ? "Select course" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name} {course.course_code && `(${course.course_code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Indicators */}
        {(selectedCategory || selectedCourse || error) && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {selectedCategory ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {getSelectedCategoryName()}
                    </>
                  ) : (
                    "Not selected"
                  )}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Course:</span>
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
                      {gradeData.length} students loaded
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="h-3 w-3" />
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
          className="w-full md:w-auto mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : gradeData.length > 0 ? (
            'Reload Grade Report'
          ) : (
            'Load Grade Report'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}