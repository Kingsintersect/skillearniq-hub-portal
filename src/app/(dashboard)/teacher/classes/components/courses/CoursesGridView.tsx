'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../hooks/use-categories';
import { BookOpen, Clock, Eye, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CoursesGridView = () => {
    const { courses, isCoursesLoading } = useCategories();

    if (isCoursesLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-card border-border">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4 bg-muted" />
                            <Skeleton className="h-4 w-1/2 mt-2 bg-muted" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2 bg-muted" />
                            <Skeleton className="h-4 w-2/3 bg-muted" />
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
                <h3 className="text-lg font-medium text-foreground">No Courses Found</h3>
                <p className="text-muted-foreground">No courses available for this study stream</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                // <Card
                //     key={course.id}
                //     className="hover:shadow-lg transition-shadow bg-card border-border hover:border-primary/20 dark:border-4 dark:border-accent dark:hover:border-accent"
                // >
                // <Card
                //     key={course.id}
                //     className="hover:shadow-lg transition-shadow bg-card border-border hover:border-primary/20 dark:border-4 dark:border-accent/70 dark:hover:border-accent dark:shadow-accent/20"
                // >
                <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow bg-card border border-border hover:border-primary/20 dark:border-2 dark:border-accent dark:hover:border-accent-400 dark:shadow-lg dark:shadow-accent/15"
                >
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg text-card-foreground">{course.name}</CardTitle>
                                <CardDescription className="mt-1 text-muted-foreground">{course.shortName}</CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-secondary text-secondary-foreground"
                            >
                                {course.credits} Credits
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-muted-foreground">
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Full Year</span>
                                </span>
                                <span className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>Unlimited</span>
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-foreground transition-shadow border border-border hover:border-primary/20 dark:border-2 dark:border-accent dark:hover:border-accent-400 dark:shadow-lg dark:shadow-accent/15"
                            >
                                <Link href={`/teacher/classes/${course.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};