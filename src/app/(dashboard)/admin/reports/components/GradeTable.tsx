// components/GradeTable.tsx
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table as TableIcon } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
        case 'A': return 'default';
        case 'B': return 'secondary';
        case 'C': return 'outline';
        case 'D': return 'destructive';
        case 'F': return 'destructive';
        default: return 'outline';
    }
};

const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
        case 'A': return 'bg-primary text-primary-foreground';
        case 'B': return 'bg-secondary text-secondary-foreground';
        case 'C': return 'border-accent text-accent-500';
        case 'D': return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
        case 'F': return 'bg-destructive text-destructive-foreground';
        default: return '';
    }
};

export default function GradeTable() {
    const { gradeData } = useGradeStore();

    if (gradeData.length === 0) return null;

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <TableIcon className="h-5 w-5 text-primary" />
                    Student Grade Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Detailed breakdown of student performance
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <Table className="px-20">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Email</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">First Name</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Last Name</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Assignment</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Quiz</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Exam</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Total (%)</TableHead>
                                <TableHead className="py-4 px-6 text-xl text-foreground font-semibold">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gradeData.map((student) => (
                                <TableRow
                                    key={student.id}
                                    className="border-b border-border/50 hover:bg-accent/30 transition-all duration-200 group"
                                >
                                    <TableCell className="px-6 font-medium text-foreground group-hover:translate-x-1 transition-transform">
                                        {student.email}
                                    </TableCell>
                                    <TableCell className="px-6 text-foreground">{student.firstName}</TableCell>
                                    <TableCell className="px-6 text-foreground">{student.lastName}</TableCell>
                                    <TableCell className="px-6 text-foreground text-center">{student.assignment}</TableCell>
                                    <TableCell className="px-6 text-foreground text-center">{student.quiz}</TableCell>
                                    <TableCell className="px-6 text-foreground text-center">{student.exam}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center justify-center">
                                            <span className="font-semibold text-foreground bg-primary/10 px-3 py-1.5 rounded-lg min-w-[60px] text-center">
                                                {student.total}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex justify-center">
                                            <div className={`flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105 ${getGradeBadgeClass(student.grade)}`}>
                                                {student.grade}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}