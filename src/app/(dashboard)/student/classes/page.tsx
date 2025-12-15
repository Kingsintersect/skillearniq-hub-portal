
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStudentQueries } from '@/hooks/useStudentQueries';
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  BookMarked,
  Search,
  Filter,
  Download,
  ChevronRight,
  BarChart3,
  Loader2,
  AlertCircle,
  FolderOpen,
  Layers,
  Target,
  GraduationCap,
  ExternalLink,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const CoursesPage: React.FC = () => {
  // All hooks at the top - unconditional
  const { useCourses, useStudentCourses, useAssessments, useAttendance } = useStudentQueries();
  const { data: coursesResponse, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: studentCoursesResponse, isLoading: studentCoursesLoading } = useStudentCourses();
  const { data: assessmentsResponse } = useAssessments();
  const { data: attendanceResponse } = useAttendance();

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'available'>('all');
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract data safely
  const moodleCourses = coursesResponse?.data || [];
  const studentCoursesData = studentCoursesResponse?.data?.data || [];
  const assessments = assessmentsResponse?.data || [];
  const attendance = attendanceResponse?.data || [];

  console.log('Moodle Courses:', moodleCourses);
  console.log('Student Courses Data:', studentCoursesData);

  // Merge course data
  const allCourses = useMemo(() => {
    if (!mounted) return [];
    
    // Create a map of student courses by name or code for easier lookup
    const studentCoursesMap = new Map();
    studentCoursesData.forEach((course: any) => {
      const key = course.name?.toLowerCase() || course.course?.toLowerCase();
      if (key) {
        studentCoursesMap.set(key, course);
      }
    });
    
    return moodleCourses.map((moodleCourse: any) => {
      // Try to find matching student course data
      const matchingStudentCourse = studentCoursesData.find((sc: any) => 
        sc.name?.toLowerCase() === moodleCourse.fullname?.toLowerCase() ||
        sc.code?.toLowerCase() === moodleCourse.shortname?.toLowerCase()
      );
      
      return {
        id: moodleCourse.id,
        fullname: moodleCourse.fullname,
        shortname: moodleCourse.shortname,
        summary: moodleCourse.summary,
        format: moodleCourse.format,
        startdate: moodleCourse.startdate,
        enddate: moodleCourse.enddate,
        visible: moodleCourse.visible,
        timecreated: moodleCourse.timecreated,
        timemodified: moodleCourse.timemodified,
        // Student course data if available
        studentCourseData: matchingStudentCourse || null,
        isEnrolled: !!matchingStudentCourse,
        progress: matchingStudentCourse?.progress || 0,
        currentGrade: matchingStudentCourse?.currentGrade || 'N/A',
        teacher: matchingStudentCourse?.teacher || {
          id: 0,
          name: 'Not Assigned',
          email: '',
          phone: '',
          avatar: '',
          Course: 'N/A'
        },
        studentCount: matchingStudentCourse?.studentCount || 0,
        assignments: matchingStudentCourse?.assignments || 0,
        materials: matchingStudentCourse?.materials || 0,
        nextTopic: matchingStudentCourse?.nextTopic || 'Not Available'
      };
    });
  }, [moodleCourses, studentCoursesData, mounted]);

  // Get unique categories
  // const categories = ['all', ...new Set(moodleCourses.map((c: any) => c.category))].filter(Boolean);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!mounted) return [];
    
    return allCourses.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortname.toLowerCase().includes(searchTerm.toLowerCase());
      
      // const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'enrolled' && course.isEnrolled) ||
        (activeTab === 'available' && !course.isEnrolled);
      
      return matchesSearch  && matchesTab;
    });
  }, [allCourses, searchTerm, activeTab, mounted]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const enrolledCourses = allCourses.filter(c => c.isEnrolled);
    const totalProgress = enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    const averageProgress = enrolledCourses.length > 0 ? totalProgress / enrolledCourses.length : 0;
    
    const totalAssignments = enrolledCourses.reduce((sum, c) => sum + (c.assignments || 0), 0);
    const totalStudents = enrolledCourses.reduce((sum, c) => sum + (c.studentCount || 0), 0);
    
    // Count active assessments
    const courseAssessments = assessments.filter(a => 
      enrolledCourses.some(c => 
        c.fullname.toLowerCase().includes(a.subject?.toLowerCase() || '')
      )
    );
    const activeAssessments = courseAssessments.filter(a => a.score === null).length;
    
    return {
      totalCourses: allCourses.length,
      enrolledCourses: enrolledCourses.length,
      averageProgress,
      totalAssignments,
      totalStudents,
      activeAssessments
    };
  }, [allCourses, assessments]);

  // Loading state
  if (coursesLoading || studentCoursesLoading || !mounted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <div>Loading courses information...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (coursesError) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error loading courses</h3>
            <p className="text-muted-foreground">Please try again later</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
              <p className="text-lg text-muted-foreground">Browse and manage your enrolled courses</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Course List
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-foreground">{overallStats.totalCourses}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                  <p className="text-2xl font-bold text-foreground">{overallStats.enrolledCourses}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <GraduationCap className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                  <p className="text-2xl font-bold text-foreground">{overallStats.averageProgress.toFixed(1)}%</p>
                  <Progress value={overallStats.averageProgress} className="w-full mt-2 h-2" />
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Work</p>
                  <p className="text-2xl font-bold text-foreground">{overallStats.activeAssessments}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="enrolled">Enrolled ({overallStats.enrolledCourses})</TabsTrigger>
                  <TabsTrigger value="available">Available ({overallStats.totalCourses - overallStats.enrolledCourses})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Courses</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by course name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(c => c !== 'all').map(category => (
                      <SelectItem key={category} value={category}>Category {category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select defaultValue="name">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Course Name</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="enrollment">Enrollment Date</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Display */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Found</h3>
              <p className="text-muted-foreground">
                {allCourses.length === 0 
                  ? "No courses are available at the moment."
                  : "No courses match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={() => setSelectedCourse(course.id)}
              />
            ))}
          </div>
        ) : (
          // List View
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Teacher</TableHead>
                    {/* <TableHead>Students</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="font-medium">{course.fullname}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.format} • Created: {format(new Date(course.timecreated * 1000), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.shortname}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.isEnrolled ? "default" : "secondary"}>
                          {course.isEnrolled ? 'Enrolled' : 'Available'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{course.teacher.name}</div>
                        <div className="text-sm text-muted-foreground">{course.teacher.email}</div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{course.studentCount}</span>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedCourse(course.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* {course.isEnrolled ? (
                            <Button size="sm">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Open
                            </Button>
                          ) : (
                            <Link  href="/enrollment" size="sm" variant="secondary">
                              Enroll
                            </Link>
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Course Details Dialog */}
        {selectedCourse && (
          <CourseDetailsDialog
            course={allCourses.find(c => c.id === selectedCourse)}
            assessments={assessments}
            attendance={attendance}
            open={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<{
  course: any;
  onSelect: () => void;
}> = ({ course, onSelect }) => {
  const formatDate = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return 'Not set';
    return format(new Date(timestamp * 1000), 'MMM dd, yyyy');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.fullname}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{course.shortname}</Badge>
              <span>•</span>
              <span>{course.format}</span>
            </CardDescription>
          </div>
          <Badge variant={course.isEnrolled ? "default" : "secondary"}>
            {course.isEnrolled ? 'Enrolled' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start:</span>
            <span>{formatDate(course.startdate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">End:</span>
            <span>{formatDate(course.enddate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Updated:</span>
            <span>{formatDate(course.timemodified)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {course.isEnrolled && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{course.progress.toFixed(1)}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Teacher Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{course.teacher.name?.[0] || 'T'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{course.teacher.name}</div>
            <div className="text-xs text-muted-foreground">{course.teacher.email}</div>
          </div>
        </div>

        {/* Quick Stats */}
        {course.isEnrolled && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">{course.assignments}</div>
              <div className="text-muted-foreground">Assignments</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-600">{course.materials}</div>
              <div className="text-muted-foreground">Materials</div>
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <div className="font-semibold text-purple-600">{course.studentCount}</div>
              <div className="text-muted-foreground">Students</div>
            </div>
          </div>
        )}

        <Button className="w-full" variant={course.isEnrolled ? "default" : "outline"} size="sm">
          {course.isEnrolled ? 'Open Course' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

// Course Details Dialog Component
const CourseDetailsDialog: React.FC<{
  course: any;
  assessments: any[];
  attendance: any[];
  open: boolean;
  onClose: () => void;
}> = ({ course, assessments, attendance, open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'grades' | 'participants'>('overview');

  if (!course) return null;

  // Filter assessments and attendance for this course
  const courseAssessments = assessments.filter(a => 
    a.subject?.toLowerCase().includes(course.fullname.toLowerCase()) ||
    course.fullname.toLowerCase().includes(a.subject?.toLowerCase() || '')
  );

  const courseAttendance = attendance.filter(a => 
    a.subject?.toLowerCase().includes(course.fullname.toLowerCase()) ||
    course.fullname.toLowerCase().includes(a.subject?.toLowerCase() || '')
  );

  const formatDate = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return 'Not set';
    return format(new Date(timestamp * 1000), 'MMMM dd, yyyy');
  };

  // Parse HTML summary safely
  const parseSummary = (html: string) => {
    if (!html) return 'No description available';
    
    // Remove HTML tags for display
    const stripped = html.replace(/<[^>]*>/g, '');
    return stripped.length > 200 ? stripped.substring(0, 200) + '...' : stripped;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{course.fullname}</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{course.shortname}</Badge>
              <Badge variant={course.isEnrolled ? "default" : "secondary"}>
                {course.isEnrolled ? 'Enrolled' : 'Available'}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            {course.format} • Created: {formatDate(course.timecreated)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Course Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {parseSummary(course.summary)}
                </p>
                {course.summary && course.summary.length > 200 && (
                  <Button variant="link" className="mt-2 p-0 h-auto">
                    Read more
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Code:</span>
                    <span className="font-medium">{course.shortname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">{course.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{formatDate(course.startdate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{formatDate(course.enddate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{formatDate(course.timemodified)}</span>
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
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{course.teacher.name?.[0] || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{course.teacher.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.teacher.email}</p>
                      <p className="text-sm text-muted-foreground">{course.teacher.Course}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress and Stats */}
            {course.isEnrolled && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span className="font-semibold">{course.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{course.assignments}</div>
                        <div className="text-sm text-muted-foreground">Assignments</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{course.materials}</div>
                        <div className="text-sm text-muted-foreground">Materials</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{course.studentCount}</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                      </div>
                    </div>
                    
                    {course.nextTopic && course.nextTopic !== 'Not Available' && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <div className="font-semibold text-yellow-800">Next Topic</div>
                        <div className="text-sm text-yellow-600">{course.nextTopic}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Topics, materials, and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {course.isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Course Content</h3>
                      <p className="text-muted-foreground mb-4">
                        Access all course materials, topics, and assignments.
                      </p>
                      <Button>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Learning Platform
                      </Button>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{course.materials}</div>
                          <div className="text-sm text-muted-foreground">Learning Materials</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{course.assignments}</div>
                          <div className="text-sm text-muted-foreground">Assignments</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{courseAssessments.length}</div>
                          <div className="text-sm text-muted-foreground">Assessments</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Course Content Not Available</h3>
                    <p className="text-muted-foreground mb-6">
                      You need to enroll in this course to access its content.
                    </p>
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grades & Assessments</CardTitle>
                <CardDescription>Your performance in this course</CardDescription>
              </CardHeader>
              <CardContent>
                {course.isEnrolled ? (
                  courseAssessments.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No assessment records available for this course</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Current Grade */}
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Current Grade</div>
                        <div className="text-3xl font-bold my-2">{course.currentGrade}</div>
                        <div className="text-sm text-muted-foreground">Based on completed assessments</div>
                      </div>
                      
                      {/* Assessments List */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Recent Assessments</h4>
                        {courseAssessments.slice(0, 5).map((assessment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{assessment.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {assessment.type} • {new Date(assessment.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              {assessment.score !== null ? (
                                <>
                                  <div className="font-bold">
                                    {assessment.score}/{assessment.max_score}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {((assessment.score / assessment.max_score) * 100).toFixed(1)}%
                                  </div>
                                </>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {courseAssessments.length > 5 && (
                        <Button variant="outline" className="w-full">
                          View All Assessments
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Enroll in this course to view grades and assessments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Participants</CardTitle>
                <CardDescription>Students enrolled in this course</CardDescription>
              </CardHeader>
              <CardContent>
                {course.isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{course.studentCount}</div>
                      <div className="text-sm text-muted-foreground">Total Students</div>
                    </div>
                    
                    {/* Attendance Summary */}
                    {courseAttendance.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Attendance Summary</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-green-50 rounded text-center">
                            <div className="font-bold text-green-600">
                              {courseAttendance.filter(a => a.status === 'present').length}
                            </div>
                            <div className="text-xs text-muted-foreground">Present</div>
                          </div>
                          <div className="p-3 bg-red-50 rounded text-center">
                            <div className="font-bold text-red-600">
                              {courseAttendance.filter(a => a.status === 'absent').length}
                            </div>
                            <div className="text-xs text-muted-foreground">Absent</div>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded text-center">
                            <div className="font-bold text-yellow-600">
                              {courseAttendance.filter(a => a.status === 'late').length}
                            </div>
                            <div className="text-xs text-muted-foreground">Late</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        View Class Participants
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Enroll in this course to view participants</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CoursesPage;