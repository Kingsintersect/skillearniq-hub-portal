"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAdminQueries } from '@/hooks/useAdminQueries';

interface EditTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacher: any;
}

export const EditTeacherDialog: React.FC<EditTeacherDialogProps> = ({
    open,
    onOpenChange,
    teacher,
}) => {
    const { useUpdateTeacher } = useAdminQueries();
    const updateTeacherMutation = useUpdateTeacher();

    const [editTeacher, setEditTeacher] = useState({
        email_verified: 0,
        meta: [] as string[],
        subjects: [] as string[],
    });

    useEffect(() => {
        if (teacher) {
            setEditTeacher({
                email_verified: teacher.email_verified || 0,
                meta: teacher.meta || [],
                subjects: teacher.teacher?.subjects || [],
            });
        }
    }, [teacher]);

    const handleEditTeacher = () => {
        if (!teacher) return;

        const payload = {
            email_verified: editTeacher.email_verified,
            meta: editTeacher.meta,
            teacher: {
                subjects: editTeacher.subjects,
            },
        };

        updateTeacherMutation.mutate(
            {
                id: teacher.id,
                payload,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Teacher updated successfully!');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update teacher');
                },
            }
        );
    };

    const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subjects = e.target.value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        setEditTeacher({ ...editTeacher, subjects });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Edit Teacher</DialogTitle>
                    <DialogDescription>
                        Update {teacher?.first_name} {teacher?.last_name}'s information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-foreground">Email Verified</Label>
                        <Select
                            value={editTeacher.email_verified.toString()}
                            onValueChange={(value) =>
                                setEditTeacher({
                                    ...editTeacher,
                                    email_verified: parseInt(value),
                                })
                            }
                        >
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                                <SelectItem value="0" className="text-foreground">
                                    Not Verified
                                </SelectItem>
                                <SelectItem value="1" className="text-foreground">
                                    Verified
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Subjects (comma-separated)</Label>
                        <Input
                            placeholder="Math, Science, English"
                            value={editTeacher.subjects.join(', ')}
                            onChange={handleSubjectsChange}
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Meta (comma-separated)</Label>
                        <Input
                            placeholder="Key1:Value1, Key2:Value2"
                            value={editTeacher.meta.join(', ')}
                            onChange={(e) =>
                                setEditTeacher({
                                    ...editTeacher,
                                    meta: e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter((s) => s.length > 0),
                                })
                            }
                            className="bg-background border-border"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-border"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditTeacher}
                        disabled={updateTeacherMutation.isPending}
                    >
                        {updateTeacherMutation.isPending ? 'Updating...' : 'Update Teacher'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};