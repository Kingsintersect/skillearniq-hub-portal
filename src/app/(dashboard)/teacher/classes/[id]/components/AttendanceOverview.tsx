'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

export const AttendanceOverview: React.FC<{
    attendance: any;
}> = ({ attendance }) => {
    const attendanceData = attendance?.daily || [];
    const courseName = attendance?.course_details?.fullname || 'Course';
    
    const averageRate = attendanceData.length > 0
        ? attendanceData.reduce((acc: number, day: any) => acc + (day.rate || 0), 0) / attendanceData.length
        : 0;
    
    const totalPresent = attendanceData.reduce((acc: number, day: any) => 
        acc + (day.present || 0), 0);
    
    const totalAbsent = attendanceData.reduce((acc: number, day: any) => 
        acc + (day.absent || 0), 0);

    if (!attendance || attendanceData.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No Attendance Records</h3>
                <p className="text-sm text-muted-foreground mt-1">No attendance data available for this course</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Average Attendance Rate</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{averageRate.toFixed(1)}%</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                            <CheckCircle size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Present</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{totalPresent}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                            <Users size={18} />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Days attended</p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Absent</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{totalAbsent}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                            <XCircle size={18} />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Days missed</p>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-hidden rounded-2xl border border-border/70">
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="text-foreground font-semibold">Date</TableHead>
                                <TableHead className="text-foreground font-semibold">Present</TableHead>
                                <TableHead className="text-foreground font-semibold">Absent</TableHead>
                                <TableHead className="text-foreground font-semibold">Late</TableHead>
                                <TableHead className="text-foreground font-semibold">Attendance Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.map((day: any, index: number) => {
                                const date = day.date || `Day ${index + 1}`;
                                const present = day.present || 0;
                                const absent = day.absent || 0;
                                const late = day.late || 0;
                                const rate = day.rate || 0;
                                
                                return (
                                    <motion.tr
                                        key={date}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                        className="hover:bg-muted/30 border-border/50"
                                    >
                                        <TableCell className="font-medium text-foreground">
                                            {day.date ? (
                                                new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            ) : (
                                                date
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                                                {present}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-red-600 border-red-200">
                                                {absent}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                                                {late}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={rate} className="w-20 h-1.5" />
                                                <span className="text-sm font-medium text-foreground">{rate}%</span>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};