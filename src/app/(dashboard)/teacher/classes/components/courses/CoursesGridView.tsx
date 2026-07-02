'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../hooks/use-categories';
import { BookOpen, Clock, Eye, User, Users, Calendar, PlayCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { teacherService } from '@/lib/services/teacherService';

// LMS URL - update with your actual LMS URL
const LMS_BASE_URL = process.env.NEXT_PUBLIC_LMS_URL || 'https://your-lms.com';

interface CoursesGridViewProps {
  searchTerm?: string;
}

export const CoursesGridView = ({ searchTerm = '' }: CoursesGridViewProps) => {
  const { courses, isCoursesLoading } = useCategories();
  const [studentCounts, setStudentCounts] = useState<Record<number, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Fetch student counts for each course
  useEffect(() => {
    const fetchStudentCounts = async () => {
      if (courses.length === 0) return;
      
      setIsLoadingCounts(true);
      try {
        const counts: Record<number, number> = {};
        for (const course of courses) {
          try {
            const response = await teacherService.getStudentsPerCourse(course.id);
            if (response.data && Array.isArray(response.data)) {
              counts[course.id] = response.data.length;
            } else {
              counts[course.id] = 0;
            }
          } catch (error) {
            console.error(`Failed to fetch students for course ${course.id}:`, error);
            counts[course.id] = 0;
          }
        }
        setStudentCounts(counts);
      } catch (error) {
        console.error('Failed to fetch student counts:', error);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchStudentCounts();
  }, [courses]);

  // Also try to get counts from the course data itself if available
  useEffect(() => {
    if (courses.length > 0) {
      const counts: Record<number, number> = {};
      courses.forEach((course: any) => {
        if (course.studentCount !== undefined) {
          counts[course.id] = course.studentCount;
        } else if (course.students && Array.isArray(course.students)) {
          counts[course.id] = course.students.length;
        }
      });
      if (Object.keys(counts).length > 0) {
        setStudentCounts(counts);
      }
    }
  }, [courses]);

  const filteredCourses = courses.filter((course: any) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCourseLmsUrl = (courseId: number) => {
    return `${LMS_BASE_URL}/course/view.php?id=${courseId}`;
  };

  if (isCoursesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border/70">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 bg-muted/50" />
              <Skeleton className="h-4 w-1/2 mt-2 bg-muted/50" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2 bg-muted/50" />
              <Skeleton className="h-4 w-2/3 bg-muted/50" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-8 w-20 bg-muted/50" />
                <Skeleton className="h-8 w-16 bg-muted/50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground">No Courses Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm ? 'No courses match your search criteria' : 'No courses available for this study stream'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCourses.map((course: any, index: number) => {
        const studentCount = studentCounts[course.id] ?? 0;
        const courseLmsUrl = getCourseLmsUrl(course.id);
        
        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Card className="hover:shadow-md transition-shadow bg-card border border-border/70 hover:border-primary/20 h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg text-foreground truncate">{course.name}</CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground truncate">
                      {course.shortName}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0 bg-secondary text-secondary-foreground">
                    {course.credits} Credits
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {course.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-sm mt-auto pt-2 border-t border-border/50">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{isLoadingCounts ? '...' : studentCount}</span>
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Term</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Continue Button - Redirects to LMS */}
                    <Link href={courseLmsUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1 h-8 px-3"
                        title="Continue teaching this course"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Continue</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1 h-8 px-3 border-border/70 hover:border-primary/30"
                    >
                      <Link href={`/teacher/classes/${course.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};