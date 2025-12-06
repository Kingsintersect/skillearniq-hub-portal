'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Filter } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

export default function FilterSection() {
    const {
        courseCategories,
        courses,
        selectedCategory,
        selectedCourse,
        isLoading,
        setSelectedCategory,
        setSelectedCourse,
        fetchGradeData,
    } = useGradeStore();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    if (!mounted) {
        return (
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-card-foreground">Loading filters...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Filter className="h-5 w-5 text-primary" />
                    Filter Grade Reports
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Select a course category and specific course to view grade reports
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Course Category
                        </label>
                        <Select
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-background border-input">
                                <SelectValue
                                    placeholder="Select category"
                                    className="text-foreground"
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {courseCategories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                        className="text-popover-foreground hover:bg-accent focus:bg-accent"
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Course
                        </label>
                        <Select
                            value={selectedCourse}
                            onValueChange={handleCourseChange}
                            disabled={!selectedCategory || isLoading}
                        >
                            <SelectTrigger className="bg-background border-input">
                                <SelectValue
                                    placeholder={selectedCategory ? "Select course" : "Select category first"}
                                    className="text-foreground"
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id}
                                        className="text-popover-foreground hover:bg-accent focus:bg-accent"
                                    >
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={handleFetchData}
                    disabled={!selectedCourse || isLoading}
                    className="w-full md:w-auto mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading Data...
                        </>
                    ) : (
                        <>
                            Load Grade Report
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}