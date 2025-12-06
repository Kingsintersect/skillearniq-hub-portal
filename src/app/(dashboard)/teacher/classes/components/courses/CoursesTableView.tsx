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

export const CoursesTableView = () => {
    const { courses, isCoursesLoading, selectedSubcategoryId } = useCategories();

    if (!selectedSubcategoryId) {
        return (
            <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Study Stream Selected</h3>
                <p className="text-muted-foreground">Select a study stream to view available courses</p>
            </div>
        );
    }

    if (isCoursesLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Courses Found</h3>
                <p className="text-muted-foreground">No courses available for this study stream</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.code}</TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{course.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        ID: {course.id}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate">
                                    {course.description || 'No description'}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{course.credits}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="default">Active</Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};