'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Download, 
  Search,
  Filter,
  Award,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  User,
  BookMarked,
  GraduationCap
} from 'lucide-react';

export const StudentClassesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026', // Default to current academic year
    term: '1st', // Default to current term
    teacher: 'all',
    subject: 'all'
  });
  
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - current academic year 2024-2025, current term 1st
  const classes = [
    {
      id: 1,
      name: 'Mathematics',
      code: 'MATH202',
      subject: 'Mathematics',
      teacher: {
        id: 1,
        name: 'Mr. Smith',
        email: 'smith@school.edu',
        phone: '+1234567890',
        avatar: '',
        department: 'Mathematics'
      },
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 201',
      academicYear: '2025-2026',
      term: '1st',
      progress: 75,
      currentGrade: 'A',
      attendance: 95,
      nextTopic: 'Algebraic Expressions',
      materials: 12,
      assignments: 8,
      students: 28,
      assessments: [
        { type: 'test', title: 'Algebra Test 1', score: 28, maxScore: 30, date: '2025-01-15' },
        { type: 'quiz', title: 'Geometry Quiz', score: 9, maxScore: 10, date: '2025-01-22' },
        { type: 'exam', title: 'Mid-Term Exam', score: 55, maxScore: 60, date: '2025-02-01' }
      ],
      studyGroups: [
        { id: 1, name: 'Math Study Group', members: 8, description: 'Algebra focus group' }
      ]
    },
    {
      id: 2,
      name: 'English Language',
      code: 'ENG201',
      subject: 'English',
      teacher: {
        id: 2,
        name: 'Mrs. Johnson',
        email: 'johnson@school.edu',
        phone: '+1234567891',
        avatar: '',
        department: 'Languages'
      },
      schedule: 'Tue, Thu - 10:30 AM',
      room: 'Room 105',
      academicYear: '2025-2026',
      term: '1st',
      progress: 60,
      currentGrade: 'B+',
      attendance: 92,
      nextTopic: 'Essay Writing Techniques',
      materials: 8,
      assignments: 6,
      students: 25,
      assessments: [
        { type: 'test', title: 'Grammar Test', score: 26, maxScore: 30, date: '2025-01-18' },
        { type: 'quiz', title: 'Vocabulary Quiz', score: 8, maxScore: 10, date: '2025-01-25' },
        { type: 'exam', title: 'Literature Exam', score: 54, maxScore: 60, date: '2025-02-05' }
      ],
      studyGroups: []
    },
    {
      id: 3,
      name: 'Science',
      code: 'SCI301',
      subject: 'Science',
      teacher: {
        id: 3,
        name: 'Dr. Brown',
        email: 'brown@school.edu',
        phone: '+1234567892',
        avatar: '',
        department: 'Sciences'
      },
      schedule: 'Mon, Wed - 2:00 PM',
      room: 'Lab 301',
      academicYear: '2025-2026',
      term: '1st',
      progress: 85,
      currentGrade: 'A-',
      attendance: 98,
      nextTopic: 'Chemical Reactions',
      materials: 15,
      assignments: 10,
      students: 30,
      assessments: [
        { type: 'test', title: 'Physics Test', score: 25, maxScore: 30, date: '2025-01-20' },
        { type: 'quiz', title: 'Chemistry Quiz', score: 8, maxScore: 10, date: '2025-01-27' },
        { type: 'exam', title: 'Science Mid-Term', score: 52, maxScore: 60, date: '2025-02-08' }
      ],
      studyGroups: [
        { id: 2, name: 'Science Club', members: 12, description: 'Lab experiments group' }
      ]
    },
    // Previous academic year data for filtering demo
    {
      id: 4,
      name: 'Mathematics',
      code: 'MATH201',
      subject: 'Mathematics',
      teacher: {
        id: 1,
        name: 'Mr. Smith',
        email: 'smith@school.edu',
        phone: '+1234567890',
        avatar: '',
        department: 'Mathematics'
      },
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 201',
      academicYear: '2024-2025',
      term: '3rd',
      progress: 100,
      currentGrade: 'A',
      attendance: 94,
      nextTopic: 'Completed',
      materials: 10,
      assignments: 12,
      students: 28,
      assessments: [],
      studyGroups: []
    }
  ];

  // Get unique values for filters
  const academicYears = [...new Set(classes.map(c => c.academicYear))];
  const terms = ['1st', '2nd', '3rd'];
  const teachers = [...new Set(classes.map(c => c.teacher.name))];
  const subjects = [...new Set(classes.map(c => c.subject))];

  // Filter classes based on current filters
  const filteredClasses = useMemo(() => {
    return classes.filter(cls =>
      cls.academicYear === filters.academicYear &&
      cls.term === filters.term &&
      (filters.teacher === 'all' || cls.teacher.name === filters.teacher) &&
      (filters.subject === 'all' || cls.subject === filters.subject) &&
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cls.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cls.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [filters, searchTerm]);

  const selectedClassData = classes.find(cls => cls.id === selectedClass);

  const handleExportClassData = (classId: number) => {
    toast.success(`Class data exported for class ${classId}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Classes</h1>
          <p className="text-lg text-muted-foreground">View your classes, assessments, attendance, and study groups</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={filters.academicYear}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select
                  value={filters.term}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map(term => (
                      <SelectItem key={term} value={term}>{term} Term</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher</Label>
                <Select
                  value={filters.teacher}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, teacher: value }))}
                >
                  <SelectTrigger>
                    <SelectValue>Select Teacher</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue>Select Subject</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassCard 
              key={classItem.id} 
              classItem={classItem} 
              isSelected={selectedClass === classItem.id}
              onSelect={() => setSelectedClass(classItem.id)}
              onExport={handleExportClassData}
            />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No classes found</h3>
              <p className="text-muted-foreground">No classes match your current filters</p>
            </CardContent>
          </Card>
        )}

        {/* Class Details Dialog */}
        {selectedClassData && (
          <ClassDetailsDialog
            class={selectedClassData}
            open={!!selectedClass}
            onClose={() => setSelectedClass(null)}
          />
        )}
      </div>
    </div>
  );
};

// Class Card Component
const ClassCard: React.FC<{
  classItem: any;
  isSelected: boolean;
  onSelect: () => void;
  onExport: (classId: number) => void;
}> = ({ classItem, isSelected, onSelect, onExport }) => {
  // Calculate totals and averages
  const totalAssessments = classItem.assessments.length;
  const averageScore = totalAssessments > 0 
    ? classItem.assessments.reduce((sum: number, a: any) => sum + (a.score / a.maxScore) * 100, 0) / totalAssessments
    : 0;

  const testScore = classItem.assessments.find((a: any) => a.type === 'test')?.score || 0;
  const quizScore = classItem.assessments.find((a: any) => a.type === 'quiz')?.score || 0;
  const examScore = classItem.assessments.find((a: any) => a.type === 'exam')?.score || 0;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="bg-primary h-2 rounded-t-lg -mx-6 -mt-6 mb-4"></div>
        <CardTitle className="flex items-center justify-between">
          <span>{classItem.name}</span>
          <Badge variant="secondary">{classItem.currentGrade}</Badge>
        </CardTitle>
        <CardDescription>{classItem.code} • {classItem.room} • {classItem.term} Term</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Teacher Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={classItem.teacher.avatar} />
            <AvatarFallback>{classItem.teacher.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{classItem.teacher.name}</div>
            <div className="text-xs text-muted-foreground">{classItem.teacher.department}</div>
          </div>
        </div>

        {/* Progress and Attendance */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{classItem.progress}%</span>
            </div>
            <Progress value={classItem.progress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Attendance</span>
              <span className="font-medium">{classItem.attendance}%</span>
            </div>
            <Progress value={classItem.attendance} className="h-2" />
          </div>
        </div>

        {/* Assessment Scores */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">{testScore}/30</div>
            <div className="text-muted-foreground">Tests</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-600">{quizScore}/10</div>
            <div className="text-muted-foreground">Quizzes</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="font-semibold text-purple-600">{examScore}/60</div>
            <div className="text-muted-foreground">Exams</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{classItem.studyGroups.length} groups</span>
          <span>{classItem.assessments.length} assessments</span>
          <span>Avg: {averageScore.toFixed(1)}%</span>
        </div>

        <Button className="w-full" variant={isSelected ? "default" : "outline"}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

// Class Details Dialog Component
const ClassDetailsDialog: React.FC<{
  class: any;
  open: boolean;
  onClose: () => void;
}> = ({ class: classItem, open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'attendance' | 'groups'>('overview');

  // Calculate grade breakdown
  const testTotal = classItem.assessments.filter((a: any) => a.type === 'test').reduce((sum: number, a: any) => sum + a.score, 0);
  const quizTotal = classItem.assessments.filter((a: any) => a.type === 'quiz').reduce((sum: number, a: any) => sum + a.score, 0);
  const examTotal = classItem.assessments.filter((a: any) => a.type === 'exam').reduce((sum: number, a: any) => sum + a.score, 0);

  const testMax = classItem.assessments.filter((a: any) => a.type === 'test').reduce((sum: number, a: any) => sum + a.maxScore, 0);
  const quizMax = classItem.assessments.filter((a: any) => a.type === 'quiz').reduce((sum: number, a: any) => sum + a.maxScore, 0);
  const examMax = classItem.assessments.filter((a: any) => a.type === 'exam').reduce((sum: number, a: any) => sum + a.maxScore, 0);

  const totalScore = testTotal + quizTotal + examTotal;
  const totalMax = testMax + quizMax + examMax;
  const overallPercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  
   return (
  <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className="max-w-4xl max-h-[95vh] h-[85vh] flex flex-col overflow-hidden min-h-0">
      <DialogHeader>
        <DialogTitle className="flex justify-between items-center">
          <span>
            {classItem.name} - {classItem.academicYear} {classItem.term} Term
          </span>
          <Badge variant="secondary">{classItem.currentGrade}</Badge>
        </DialogTitle>
        <DialogDescription>
          {classItem.code} • {classItem.room} • Teacher: {classItem.teacher.name}
        </DialogDescription>
      </DialogHeader>

      {/* Tabs container */}
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="flex-1 flex flex-col overflow-hidden min-h-0"
      >
        {/* keep the tab list from growing */}
        <TabsList className="grid grid-cols-4 shrink-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
        </TabsList>

        {/* wrapper that gives tabs a bounded area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* ---------------- FULL OVERVIEW TAB (unchanged content, only class tweaks) ---------------- */}
          <TabsContent value="overview" className="flex-1 flex flex-col min-h-0 p-4">
            {/* This is the actual vertical scroller for Overview */}
            <div className="flex-1 min-h-0 overflow-auto pr-2">
              <div className="space-y-6">
                {/* Grade Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Breakdown</CardTitle>
                    <CardDescription>Test (30%), Quiz (10%), Exam (60%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {testTotal}/{testMax}
                          </div>
                          <div className="text-sm text-muted-foreground">Tests (30%)</div>
                          <Progress value={(testTotal / testMax) * 100} className="mt-2" />
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {quizTotal}/{quizMax}
                          </div>
                          <div className="text-sm text-muted-foreground">Quizzes (10%)</div>
                          <Progress value={(quizTotal / quizMax) * 100} className="mt-2" />
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {examTotal}/{examMax}
                          </div>
                          <div className="text-sm text-muted-foreground">Exams (60%)</div>
                          <Progress value={(examTotal / examMax) * 100} className="mt-2" />
                        </div>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {overallPercentage.toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground">Overall Score</div>
                        <Badge variant="default" className="mt-2">
                          {classItem.currentGrade}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={classItem.teacher.avatar} />
                        <AvatarFallback>{classItem.teacher.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{classItem.teacher.name}</h4>
                        <p className="text-muted-foreground">
                          {classItem.teacher.department} Department
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{classItem.teacher.email}</span>
                          </span>
                        </div>
                      </div>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ---------------- ASSESSMENTS TAB ---------------- */}
          <TabsContent value="assessments" className="flex-1 flex flex-col min-h-0 p-4">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader>
                <CardTitle>All Assessments</CardTitle>
                <CardDescription>Tests, quizzes, and exams for this class</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
                <div className="flex-1 min-h-0 overflow-auto">
                  <div className="p-6">
                    <div className="rounded-md border overflow-x-auto">
                      <Table className="min-w-[900px] w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap px-4 py-2">Type</TableHead>
                            <TableHead className="whitespace-nowrap px-4 py-2">Title</TableHead>
                            <TableHead className="whitespace-nowrap px-4 py-2">Date</TableHead>
                            <TableHead className="whitespace-nowrap px-4 py-2">Score</TableHead>
                            <TableHead className="whitespace-nowrap px-4 py-2">Percentage</TableHead>
                            <TableHead className="whitespace-nowrap px-4 py-2">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(classItem.assessments ?? []).map((assessment: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="whitespace-nowrap px-4 py-2">
                                <Badge
                                  variant={
                                    assessment.type === "test"
                                      ? "default"
                                      : assessment.type === "quiz"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {assessment.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap px-4 py-2">
                                {assessment.title}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-2">
                                {new Date(assessment.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-2">
                                {assessment.score}/{assessment.maxScore}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-2">
                                {((assessment.score / assessment.maxScore) * 100).toFixed(1)}%
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-2">
                                <Badge variant="default">
                                  {getGradeFromPercentage((assessment.score / assessment.maxScore) * 100)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- GROUPS TAB ---------------- */}
          <TabsContent value="groups" className="flex-1 flex flex-col min-h-0 p-4">
            <div className="flex-1 min-h-0 overflow-auto p-6">
              <div className="space-y-4">
                {classItem.studyGroups.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-semibold text-foreground mb-2">No Study Groups</h4>
                      <p className="text-muted-foreground">
                        You haven't been added to any study groups for this class
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  classItem.studyGroups.map((group: any) => (
                    <Card key={group.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{group.name}</h4>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span>{group.members} members</span>
                            </div>
                          </div>
                          <Button>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Join Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </DialogContent>
  </Dialog>
);


};

// Helper function to get grade from percentage
const getGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  if (percentage >= 50) return 'E';
  return 'F';
};

export default StudentClassesPage;