// Group Management Component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, UserPlus } from 'lucide-react';

export const GroupManagement: React.FC<{
    group: any;
    students: any[];
    onAddStudent: (groupId: number, studentId: number) => Promise<void>;
    onRemoveStudent: (groupId: number, studentId: number) => Promise<void>;
    onDelete: () => void;
}> = ({ group, students, onAddStudent, onRemoveStudent, onDelete }) => {
    const availableStudents = students.filter(s => !group.studentIds.includes(s.id));
    const groupStudents = students.filter(s => group.studentIds.includes(s.id));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Students */}
                <div>
                    <h4 className="font-semibold mb-3">Available Students ({availableStudents.length})</h4>
                    <ScrollArea className="h-64 border rounded-lg">
                        <div className="p-2 space-y-2">
                            {availableStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback className="text-sm">{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-medium">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => onAddStudent(group.id, student.id)}
                                        className="px-3 py-1 text-xs"
                                    >
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Group Members */}
                <div>
                    <h4 className="font-semibold mb-3">Group Members ({groupStudents.length})</h4>
                    <ScrollArea className="h-64 border rounded-lg">
                        <div className="p-2 space-y-2">
                            {groupStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback className="text-sm">{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-medium">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onRemoveStudent(group.id, student.id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 px-3 py-1 text-xs"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between">
                <Button variant="outline" onClick={onDelete} className="text-red-600 border-red-200 hover:bg-red-50">
                    Delete Group
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Done
                </Button>
            </div>
        </div>
    );
};


// Groups Overview Component
export const GroupsOverview: React.FC<{
    groups: any[];
    students: any[];
    onManageGroup: (group: any) => void;
    onDeleteGroup: (groupId: number) => void;
}> = ({ groups, students, onManageGroup, onDeleteGroup }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => {
                const groupStudents = students.filter(s => group.studentIds.includes(s.id));
                return (
                    <Card key={group.id} className="hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-lg font-bold">{group.name}</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {groupStudents.length} members
                                </Badge>
                            </CardTitle>
                            <CardDescription>{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Group Members</h4>
                                    <div className="space-y-2">
                                        {groupStudents.slice(0, 3).map((student) => (
                                            <div key={student.id} className="flex items-center space-x-2 text-sm">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={student.avatar} />
                                                    <AvatarFallback className="text-xs">{student.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span>{student.name}</span>
                                            </div>
                                        ))}
                                        {groupStudents.length > 3 && (
                                            <div className="text-xs text-muted-foreground">
                                                +{groupStudents.length - 3} more students
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onManageGroup(group)}
                                    >
                                        Manage
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDeleteGroup(group.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {groups.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first student group to get started</p>
                    <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Group
                    </Button>
                </div>
            )}
        </div>
    );
};