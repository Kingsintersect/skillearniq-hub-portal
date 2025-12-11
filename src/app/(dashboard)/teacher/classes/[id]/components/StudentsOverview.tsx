import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
'@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Mail, MoreVertical, Phone } from 'lucide-react';

export const StudentsOverview: React.FC<{
    students: any[];
    selectedStudents: number[];
    onStudentSelect: (studentId: number) => void;
    onSelectAll: () => void;
    className: string;
}> = ({ students, selectedStudents, onStudentSelect, onSelectAll, className }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">Student Enrollments</span>
                        <CardDescription className="mt-1">
                            {className} • {students.length} students enrolled
                        </CardDescription>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onSelectAll}
                    >
                        {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Switch
                                        checked={students.length > 0 && selectedStudents.length === students.length}
                                        onCheckedChange={() => { }}
                                    />
                                </TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Enrollment</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <Switch
                                            checked={selectedStudents.includes(student.id)}
                                            onCheckedChange={() => onStudentSelect(student.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarImage src={student.avatar} />
                                                <AvatarFallback>
                                                    {student.name.split(' ').map((n: any) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">{student.name}</div>
                                                <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{student.email}</div>
                                        <div className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                                            <Mail className="h-3 w-3" />
                                            <Phone className="h-3 w-3" />
                                            <span>{student.phone}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(student.enrollmentDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">1st Term</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={student.averageScore || 0} className="w-20 h-2" />
                                            <span className="text-sm font-medium">{student.averageScore || 0}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};