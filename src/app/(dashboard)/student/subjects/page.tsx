"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Filter,
  FolderOpen,
  PlayCircle,
  Search,
  Users,
  ChevronRight,
  GraduationCap,
  Layers,
  FileText,
  Eye,
  User,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStudentQueries } from "@/hooks/useStudentQueries";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

const LMS_BASE_URL = process.env.NEXT_PUBLIC_LMS_URL || "https://your-lms.com";
const PAGE_SIZE = 5;

interface CourseItem {
  id: number;
  fullname: string;
  shortname: string;
  summary: string;
  format: string;
  startdate: number;
  enddate: number;
  visible: boolean;
  timecreated: number;
  timemodified: number;
  progress?: number;
  currentGrade?: string;
  teacher?: {
    id: number;
    name: string;
    email: string;
    bio?: string;
  };
  studentCount?: number;
  assignments?: number;
  materialsCount?: number;
  nextTopic?: string;
  isEnrolled?: boolean;
  schedule?: string;
  room?: string;
  term?: string;
  lmsUrl?: string;
}

function statusBadge(isEnrolled: boolean, progress?: number) {
  if (!isEnrolled) return <Badge variant="secondary">Available</Badge>;
  if (progress === 100)
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Completed
      </Badge>
    );
  if (progress && progress > 0 && progress < 100)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20">
        In Progress
      </Badge>
    );
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
      Not Started
    </Badge>
  );
}

function getGradeColor(grade?: string) {
  if (!grade || grade === "N/A" || grade === "In Progress")
    return "text-muted-foreground";
  const num = parseInt(grade);
  if (num >= 70) return "text-emerald-600";
  if (num >= 50) return "text-primary";
  if (num >= 40) return "text-amber-600";
  return "text-red-600";
}

