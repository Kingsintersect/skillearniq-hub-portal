'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Mail, Phone, MoreVertical, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentsOverview: React.FC<{
    students: any[];
    selectedStudents: number[];
    onStudentSelect: (studentId: number) => void;
    onSelectAll: () => void;
    className: string;
}> = ({ students, selectedStudents, onStudentSelect, onSelectAll, className }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-border/70">
            <ScrollArea className="h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-12">
                                <Switch
                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                    onCheckedChange={onSelectAll}
                                />
                            </TableHead>
                            <TableHead className="text-foreground font-semibold">Student</TableHead>
                            <TableHead className="text-foreground font-semibold hidden md:table-cell">Contact</TableHead>
                            <TableHead className="text-foreground font-semibold hidden sm:table-cell">Enrollment</TableHead>
                            <TableHead className="text-foreground font-semibold">Performance</TableHead>
                            <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student: any, index: number) => {
                            const initials = student.name?.split(' ').map((n: string) => n[0]).join('') || 'S';
                            
                            return (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                    className="hover:bg-muted/30 border-border/50"
                                >
                                    <TableCell>
                                        <Switch
                                            checked={selectedStudents.includes(student.id)}
                                            onCheckedChange={() => onStudentSelect(student.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-border/50">
                                                <AvatarImage src={student.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-foreground">{student.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: {student.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="text-sm text-foreground">{student.email}</div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span>{student.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="text-sm text-foreground">
                                            {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">1st Term</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={student.averageScore || 0} className="w-16 h-1.5" />
                                            <span className="text-sm font-medium text-foreground">{student.averageScore || 0}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            );
                        })}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
};