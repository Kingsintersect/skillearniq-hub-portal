'use client';

import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '../../hooks/use-categories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Users, Calendar, PlayCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { teacherService } from '@/lib/services/teacherService';

// LMS URL - update with your actual LMS URL
const LMS_BASE_URL = process.env.NEXT_PUBLIC_LMS_URL || 'https://your-lms.com';

interface CoursesTableViewProps {
  searchTerm?: string;
}

export const CoursesTableView = ({ searchTerm = '' }: CoursesTableViewProps) => {
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
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-muted/50" />
        ))}
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground">No Courses Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm ? 'No courses match your search criteria' : 'No courses available for this study stream'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/70 rounded-2xl bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-foreground font-semibold">Course Code</TableHead>
            <TableHead className="text-foreground font-semibold">Course Name</TableHead>
            <TableHead className="text-foreground font-semibold hidden md:table-cell">Description</TableHead>
            <TableHead className="text-foreground font-semibold">Credits</TableHead>
            <TableHead className="text-foreground font-semibold hidden sm:table-cell">Students</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.map((course: any, index: number) => {
            const studentCount = studentCounts[course.id] ?? 0;
            const courseLmsUrl = getCourseLmsUrl(course.id);
            
            return (
              <motion.tr
                key={course.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="hover:bg-muted/30 border-border/50"
              >
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {course.shortName}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">{course.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {course.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="max-w-xs truncate text-muted-foreground">
                    {course.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-border/70 text-foreground">
                    {course.credits}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{isLoadingCounts ? '...' : studentCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Continue Button - Redirects to LMS */}
                    <Link href={courseLmsUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="sm"
                        variant="default"
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
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};