function formatDate(timestamp: number) {
  if (!timestamp || timestamp === 0) return "Not set";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseSummary(html: string) {
  if (!html) return "No description available";
  const stripped = html.replace(/<[^>]*>/g, "");
  return stripped;
}

function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// Course Details Content Component
function CourseDetailsContent({ course }: { course: CourseItem }) {
  return (
    <div className="space-y-6 pb-6">
      {/* Course Description */}
      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Subject Description
        </h3>
        <p className="text-sm text-muted-foreground">
          {parseSummary(course.summary)}
        </p>
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Subject Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="font-medium">
                {formatDate(course.startdate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span className="font-medium">{formatDate(course.enddate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">
                {formatDate(course.timemodified)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">
                {course.visible ? "Active" : "Inactive"}
              </span>
            </div>
            {course.schedule && course.schedule !== "Schedule TBA" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schedule:</span>
                <span className="font-medium">{course.schedule}</span>
              </div>
            )}
            {course.room && course.room !== "TBA" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span className="font-medium">{course.room}</span>
              </div>
            )}
          </div>
        </div>

        {course.isEnrolled && (
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <Progress value={course.progress || 0} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {course.currentGrade}
                  </p>
                  <p className="text-xs text-muted-foreground">Current Grade</p>
                </div>
                <div className="text-center p-2 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {course.assignments}
                  </p>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                </div>
              </div>
              {course.nextTopic &&
                course.nextTopic !== "Not Available" &&
                course.nextTopic !== "Start Learning" && (
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <p className="text-xs text-amber-600 font-semibold">
                      Next Topic
                    </p>
                    <p className="text-sm text-foreground">
                      {course.nextTopic}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {course.teacher && course.teacher.name !== "Not Assigned" && (
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Teacher Information
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {course.teacher.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {course.teacher.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {course.teacher.email}
                </p>
              </div>
            </div>
            {course.teacher.bio && (
              <p className="mt-3 text-sm text-muted-foreground">
                {course.teacher.bio}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {course.isEnrolled ? (
          <>
            <Link
              href={course.lmsUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full gap-2">
                <PlayCircle size={16} />
                {course.progress === 100
                  ? "Review Course"
                  : "Continue Learning"}
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 gap-2">
              <FolderOpen size={16} />
              View Materials
            </Button>
          </>
        ) : (
          <Button className="w-full gap-2">
            <GraduationCap size={16} />
            Enroll Now
          </Button>
        )}
      </div>
    </div>
  );
}

export default function StudentClassesPage() {
  const { useStudentCourses, useCourses } = useStudentQueries();
  const { data: studentCoursesResponse, isLoading: studentCoursesLoading } =
    useStudentCourses();
  const { data: coursesResponse, isLoading: coursesLoading } = useCourses();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const studentCourses = studentCoursesResponse?.data?.data || [];
  const moodleCourses = coursesResponse?.data || [];

  // Build all courses from data
  const allCourses = useMemo(() => {
    return moodleCourses.map((moodleCourse: any) => {
      const matchingStudentCourse = studentCourses.find(
        (sc: any) =>
          sc.name?.toLowerCase() === moodleCourse.fullname?.toLowerCase() ||
          sc.code?.toLowerCase() === moodleCourse.shortname?.toLowerCase(),
      );

      const isEnrolled = !!matchingStudentCourse;
      const progress = matchingStudentCourse?.progress ?? 0;
      const lmsUrl = `${LMS_BASE_URL}/course/view.php?id=${moodleCourse.id}`;

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
        isEnrolled: isEnrolled,
        progress: progress,
        currentGrade:
          matchingStudentCourse?.currentGrade ||
          (isEnrolled ? "In Progress" : "N/A"),
        teacher: matchingStudentCourse?.teacher || {
          id: 0,
          name: "Not Assigned",
          email: "",
        },
        studentCount: matchingStudentCourse?.studentCount || 0,
        assignments: matchingStudentCourse?.assignments || 0,
        materialsCount: matchingStudentCourse?.materials || 0,
        nextTopic:
          matchingStudentCourse?.nextTopic ||
          (isEnrolled ? "Start Learning" : "Not Available"),
        schedule: "Schedule TBA",
        room: "TBA",
        term: "Current Term",
        lmsUrl: lmsUrl,
      };
    });
  }, [moodleCourses, studentCourses]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        searchTerm === "" ||
        course.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortname.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = false;

      switch (statusFilter) {
        case "all":
          matchesStatus = true;
          break;
        case "enrolled":
          matchesStatus = course.isEnrolled === true;
          break;
        case "available":
          matchesStatus = course.isEnrolled === false;
          break;
        case "in-progress":
          matchesStatus =
            course.isEnrolled === true &&
            course.progress !== undefined &&
            course.progress > 0 &&
            course.progress < 100;
          break;
        case "completed":
          matchesStatus = course.isEnrolled === true && course.progress === 100;
          break;
        case "not-started":
          matchesStatus =
            course.isEnrolled === true &&
            (course.progress === 0 || course.progress === undefined);
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [allCourses, searchTerm, statusFilter]);

  // Infinite Query for Grid View
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["courses-grid", filteredCourses],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const pageData = filteredCourses.slice(start, end);
      return {
        data: pageData,
        nextPage: end < filteredCourses.length ? pageParam + 1 : undefined,
        total: filteredCourses.length,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    enabled: viewMode === "grid" && filteredCourses.length > 0,
  });

  // Pagination for List View
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredCourses.slice(start, end);
  }, [filteredCourses, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const isLoading = studentCoursesLoading || coursesLoading;

  // Grid data
  const gridCourses = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.data);
  }, [infiniteData]);

  // Load more for infinite scroll
  useEffect(() => {
    if (viewMode === "grid" && hasNextPage) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );

      const sentinel = document.getElementById("grid-sentinel");
      if (sentinel) observer.observe(sentinel);

      return () => {
        if (sentinel) observer.unobserve(sentinel);
      };
    }
  }, [viewMode, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-lg text-muted-foreground">
                Loading your subjects...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const enrolledCount = allCourses.filter((c) => c.isEnrolled).length;
  const completedCount = allCourses.filter(
    (c) => c.isEnrolled && c.progress === 100,
  ).length;
  const inProgressCount = allCourses.filter(
    (c) =>
      c.isEnrolled &&
      c.progress !== undefined &&
      c.progress > 0 &&
      c.progress < 100,
  ).length;
  const notStartedCount = allCourses.filter(
    (c) => c.isEnrolled && (c.progress === 0 || c.progress === undefined),
  ).length;
  const availableCount = allCourses.filter((c) => !c.isEnrolled).length;

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
              Learning Hub
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Subjects</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Continue where you stopped, jump into live subjects, and monitor
              your progress across subjects.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "varsecondary"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Layers className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "varsecondary"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-white/70">Enrolled</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {enrolledCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-white/70">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {inProgressCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-white/70">Not Started</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {notStartedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-white/70">Completed</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {completedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-white/70">Available</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {availableCount}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">
              Filter Subjects
            </p>
          </div>

          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by subject name or code..."
              className="h-9 w-full rounded-xl border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "all", label: "All", count: allCourses.length },
              { key: "enrolled", label: "Enrolled", count: enrolledCount },
              {
                key: "in-progress",
                label: "In Progress",
                count: inProgressCount,
              },
              {
                key: "not-started",
                label: "Not Started",
                count: notStartedCount,
              },
              { key: "completed", label: "Completed", count: completedCount },
              { key: "available", label: "Available", count: availableCount },
            ].map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:bg-accent/40"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Display */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-3xl border border-border/70 bg-card p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-base font-medium text-foreground">
            No courses found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or search terms
          </p>
          <Button
            variant="link"
            onClick={() => {
              setStatusFilter("all");
              setSearchTerm("");
            }}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gridCourses.map((course, index) => (
              <motion.div
                key={`${course.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.3),
                }}
                className="group"
              >
                <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {course.shortname}
                      </p>
                      <h3 className="text-base font-semibold text-foreground mt-0.5 line-clamp-1">
                        {course.fullname}
                      </h3>
                    </div>
                    {statusBadge(course.isEnrolled || false, course.progress)}
                  </div>

                  {/* Teacher */}
                  {course.teacher && course.teacher.name !== "Not Assigned" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <User className="h-3.5 w-3.5" />
                      <span>{course.teacher.name}</span>
                    </div>
                  )}

                  {/* Progress */}
                  {course.isEnrolled && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {course.isEnrolled && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="rounded-xl bg-muted/30 p-2 text-center">
                        <p className="text-sm font-bold text-foreground">
                          {course.assignments}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Assignments
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-2 text-center">
                        <p
                          className={`text-sm font-bold ${getGradeColor(course.currentGrade)}`}
                        >
                          {course.currentGrade === "In Progress"
                            ? "--"
                            : course.currentGrade}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Grade
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-2 text-center">
                        <p className="text-sm font-bold text-foreground">
                          {course.materialsCount}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Materials
                        </p>
                      </div>
                    </div>
                  )}

                  {!course.isEnrolled && (
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {parseSummary(course.summary).substring(0, 100)}
                        {course.summary && course.summary.length > 100
                          ? "..."
                          : ""}
                      </p>
                    </div>
                  )}

                  {/* Actions - Equal buttons */}
                  <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2">
                    {course.isEnrolled ? (
                      <>
                        <Link
                          href={course.lmsUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-1"
                        >
                          <Button
                            variant="default"
                            className="w-full gap-1.5 text-xs h-9"
                          >
                            <PlayCircle className="h-3.5 w-3.5" />
                            {course.progress === 100 ? "Review" : "Continue"}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5 text-xs h-9"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 text-xs h-9 col-span-2"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Subject
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Infinite Scroll Sentinel */}
          <div
            id="grid-sentinel"
            className="h-4 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more subjects...
              </div>
            )}
            {!hasNextPage && gridCourses.length > 0 && (
              <p className="text-sm text-muted-foreground py-4">
                Showing all {gridCourses.length} courses
              </p>
            )}
          </div>
        </>
      ) : (
        <div id="list-table">
          <section className="rounded-3xl border border-border/70 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/70 bg-muted/30">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Subject
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Code
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Progress
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Teacher
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-border/70 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-foreground">
                          {course.fullname}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {course.format}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{course.shortname}</Badge>
                      </td>
                      <td className="p-4">
                        {statusBadge(
                          course.isEnrolled || false,
                          course.progress,
                        )}
                      </td>
                      <td className="p-4">
                        {course.isEnrolled ? (
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{course.progress}%</span>
                            </div>
                            <Progress
                              value={course.progress || 0}
                              className="h-1.5"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not enrolled
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {course.teacher?.name !== "Not Assigned"
                            ? course.teacher?.name
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {course.isEnrolled && (
                            <Link
                              href={course.lmsUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="default"
                                className="gap-1.5 text-xs h-8"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                Continue
                              </Button>
                            </Link>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs h-8"
                            onClick={() => setSelectedCourse(course)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-muted/10 rounded-2xl border border-border/70 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {paginatedCourses.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredCourses.length}
                </span>{" "}
                courses
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={cn(
                      "h-8 w-8",
                      currentPage === page &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Go to</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= totalPages) {
                      goToPage(val);
                    }
                  }}
                  className="w-12 h-8 rounded-md border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course Details Drawer - Full Width with ScrollArea at top level */}
      <Drawer
        open={!!selectedCourse}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      >
        <DrawerContent className="w-full font-outfit max-w-full rounded-none border-0 h-[95vh]">
          <ScrollArea className="h-full w-full">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
              {selectedCourse && (
                <>
                  <DrawerHeader className="px-0 border-b border-border/70 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <DrawerTitle className="text-2xl font-bold">
                          {selectedCourse.fullname}
                        </DrawerTitle>
                        <DrawerDescription className="mt-1">
                          {selectedCourse.shortname} • {selectedCourse.format}
                        </DrawerDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        {statusBadge(
                          selectedCourse.isEnrolled || false,
                          selectedCourse.progress,
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCourse(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </DrawerHeader>

                  <div className="py-4">
                    <CourseDetailsContent course={selectedCourse} />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
