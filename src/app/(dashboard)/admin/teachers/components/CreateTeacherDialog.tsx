"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAdminQueries } from '@/hooks/useAdminQueries';
import { CreateTeacherPayload } from '@/lib/services/admin/teacherService';

interface CreateTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateTeacherDialog: React.FC<CreateTeacherDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const { useCreateTeacher } = useAdminQueries();
    const createTeacherMutation = useCreateTeacher();

    const [newTeacher, setNewTeacher] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        phone: '',
        password: 'P@55word',
        employee_no: '',
        hire_date: '',
        subjects: [] as string[],
    });

    const handleCreateTeacher = () => {
        const payload: CreateTeacherPayload = {
            first_name: newTeacher.first_name,
            last_name: newTeacher.last_name,
            email: newTeacher.email,
            username: newTeacher.username,
            phone: newTeacher.phone,
            password: newTeacher.password,
            teacher: {
                employee_no: newTeacher.employee_no,
                hire_date: newTeacher.hire_date,
                subjects: newTeacher.subjects,
            },
        };

        createTeacherMutation.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                setNewTeacher({
                    first_name: '',
                    last_name: '',
                    email: '',
                    username: '',
                    phone: '',
                    password: 'P@55word',
                    employee_no: '',
                    hire_date: '',
                    subjects: [],
                });
                toast.success('Teacher created successfully!');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create teacher');
            },
        });
    };

    const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subjects = e.target.value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        setNewTeacher({ ...newTeacher, subjects });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Teacher</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-foreground">First Name *</Label>
                        <Input
                            value={newTeacher.first_name}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, first_name: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Last Name *</Label>
                        <Input
                            value={newTeacher.last_name}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, last_name: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Email *</Label>
                        <Input
                            type="email"
                            value={newTeacher.email}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, email: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Username *</Label>
                        <Input
                            value={newTeacher.username}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, username: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Phone *</Label>
                        <Input
                            value={newTeacher.phone}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, phone: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Employee No *</Label>
                        <Input
                            value={newTeacher.employee_no}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, employee_no: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Hire Date</Label>
                        <Input
                            type="date"
                            value={newTeacher.hire_date}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, hire_date: e.target.value })
                            }
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Password *</Label>
                        <Input
                            type="password"
                            value={newTeacher.password}
                            onChange={(e) =>
                                setNewTeacher({ ...newTeacher, password: e.target.value })
                            }
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-foreground">Subjects (comma-separated)</Label>
                        <Input
                            placeholder="Math, Science, English"
                            value={newTeacher.subjects.join(', ')}
                            onChange={handleSubjectsChange}
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
                        onClick={handleCreateTeacher}
                        disabled={createTeacherMutation.isPending}
                    >
                        {createTeacherMutation.isPending ? 'Creating...' : 'Add Teacher'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};