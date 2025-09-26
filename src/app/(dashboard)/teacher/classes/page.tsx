'use client'
import React, { useState, useMemo } from 'react';
import { useTeacherClasses, useClassStudentsInfinite, useClassAssessments, useStudentPerformance, useAcademicYears } from '@/hooks/use-classes';
import { useInView } from 'react-intersection-observer';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  MoreVertical,
  GraduationCap,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    term: '1st',
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const currentTeacherId = 1;
  const { data: classes, isLoading: classesLoading } = useTeacherClasses(currentTeacherId, filters);
  const { data: academicYears } = useAcademicYears(currentTeacherId);
  
  const { 
    data: studentsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading: studentsLoading 
  } = useClassStudentsInfinite(selectedClass || 0, studentSearch);
  
  const { data: assessments } = useClassAssessments(selectedClass || 0);
  const { data: performanceData } = useStudentPerformance(selectedClass || 0);

  const allStudents = useMemo(() => {
    return studentsData?.pages.flatMap(page => page.students) || [];
  }, [studentsData]);

  const selectedClassData = classes?.find(cls => cls.id === selectedClass);
  const terms = ['1st', '2nd', '3rd'];

  if (classesLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Classes</h1>
          <p className="text-muted-foreground text-lg">View and manage your assigned classes</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold text-foreground">{classes?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">
                    {classes?.reduce((sum, cls) => sum + cls.studentCount, 0) || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Terms</p>
                  <p className="text-2xl font-bold text-foreground">{terms.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-foreground">85.6%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears?.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={filters.term}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, term: value as any }))}
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
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                >
                  {view === 'grid' ? 'List View' : 'Grid View'}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes List */}
          <div className={`${selectedClass ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {view === 'grid' ? (
              <ClassesGridView 
                classes={classes || []} 
                onSelectClass={setSelectedClass}
                selectedClass={selectedClass}
              />
            ) : (
              <ClassesListView 
                classes={classes || []} 
                onSelectClass={setSelectedClass}
                selectedClass={selectedClass}
              />
            )}
          </div>

          {/* Class Details Sidebar */}
          {selectedClass && (
            <div className="lg:col-span-1">
              <ClassDetails 
                class={selectedClassData}
                assessments={assessments || []}
                performanceData={performanceData || []}
                studentCount={allStudents.length}
                onClose={() => setSelectedClass(null)}
              />
            </div>
          )}
        </div>

        {/* Student List Dialog */}
        <StudentListDialog
          class={selectedClassData}
          students={allStudents}
          studentSearch={studentSearch}
          onStudentSearchChange={setStudentSearch}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoading={studentsLoading}
          isFetchingMore={isFetchingNextPage}
          assessments={assessments || []}
          performanceData={performanceData || []}
          open={!!selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      </div>
    </div>
  );
};

// Load More Component
const LoadMoreTrigger: React.FC<{ onLoadMore: () => void; hasMore: boolean }> = ({ onLoadMore, hasMore }) => {
  const { ref, inView } = useInView();
  
  React.useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  if (!hasMore) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        All students loaded
      </div>
    );
  }

  return (
    <div ref={ref} className="text-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
    </div>
  );
};

// Student List Dialog
const StudentListDialog: React.FC<{
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
  open: boolean;
  onClose: () => void;
}> = ({ 
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
  open, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'assessments' | 'performance'>('students');

  if (!classItem) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{classItem.shortName} - Class Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Managing {classItem.studentCount} students in {classItem.academicYear} {classItem.term} Term
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
            <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="students" className="h-full flex flex-col">
              <div className="p-4 border-b">
                <Input
                  placeholder="Search students by name or email..."
                  value={studentSearch}
                  onChange={(e) => onStudentSearchChange(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <ScrollArea className="flex-1">
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

            <TabsContent value="assessments" className="h-full">
              <ScrollArea className="h-full p-4">
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

            <TabsContent value="performance" className="h-full">
              <ScrollArea className="h-full p-4">
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
      </DialogContent>
    </Dialog>
  );
};

// Class Details Component
const ClassDetails: React.FC<{
  class: any;
  assessments: any[];
  performanceData: any[];
  studentCount: number;
  onClose: () => void;
}> = ({ class: classItem, assessments, performanceData, studentCount, onClose }) => {
  const averagePerformance = performanceData.length > 0 
    ? performanceData.reduce((sum, student) => sum + student.averageScore, 0) / performanceData.length
    : 0;

  return (
    <Card className="sticky top-6 h-fit">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{classItem.shortName}</CardTitle>
            <CardDescription>{classItem.name}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Class Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Academic Year:</span>
              <span>{classItem.academicYear}</span>
              <span className="text-muted-foreground">Term:</span>
              <Badge variant="outline">{classItem.term}</Badge>
              <span className="text-muted-foreground">Level:</span>
              <span>{classItem.level}</span>
              <span className="text-muted-foreground">Arm:</span>
              <span>{classItem.arm}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-primary/10 rounded">
              <div className="font-bold text-primary">{studentCount}</div>
              <div>Students</div>
            </div>
            <div className="text-center p-2 bg-green-500/10 rounded">
              <div className="font-bold text-green-500">{assessments.length}</div>
              <div>Assessments</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Class Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Score:</span>
                <span className="font-medium">{averagePerformance.toFixed(1)}%</span>
              </div>
              <Progress value={averagePerformance} className="h-2" />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recent Assessments</h4>
            <div className="space-y-2">
              {assessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex justify-between items-center p-2 border rounded text-sm">
                  <span className="truncate">{assessment.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {assessment.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Grid View Component
const ClassesGridView: React.FC<{
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <ClassCard 
          key={classItem.id}
          classItem={classItem}
          isSelected={selectedClass === classItem.id}
          onClick={() => onSelectClass(classItem.id)}
        />
      ))}
    </div>
  );
};

// List View Component
const ClassesListView: React.FC<{
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
            <TableHead>Academic Year</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow 
              key={classItem.id} 
              className={`cursor-pointer hover:bg-muted/50 ${
                selectedClass === classItem.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectClass(classItem.id)}
            >
              <TableCell className="font-medium">{classItem.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{classItem.level}{classItem.arm}</Badge>
              </TableCell>
              <TableCell>{classItem.academicYear}</TableCell>
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

// Class Card Component
const ClassCard: React.FC<{
  classItem: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ classItem, isSelected, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{classItem.shortName}</span>
          <Badge variant="secondary">{classItem.studentCount}</Badge>
        </CardTitle>
        <CardDescription>{classItem.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Academic Year:</span>
            <span className="font-medium">{classItem.academicYear}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Term:</span>
            <Badge variant="outline">{classItem.term}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level:</span>
            <Badge variant="secondary">{classItem.level}</Badge>
          </div>
        </div>
        <Button className="w-full mt-4" variant={isSelected ? "default" : "outline"}>
          {isSelected ? 'Viewing Details' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassesPage;