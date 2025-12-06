// src/components/teachers/TeachersPageView.tsx
"use client";

import React, { useState, useCallback, memo } from 'react';
import { TeachersTable } from './TeachersTable';
import { TeachersFilters } from './TeachersFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTeachersPageContext } from './TeachersPageProvider';
import { CreateTeacherDialog } from './CreateTeacherDialog';
import { EditTeacherDialog } from './EditTeacherDialog';
import { AssignTeacherDialog } from './AssignTeacherDialog';

const MemoizedTeachersFilters = memo(TeachersFilters);
const MemoizedTeachersTable = memo(TeachersTable);

export const TeachersPageView: React.FC = () => {
    const {
        isLoading,
        isError,
        error,
        refetch,
    } = useTeachersPageContext();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

    const handleEditTeacher = useCallback((teacher: any) => {
        setSelectedTeacher(teacher);
        setIsEditDialogOpen(true);
    }, []);

    const handleAssignTeacher = useCallback((teacher: any) => {
        setSelectedTeacher(teacher);
        setIsAssignDialogOpen(true);
    }, []);

    const handleDeleteTeacher = useCallback((teacherId: number) => {
        // Implement delete logic
        console.log('Delete teacher:', teacherId);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center bg-background">
                <div className="text-center text-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    Loading teachers...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center bg-background">
                <div className="text-center text-foreground">
                    <p className="text-destructive mb-4">Error loading data: {error?.message}</p>
                    <Button onClick={() => refetch()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Teachers Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage all teachers and their assignments
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                    </Button>
                </div>

                <MemoizedTeachersFilters />

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">All Teachers</CardTitle>
                        <CardDescription>
                            Manage and view all teachers in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemoizedTeachersTable
                            onEditTeacher={handleEditTeacher}
                            onAssignTeacher={handleAssignTeacher}
                        // onDeleteTeacher={handleDeleteTeacher}
                        />
                    </CardContent>
                </Card>

                <CreateTeacherDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />

                {selectedTeacher && (
                    <>
                        <EditTeacherDialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                            teacher={selectedTeacher}
                        />

                        <AssignTeacherDialog
                            open={isAssignDialogOpen}
                            onOpenChange={setIsAssignDialogOpen}
                            teacher={selectedTeacher}
                        />
                    </>
                )}
            </div>
        </div>
    );
};