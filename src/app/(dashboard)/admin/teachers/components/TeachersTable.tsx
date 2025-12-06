"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, BookOpen, Trash2 } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { toast } from 'sonner';
import { useTeachersPageContext } from './TeachersPageProvider';
import { useDebounce } from '../hooks/useDebounce';

interface TeachersTableProps {
    onEditTeacher: (teacher: any) => void;
    onAssignTeacher: (teacher: any) => void;
}

export const TeachersTable: React.FC<TeachersTableProps> = ({
    onEditTeacher,
    onAssignTeacher,
}) => {
    const router = useRouter();
    const { useDeleteTeacher, useTeachers } = useAdminQueries();
    const deleteTeacherMutation = useDeleteTeacher();

    const {
        searchTerm,
        filters,
        pagination,
        getTeacherAssignedSubjects,
    } = useTeachersPageContext();

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: teachersResponse, isLoading } = useTeachers({
        search: debouncedSearchTerm || undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        page: pagination.currentPage,
        perPage: pagination.itemsPerPage,
    });

    const teachers = teachersResponse?.data || [];
    const totalTeachers = teachersResponse?.meta?.total || teachers.length;

    const handleDeleteTeacher = (teacherId: number) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            deleteTeacherMutation.mutate(teacherId, {
                onSuccess: () => {
                    toast.success('Teacher deleted successfully');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to delete teacher');
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading teachers...</p>
            </div>
        );
    }

    if (teachers.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p className="text-lg font-medium">No teachers found</p>
                {debouncedSearchTerm && (
                    <p className="text-sm mt-1">No results for {debouncedSearchTerm}</p>
                )}
                {filters.category !== 'all' && (
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 text-sm text-muted-foreground">
                Showing {teachers.length} of {totalTeachers} teachers
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-foreground">Employee No</TableHead>
                        <TableHead className="text-foreground">Name</TableHead>
                        <TableHead className="text-foreground">Contact</TableHead>
                        <TableHead className="text-foreground">Subjects</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-foreground">Email Verified</TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map((teacher: any) => {
                        const assignedSubjects = getTeacherAssignedSubjects(teacher.id);

                        return (
                            <TableRow key={teacher.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium text-foreground">
                                    {teacher.teacher?.employee_no || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <button
                                            onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
                                            className="font-medium hover:text-blue-600 hover:underline text-left text-foreground"
                                        >
                                            {teacher.first_name} {teacher.last_name}
                                        </button>
                                        <div className="text-sm text-muted-foreground">
                                            {teacher.username || 'No username'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="text-sm text-foreground">{teacher.email}</div>
                                        <div className="text-sm text-muted-foreground">{teacher.phone}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {teacher.teacher?.subjects?.map((subject: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs bg-secondary text-secondary-foreground"
                                            >
                                                {subject}
                                            </Badge>
                                        ))}

                                        {assignedSubjects.map((subject: any, index: number) => (
                                            <Badge
                                                key={`assigned-${index}`}
                                                variant="default"
                                                className="text-xs"
                                            >
                                                {subject.subject.name} ✓
                                            </Badge>
                                        ))}

                                        {(!teacher.teacher?.subjects || teacher.teacher.subjects.length === 0) &&
                                            assignedSubjects.length === 0 && (
                                                <span className="text-muted-foreground text-xs">
                                                    No subjects
                                                </span>
                                            )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                                        {teacher.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={teacher.email_verified ? 'default' : 'outline'}>
                                        {teacher.email_verified ? 'Verified' : 'Not Verified'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditTeacher(teacher)}
                                            className="border-border hover:bg-blue-500/10 hover:text-blue-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onAssignTeacher(teacher)}
                                            className="border-border hover:bg-green-500/10 hover:text-green-600"
                                        >
                                            <BookOpen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                            className="border-border hover:bg-destructive/10 hover:text-destructive"
                                            disabled={deleteTeacherMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};