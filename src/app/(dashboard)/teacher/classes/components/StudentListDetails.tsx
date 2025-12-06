"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadMoreTrigger } from './LoadMoreTrigger';
import { ArrowLeftCircle, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StudentListDetailsProps {
    class: any;
    students: any[];
    studentSearch: string;
    onStudentSearchChange: (search: string) => void;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    isFetchingMore: boolean;
    assessments: any[];
    performanceData: any[];
}

export const StudentListDetails: React.FC<StudentListDetailsProps> = ({
    class: classItem,
    students,
    studentSearch,
    onStudentSearchChange,
    onLoadMore,
    hasMore,
    isLoading,
    isFetchingMore,
    assessments,
    performanceData,
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'students' | 'assessments' | 'performance'>('students');

    if (!classItem) return null;

    return (
        <div className="mx-5 space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                        <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => router.push('/teacher/classes')}
                        >
                            <ArrowLeftCircle className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="p-6 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">{classItem.shortName} - Class Management</h1>
                                <p className="text-muted-foreground mt-1">
                                    Managing {classItem.studentCount} students in {classItem.term} Term
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as any)}
                        className="flex flex-col space-y-7"
                    >
                        <div className="px-6 pt-4">
                            <TabsList className="grid grid-cols-3">
                                <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                                <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
                                <TabsTrigger value="performance">Performance</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1">
                            <TabsContent value="students" className="flex flex-col">
                                <div className="p-4 border-b">
                                    <Input
                                        placeholder="Search students by name or email..."
                                        value={studentSearch}
                                        onChange={(e) => onStudentSearchChange(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <ScrollArea className="min-h-[200px]">
                                    {isLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                            <p className="text-muted-foreground mt-2">Loading students...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Student</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Enrollment Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {students.map((student) => (
                                                        <TableRow key={student.id}>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-3">
                                                                    <Avatar>
                                                                        <AvatarImage src={student.avatar} />
                                                                        <AvatarFallback>{student.name}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="font-medium">{student.name}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                            <TableCell>
                                                                {new Date(student.enrollmentDate).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">Active</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            <LoadMoreTrigger onLoadMore={onLoadMore} hasMore={hasMore} />

                                            {students.length === 0 && !isLoading && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    No students found {studentSearch ? 'matching your search' : 'in this class'}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="assessments">
                                <ScrollArea className="min-h-[100px] p-4">
                                    <div className="space-y-4">
                                        {assessments.map((assessment) => (
                                            <Card key={assessment.id}>
                                                <CardHeader>
                                                    <CardTitle className="flex justify-between items-start">
                                                        <span>{assessment.title}</span>
                                                        <Badge variant={
                                                            assessment.type === 'quiz' ? 'secondary' :
                                                                assessment.type === 'assignment' ? 'default' : 'destructive'
                                                        }>
                                                            {assessment.type}
                                                        </Badge>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Due: {new Date(assessment.dueDate).toLocaleDateString()} • Max Score: {assessment.maxScore}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Status: {assessment.status}</span>
                                                        <span>Created: {new Date(assessment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="performance">
                                <ScrollArea className="min-h-[200px] p-4">
                                    <div className="space-y-4">
                                        {performanceData.map((student) => (
                                            <Card key={student.studentId}>
                                                <CardHeader>
                                                    <CardTitle className="flex justify-between items-start">
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar>
                                                                <AvatarImage src={student.avatar} />
                                                                <AvatarFallback>{student.name}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{student.name}</span>
                                                        </div>
                                                        <Badge variant={student.averageScore >= 80 ? 'default' : student.averageScore >= 60 ? 'secondary' : 'destructive'}>
                                                            {student.averageScore.toFixed(1)}%
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span>Overall Average</span>
                                                                <span>{student.averageScore.toFixed(1)}%</span>
                                                            </div>
                                                            <Progress value={student.averageScore} className="h-2" />
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {student.assignmentsCompleted} of {student.totalAssignments} assignments completed
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};


// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useState } from 'react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { LoadMoreTrigger } from './LoadMoreTrigger';

// export const StudentListDetails: React.FC<{
//     class: any;
//     students: any[];
//     studentSearch: string;
//     onStudentSearchChange: (search: string) => void;
//     onLoadMore: () => void;
//     hasMore: boolean;
//     isLoading: boolean;
//     isFetchingMore: boolean;
//     assessments: any[];
//     performanceData: any[];
//     open: boolean;
//     onClose: () => void;
// }> = ({
//     class: classItem,
//     students,
//     studentSearch,
//     onStudentSearchChange,
//     onLoadMore,
//     hasMore,
//     isLoading,
//     isFetchingMore,
//     assessments,
//     performanceData,
//     open,
//     onClose
// }) => {
//         const [activeTab, setActiveTab] = useState<'students' | 'assessments' | 'performance'>('students');

//         if (!classItem) return null;

//         return (
//             <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
//                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//                     <DialogHeader>
//                         <DialogTitle className="flex justify-between items-center">
//                             <span>{classItem.shortName} - Class Management</span>
//                             <div className="flex space-x-2">
//                                 <Button variant="outline" size="sm">
//                                     Export CSV
//                                 </Button>
//                             </div>
//                         </DialogTitle>
//                         <DialogDescription>
//                             Managing {classItem.studentCount} students in {classItem.term} Term
//                         </DialogDescription>
//                     </DialogHeader>

//                     <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
//                         <TabsList className="grid grid-cols-3">
//                             <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
//                             <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
//                             <TabsTrigger value="performance">Performance</TabsTrigger>
//                         </TabsList>

//                         <div className="flex-1 overflow-hidden">
//                             <TabsContent value="students" className="h-full flex flex-col">
//                                 <div className="p-4 border-b">
//                                     <Input
//                                         placeholder="Search students by name or email..."
//                                         value={studentSearch}
//                                         onChange={(e) => onStudentSearchChange(e.target.value)}
//                                         className="w-full"
//                                     />
//                                 </div>

//                                 <ScrollArea className="flex-1">
//                                     {isLoading ? (
//                                         <div className="text-center py-8">
//                                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//                                             <p className="text-muted-foreground mt-2">Loading students...</p>
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>Student</TableHead>
//                                                         <TableHead>Email</TableHead>
//                                                         <TableHead>Enrollment Date</TableHead>
//                                                         <TableHead>Status</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {students.map((student) => (
//                                                         <TableRow key={student.id}>
//                                                             <TableCell>
//                                                                 <div className="flex items-center space-x-3">
//                                                                     <Avatar>
//                                                                         <AvatarImage src={student.avatar} />
//                                                                         <AvatarFallback>{student.name}</AvatarFallback>
//                                                                     </Avatar>
//                                                                     <span className="font-medium">{student.name}</span>
//                                                                 </div>
//                                                             </TableCell>
//                                                             <TableCell>{student.email}</TableCell>
//                                                             <TableCell>
//                                                                 {new Date(student.enrollmentDate).toLocaleDateString()}
//                                                             </TableCell>
//                                                             <TableCell>
//                                                                 <Badge variant="outline">Active</Badge>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>

//                                             <LoadMoreTrigger onLoadMore={onLoadMore} hasMore={hasMore} />

//                                             {students.length === 0 && !isLoading && (
//                                                 <div className="text-center py-8 text-muted-foreground">
//                                                     No students found {studentSearch ? 'matching your search' : 'in this class'}
//                                                 </div>
//                                             )}
//                                         </>
//                                     )}
//                                 </ScrollArea>
//                             </TabsContent>

//                             <TabsContent value="assessments" className="h-full">
//                                 <ScrollArea className="h-full p-4">
//                                     <div className="space-y-4">
//                                         {assessments.map((assessment) => (
//                                             <Card key={assessment.id}>
//                                                 <CardHeader>
//                                                     <CardTitle className="flex justify-between items-start">
//                                                         <span>{assessment.title}</span>
//                                                         <Badge variant={
//                                                             assessment.type === 'quiz' ? 'secondary' :
//                                                                 assessment.type === 'assignment' ? 'default' : 'destructive'
//                                                         }>
//                                                             {assessment.type}
//                                                         </Badge>
//                                                     </CardTitle>
//                                                     <CardDescription>
//                                                         Due: {new Date(assessment.dueDate).toLocaleDateString()} • Max Score: {assessment.maxScore}
//                                                     </CardDescription>
//                                                 </CardHeader>
//                                                 <CardContent>
//                                                     <div className="flex justify-between text-sm">
//                                                         <span>Status: {assessment.status}</span>
//                                                         <span>Created: {new Date(assessment.createdAt).toLocaleDateString()}</span>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 </ScrollArea>
//                             </TabsContent>

//                             <TabsContent value="performance" className="h-full">
//                                 <ScrollArea className="h-full p-4">
//                                     <div className="space-y-4">
//                                         {performanceData.map((student) => (
//                                             <Card key={student.studentId}>
//                                                 <CardHeader>
//                                                     <CardTitle className="flex justify-between items-start">
//                                                         <div className="flex items-center space-x-3">
//                                                             <Avatar>
//                                                                 <AvatarImage src={student.avatar} />
//                                                                 <AvatarFallback>{student.name}</AvatarFallback>
//                                                             </Avatar>
//                                                             <span>{student.name}</span>
//                                                         </div>
//                                                         <Badge variant={student.averageScore >= 80 ? 'default' : student.averageScore >= 60 ? 'secondary' : 'destructive'}>
//                                                             {student.averageScore.toFixed(1)}%
//                                                         </Badge>
//                                                     </CardTitle>
//                                                 </CardHeader>
//                                                 <CardContent>
//                                                     <div className="space-y-3">
//                                                         <div>
//                                                             <div className="flex justify-between text-sm mb-1">
//                                                                 <span>Overall Average</span>
//                                                                 <span>{student.averageScore.toFixed(1)}%</span>
//                                                             </div>
//                                                             <Progress value={student.averageScore} className="h-2" />
//                                                         </div>
//                                                         <div className="text-sm text-muted-foreground">
//                                                             {student.assignmentsCompleted} of {student.totalAssignments} assignments completed
//                                                         </div>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 </ScrollArea>
//                             </TabsContent>
//                         </div>
//                     </Tabs>
//                 </DialogContent>
//             </Dialog>
//         );
//     };