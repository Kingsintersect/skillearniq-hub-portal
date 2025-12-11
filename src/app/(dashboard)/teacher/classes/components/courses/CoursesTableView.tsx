'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../hooks/use-categories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const CoursesTableView = () => {
    const { courses, isCoursesLoading } = useCategories();

    if (isCoursesLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No Courses Found</h3>
                <p className="text-muted-foreground">No courses available for this study stream</p>
            </div>
        );
    }

    return (
        <div className="border border-border rounded-lg bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="text-foreground font-medium">Course Code</TableHead>
                        <TableHead className="text-foreground font-medium">Course Name</TableHead>
                        <TableHead className="text-foreground font-medium">Description</TableHead>
                        <TableHead className="text-foreground font-medium">Credits</TableHead>
                        <TableHead className="text-foreground font-medium">Status</TableHead>
                        <TableHead className="text-foreground font-medium">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow
                            key={course.id}
                            className="hover:bg-muted/30 border-border"
                        >
                            <TableCell className="font-medium text-foreground">
                                {course.shortName}
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium text-foreground">{course.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        ID: {course.id}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate text-foreground">
                                    {course.description || 'No description'}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className="border-border text-foreground"
                                >
                                    {course.credits}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground"
                                >
                                    Active
                                </Badge>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};