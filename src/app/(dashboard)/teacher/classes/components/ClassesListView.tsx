import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Users } from 'lucide-react';

export const ClassesListView: React.FC<{
    classes: any[];
    onSelectClass: (classId: number) => void;
    selectedClass: number | null;
}> = ({ classes, onSelectClass, selectedClass }) => {
    if (classes.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No classes found</h3>
                    <p className="text-muted-foreground">No classes assigned for the selected filters</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Level & Arm</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes.map((classItem) => (
                        <TableRow
                            key={classItem.id}
                            className={`cursor-pointer hover:bg-muted/50 ${selectedClass === classItem.id ? 'bg-muted' : ''
                                }`}
                            onClick={() => onSelectClass(classItem.id)}
                        >
                            <TableCell className="font-medium">{classItem.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{classItem.level}{classItem.arm}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">{classItem.term} Term</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span>{classItem.studentCount} students</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectClass(classItem.id);
                                    }}
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};