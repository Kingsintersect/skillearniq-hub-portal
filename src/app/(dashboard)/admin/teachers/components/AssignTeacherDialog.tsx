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
import { AssignTeacherPayload } from '@/lib/services/admin/teacherService';
import { useTeachersPageContext } from './TeachersPageProvider';

interface AssignTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacher: any;
}

export const AssignTeacherDialog: React.FC<AssignTeacherDialogProps> = ({
    open,
    onOpenChange,
    teacher,
}) => {
    const { useAssignTeacher } = useAdminQueries();
    const assignTeacherMutation = useAssignTeacher();
    const { categories, courses, getCoursesForCategory } = useTeachersPageContext();

    const [assignment, setAssignment] = useState({
        class_group_id: 0,
        subject_id: 0,
        teacher_id: 0,
        start_date: '',
        end_date: '',
        meta: {
            semester: 'First',
            room: '',
        },
    });

    const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

    // Filter top-level categories (main categories)
    const topLevelCategories = categories.filter(cat =>
        !categories.some(parent =>
            parent.children?.some((child: any) => child.id === cat.id)
        )
    );

    useEffect(() => {
        if (teacher) {
            setAssignment(prev => ({
                ...prev,
                teacher_id: teacher.id,
            }));
        }
    }, [teacher]);

    // When category changes, update subcategories
    useEffect(() => {
        if (selectedCategory) {
            const categoryId = parseInt(selectedCategory);
            const selectedCat = categories.find(cat => cat.id === categoryId);

            if (selectedCat?.children) {
                setAvailableSubcategories(selectedCat.children);
            } else {
                setAvailableSubcategories([]);
                // If no subcategories, set class_group_id directly
                setAssignment(prev => ({ ...prev, class_group_id: categoryId }));
            }
        } else {
            setAvailableSubcategories([]);
        }
    }, [selectedCategory, categories]);

    // When class_group_id changes, update filtered courses
    useEffect(() => {
        if (assignment.class_group_id > 0) {
            const coursesForCategory = getCoursesForCategory(assignment.class_group_id);
            setFilteredCourses(coursesForCategory);
            // Reset subject selection when category changes
            setAssignment(prev => ({ ...prev, subject_id: 0 }));
        } else {
            setFilteredCourses([]);
        }
    }, [assignment.class_group_id, getCoursesForCategory]);

    // Handle subcategory selection
    const handleSubcategoryChange = (value: string) => {
        const subcategoryId = parseInt(value);
        setAssignment(prev => ({ ...prev, class_group_id: subcategoryId }));
    };

    const handleAssignTeacher = () => {
        if (!teacher) return;

        const payload: AssignTeacherPayload = {
            class_group_id: assignment.class_group_id,
            subject_id: assignment.subject_id,
            teacher_id: teacher.id,
            start_date: assignment.start_date,
            end_date: assignment.end_date,
            meta: assignment.meta,
        };

        assignTeacherMutation.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                // Reset form
                setSelectedCategory('');
                setAvailableSubcategories([]);
                setFilteredCourses([]);
                setAssignment({
                    class_group_id: 0,
                    subject_id: 0,
                    teacher_id: 0,
                    start_date: '',
                    end_date: '',
                    meta: { semester: 'First', room: '' },
                });
                toast.success('Teacher assigned successfully!');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to assign teacher');
            },
        });
    };

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setSelectedCategory('');
                setAvailableSubcategories([]);
                setFilteredCourses([]);
                setAssignment({
                    class_group_id: 0,
                    subject_id: 0,
                    teacher_id: 0,
                    start_date: '',
                    end_date: '',
                    meta: { semester: 'First', room: '' },
                });
            }, 300);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Assign Teacher to Course
                    </DialogTitle>
                    <DialogDescription>
                        Assign {teacher?.first_name} {teacher?.last_name} to a course
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label className="text-foreground">Category</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-full bg-background border-border">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                                {topLevelCategories.map((category: any) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                        className="text-foreground"
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subcategory Selection (only shown when category has children) */}
                    {availableSubcategories.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-foreground">Subcategory</Label>
                            <Select
                                value={assignment.class_group_id.toString()}
                                onValueChange={handleSubcategoryChange}
                            >
                                <SelectTrigger className="w-full bg-background border-border">
                                    <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    {availableSubcategories.map((subcategory: any) => (
                                        <SelectItem
                                            key={subcategory.id}
                                            value={subcategory.id.toString()}
                                            className="text-foreground"
                                        >
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Course Selection */}
                    <div className="space-y-2">
                        <Label className="text-foreground">Course (Subject)</Label>
                        <Select
                            value={assignment.subject_id.toString()}
                            onValueChange={(value) =>
                                setAssignment({
                                    ...assignment,
                                    subject_id: parseInt(value),
                                })
                            }
                            disabled={assignment.class_group_id === 0}
                        >
                            <SelectTrigger className="w-full bg-background border-border">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                                {filteredCourses.map((course: any) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                        className="text-foreground"
                                    >
                                        {course.fullname} ({course.shortname})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {assignment.class_group_id === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Please select a category/subcategory first
                            </p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-foreground">Start Date</Label>
                            <Input
                                type="date"
                                value={assignment.start_date}
                                onChange={(e) =>
                                    setAssignment({
                                        ...assignment,
                                        start_date: e.target.value,
                                    })
                                }
                                className="bg-background border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">End Date</Label>
                            <Input
                                type="date"
                                value={assignment.end_date}
                                onChange={(e) =>
                                    setAssignment({ ...assignment, end_date: e.target.value })
                                }
                                className="bg-background border-border"
                            />
                        </div>
                    </div>

                    {/* Semester and Room */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-foreground">Semester</Label>
                            <Select
                                value={assignment.meta.semester}
                                onValueChange={(value) =>
                                    setAssignment({
                                        ...assignment,
                                        meta: { ...assignment.meta, semester: value },
                                    })
                                }
                            >
                                <SelectTrigger className="bg-background border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectItem value="First" className="text-foreground">
                                        First Semester
                                    </SelectItem>
                                    <SelectItem value="Second" className="text-foreground">
                                        Second Semester
                                    </SelectItem>
                                    <SelectItem value="Third" className="text-foreground">
                                        Third Semester
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Room</Label>
                            <Input
                                value={assignment.meta.room}
                                onChange={(e) =>
                                    setAssignment({
                                        ...assignment,
                                        meta: { ...assignment.meta, room: e.target.value },
                                    })
                                }
                                placeholder="Room number"
                                className="bg-background border-border"
                            />
                        </div>
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
                        onClick={handleAssignTeacher}
                        disabled={
                            assignTeacherMutation.isPending ||
                            assignment.class_group_id === 0 ||
                            assignment.subject_id === 0 ||
                            !assignment.start_date ||
                            !assignment.end_date
                        }
                    >
                        {assignTeacherMutation.isPending ? 'Assigning...' : 'Assign Teacher'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};