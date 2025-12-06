'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../hooks/use-categories';
import { BookOpen, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const CoursesGridView = () => {
    const { courses, isCoursesLoading, selectedSubcategoryId } = useCategories();

    if (!selectedSubcategoryId) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Study Stream Selected</h3>
                <p className="text-muted-foreground">Select a study stream to view available courses</p>
            </div>
        );
    }

    if (isCoursesLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Courses Found</h3>
                <p className="text-muted-foreground">No courses available for this study stream</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{course.name}</CardTitle>
                                <CardDescription className="mt-1">{course.code}</CardDescription>
                            </div>
                            <Badge variant="secondary">{course.credits} Credits</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Full Year</span>
                                </span>
                                <span className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>Unlimited</span>
                                </span>
                            </div>
                            <Badge variant="outline">Core</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};