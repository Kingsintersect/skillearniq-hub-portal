
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
import { Table as TableIcon, Users, Info } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
        case 'A': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300';
        case 'B': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300';
        case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300';
        case 'D': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-300';
        case 'F': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-300';
    }
};

export default function GradeTable() {
    const { gradeData, courseInfo } = useGradeStore();

    if (gradeData.length === 0) return null;

    // Calculate statistics
    const averageGrade = gradeData.reduce((sum, student) => sum + student.total, 0) / gradeData.length;
    const passingStudents = gradeData.filter(student => student.grade !== 'F').length;
    const passingRate = (passingStudents / gradeData.length) * 100;

    return (
        <>
            {/* Statistics Summary */}
            <Card className="bg-card border-border mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">Total Students</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{gradeData.length}</p>
                        </div>
                        
                        <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-foreground">Average Grade</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{averageGrade.toFixed(1)}%</p>
                        </div>
                        
                        <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-foreground">Passing Students</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {passingStudents} <span className="text-sm font-normal">({passingRate.toFixed(1)}%)</span>
                            </p>
                        </div>
                        
                        <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium text-foreground">Course Code</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{courseInfo?.course_code || 'N/A'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grade Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <TableIcon className="h-5 w-5 text-primary" />
                        Student Grade Details
                        {courseInfo && (
                            <Badge variant="outline" className="ml-2">
                                {courseInfo.course_code}: {courseInfo.course_name}
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Detailed breakdown of student performance - {gradeData.length} students
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-b border-border hover:bg-transparent">
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">#</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Student</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Assignment</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Quiz</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Exam</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Total (%)</TableHead>
                                    <TableHead className="py-4 px-6 text-foreground font-semibold">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gradeData.map((student, index) => (
                                    <TableRow
                                        key={student.id}
                                        className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                                    >
                                        <TableCell className="px-6 font-medium text-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div>
                                                <div className="font-medium text-foreground">
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {student.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="text-center">
                                                <span className="inline-flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                                    {student.assignment}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="text-center">
                                                <span className="inline-flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                                    {student.quiz}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="text-center">
                                                <span className="inline-flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                                                    {student.exam}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="flex items-center justify-center">
                                                <span className={`font-semibold px-3 py-1.5 rounded-lg min-w-[60px] text-center ${
                                                    student.total >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    student.total >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                    student.total >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    student.total >= 60 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {student.total}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-sm ${getGradeBadgeClass(student.grade)}`}>
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
        </>
    );
}