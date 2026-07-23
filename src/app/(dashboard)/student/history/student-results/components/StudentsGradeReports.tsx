'use client';

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Award, BarChart3, Calendar, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentTranscript } from "@/hooks/use-grades-data";
import { useStudentStore } from "@/store/studentStore";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Types
interface ReportCourse {
   id: string;
   courseCode: string;
   courseTitle: string;
   creditLoad: number;
   score: number;
   grade: string;
   gradePoint: number;
   qualityPoints: number;
   semesterName: string;
   academicYear: string;
   status: string;
}

interface ReportStudentInfo {
   fullName: string;
   regNumber: string;
   program: string;
   level: string;
   department: string;
   email: string;
   avatarUrl: string | null;
}

interface ReportGradeDistributionItem {
   grade: string;
   label: string;
   colorClass: string;
   textClass: string;
   count: number;
   percentage: number;
}

interface ReportSummary {
   gpa: number;
   totalCredits: number;
   totalQualityPoints: number;
   degreeClass: string;
   academicStanding: {
      text: string;
      color: string;
      bgColor: string;
   };
   gradeDistribution: ReportGradeDistributionItem[];
}

// Utility functions
const GRADE_META = [
   { grade: "A", label: "Excellent (70-100%)", colorClass: "bg-emerald-500", textClass: "text-emerald-600" },
   { grade: "AB", label: "Very Good (60-69%)", colorClass: "bg-teal-500", textClass: "text-teal-600" },
   { grade: "B", label: "Good (50-59%)", colorClass: "bg-blue-500", textClass: "text-blue-600" },
   { grade: "BC", label: "Above Average (45-49%)", colorClass: "bg-indigo-500", textClass: "text-indigo-600" },
   { grade: "C", label: "Average (40-44%)", colorClass: "bg-violet-500", textClass: "text-violet-600" },
   { grade: "CD", label: "Below Average (35-39%)", colorClass: "bg-orange-500", textClass: "text-orange-600" },
   { grade: "D", label: "Pass (30-34%)", colorClass: "bg-amber-500", textClass: "text-amber-600" },
   { grade: "F", label: "Fail (0-29%)", colorClass: "bg-red-500", textClass: "text-red-600" },
];

function getAcademicStanding(gpa: number) {
   if (gpa >= 4.5) {
      return { text: "First Class", color: "text-emerald-700", bgColor: "bg-emerald-500" };
   }
   if (gpa >= 3.5) {
      return { text: "Second Class Upper", color: "text-blue-700", bgColor: "bg-blue-500" };
   }
   if (gpa >= 2.4) {
      return { text: "Second Class Lower", color: "text-violet-700", bgColor: "bg-violet-500" };
   }
   if (gpa >= 1.5) {
      return { text: "Third Class", color: "text-amber-700", bgColor: "bg-amber-500" };
   }
   if (gpa >= 1.0) {
      return { text: "Pass", color: "text-slate-700", bgColor: "bg-slate-500" };
   }
   return { text: "Fail", color: "text-red-700", bgColor: "bg-red-500" };
}

function getDegreeClass(gpa: number) {
   if (gpa >= 4.5) return "First Class";
   if (gpa >= 3.5) return "Second Class Upper";
   if (gpa >= 2.4) return "Second Class Lower";
   if (gpa >= 1.5) return "Third Class";
   if (gpa >= 1.0) return "Pass";
   return "Fail";
}

function formatSemesterLabel(semesterName: string) {
   return semesterName.endsWith("Semester") ? semesterName : `${semesterName} Semester`;
}

function toReportCourses(grades: any[]): ReportCourse[] {
   return [...grades]
      .sort((a, b) => a.courseCode.localeCompare(b.courseCode))
      .map((grade) => ({
         id: String(grade.id),
         courseCode: grade.courseCode,
         courseTitle: grade.courseName,
         creditLoad: grade.creditUnits,
         score: grade.totalScore ?? 0,
         grade: grade.gradeLetter ?? "F",
         gradePoint: grade.gradePoint ?? 0,
         qualityPoints: (grade.gradePoint ?? 0) * grade.creditUnits,
         semesterName: grade.semesterName,
         academicYear: grade.academicYear,
         status: grade.status,
      }));
}

function calculateReportSummary(courses: ReportCourse[]): ReportSummary {
   const totalCredits = courses.reduce((sum, course) => sum + course.creditLoad, 0);
   const totalQualityPoints = courses.reduce((sum, course) => sum + course.qualityPoints, 0);
   const gpa = totalCredits > 0 ? Number((totalQualityPoints / totalCredits).toFixed(2)) : 0;

   const gradeDistribution = GRADE_META.map((meta) => {
      const count = courses.filter((course) => course.grade.toUpperCase() === meta.grade).length;
      const percentage = courses.length > 0 ? Math.round((count / courses.length) * 100) : 0;
      return { ...meta, count, percentage };
   });

   return {
      gpa,
      totalCredits,
      totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
      degreeClass: getDegreeClass(gpa),
      academicStanding: getAcademicStanding(gpa),
      gradeDistribution,
   };
}

function buildReportStudentInfo(transcript: any, user: any): ReportStudentInfo {
   return {
      fullName: user?.name ?? transcript.studentName,
      regNumber: user?.matricNo ?? transcript.studentMatric,
      program: transcript.programName,
      level: user?.level ?? transcript.level,
      department: user?.department ?? transcript.programName,
      email: user?.email ?? transcript.studentEmail,
      avatarUrl: user?.avatar ?? null,
   };
}

function getCurrentAcademicYearLabel(date = new Date()) {
   const year = date.getFullYear();
   const month = date.getMonth();
   return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

// Helper for className merging
function cn(...classes: (string | undefined | boolean | null)[]) {
   return classes.filter(Boolean).join(' ');
}

// Components
function InfoItem({ label, value }: { label: string; value: string }) {
   return (
      <div>
         <p className="text-sm font-bold text-teal-700 dark:text-teal-400">{label}:</p>
         <p className="text-sm text-slate-700 dark:text-slate-300">{value}</p>
      </div>
   );
}

function StudentHeader({ semester, academicYear, summary }: { semester: string; academicYear: string; summary: ReportSummary }) {
   return (
      <div className="rounded-t-3xl bg-gradient-to-br from-primary/20 via-background to-amber-500/10 p-6">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
               <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Official Result Slip</p>
               <h1 className="mt-1 text-2xl font-bold text-foreground">Student Grade Report</h1>
               <p className="mt-1 text-sm text-muted-foreground">
                  {formatSemesterLabel(semester)} · {academicYear}
               </p>
               <p className="text-xs text-muted-foreground">5.00 grading system</p>
            </div>

            <div className="rounded-2xl bg-primary/10 p-4 text-right backdrop-blur-sm">
               <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Current GPA</p>
               <p className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{summary.gpa.toFixed(2)}</p>
               <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{summary.degreeClass}</p>
               <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Total Credits (TCU): {summary.totalCredits}</p>
                  <p>Total Quality Points (TQP): {summary.totalQualityPoints.toFixed(2)}</p>
               </div>
            </div>
         </div>
      </div>
   );
}

function StudentInfoSection({ student }: { student: ReportStudentInfo }) {
   const initials = student.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

   return (
      <div className="border-b border-border px-6 py-6">
         <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex w-full flex-col items-center gap-3 md:w-52">
               <Avatar className="h-24 w-24 border-4 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                     {initials || "ST"}
                  </AvatarFallback>
               </Avatar>
               <h2 className="text-center text-lg font-bold uppercase tracking-wide text-primary">
                  {student.fullName}
               </h2>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
               <InfoItem label="Reg Number" value={student.regNumber} />
               <InfoItem label="Program" value={student.program} />
               <InfoItem label="Email" value={student.email} />
               <InfoItem label="Level" value={student.level} />
               <InfoItem label="Department" value={student.department} />
            </div>
         </div>
      </div>
   );
}

function CourseTable({ courses }: { courses: ReportCourse[] }) {
   return (
      <div className="px-6 py-6">
         <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Course Performance Details</h3>
         </div>

         <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
               <thead className="bg-muted/30">
                  <tr>
                     {["Course Code", "Course Name", "CU", "Score (%)", "Grade", "GP", "QP"].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                           {heading}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-border bg-card">
                  {courses.map((course) => (
                     <tr key={course.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-4 font-semibold text-foreground">{course.courseCode}</td>
                        <td className="px-4 py-4 text-foreground">{course.courseTitle}</td>
                        <td className="px-4 py-4 text-center font-medium text-foreground">{course.creditLoad}</td>
                        <td className="px-4 py-4 text-center font-medium text-foreground">{course.score.toFixed(0)}%</td>
                        <td className="px-4 py-4 text-center">
                           <Badge variant="outline" className="font-semibold">
                              {course.grade}
                           </Badge>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-foreground">{course.gradePoint.toFixed(2)}</td>
                        <td className="px-4 py-4 text-center font-semibold text-primary">{course.qualityPoints.toFixed(2)}</td>
                     </tr>
                  ))}
                  <tr className="bg-primary/5 font-semibold">
                     <td colSpan={2} className="px-4 py-4 text-right text-foreground">
                        <div className="flex items-center justify-end gap-2">
                           <Award className="h-4 w-4" />
                           <span>Totals:</span>
                        </div>
                     </td>
                     <td className="px-4 py-4 text-center text-primary">
                        {courses.reduce((sum, course) => sum + course.creditLoad, 0)}
                     </td>
                     <td className="px-4 py-4 text-center text-muted-foreground">-</td>
                     <td className="px-4 py-4 text-center text-muted-foreground">-</td>
                     <td className="px-4 py-4 text-center text-muted-foreground">-</td>
                     <td className="px-4 py-4 text-center text-primary">
                        {courses.reduce((sum, course) => sum + course.qualityPoints, 0).toFixed(2)}
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

         <div className="mt-4 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground">
            <p><strong>Formula:</strong> GPA = Total Quality Points (TQP) / Total Credit Units (TCU)</p>
            <p className="mt-1"><strong>Quality Points:</strong> Grade Point × Credit Units for each course.</p>
         </div>
      </div>
   );
}

function GradeDistribution({ summary }: { summary: ReportSummary }) {
   const maxCount = Math.max(...summary.gradeDistribution.map((item) => item.count), 1);

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-primary" />
               Grade Distribution Analysis
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="space-y-3">
               {summary.gradeDistribution.map((item) => (
                  <div key={item.grade}>
                     <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="w-8 text-center font-bold text-foreground">{item.grade}</span>
                           <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className={cn("text-sm font-medium", item.textClass)}>
                           {item.count} ({item.percentage}%)
                        </span>
                     </div>
                     <div className="h-2 w-full rounded-full bg-muted">
                        <div
                           className={cn("h-2 rounded-full transition-all duration-500", item.colorClass)}
                           style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
               <div className="flex justify-between">
                  <span>Total Subjects:</span>
                  <span className="font-medium text-foreground">
                     {summary.gradeDistribution.reduce((sum, item) => sum + item.count, 0)}
                  </span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

function AcademicStanding({ summary }: { summary: ReportSummary }) {
   const progressPercentage = Math.min((summary.gpa / 5) * 100, 100);

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-amber-600" />
               Academic Performance
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               <div className="rounded-2xl bg-muted/30 p-4 text-center">
                  <div className="text-3xl font-bold text-foreground">{summary.gpa.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Current GPA</div>
                  <Badge className={cn("mt-2", summary.academicStanding.bgColor)}>
                     {summary.degreeClass}
                  </Badge>
               </div>

               <div>
                  <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                     <span>Progress on 5.00 Scale</span>
                     <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                     <span>0.00</span>
                     <span>2.50</span>
                     <span>5.00</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between gap-2">
                     <span className="text-emerald-600">4.50-5.00:</span>
                     <span>First Class</span>
                  </div>
                  <div className="flex justify-between gap-2">
                     <span className="text-amber-600">1.50-2.39:</span>
                     <span>Third Class</span>
                  </div>
                  <div className="flex justify-between gap-2">
                     <span className="text-blue-600">3.50-4.49:</span>
                     <span>2nd Class Upper</span>
                  </div>
                  <div className="flex justify-between gap-2">
                     <span className="text-slate-600">1.00-1.49:</span>
                     <span>Pass</span>
                  </div>
                  <div className="flex justify-between gap-2">
                     <span className="text-violet-600">2.40-3.49:</span>
                     <span>2nd Class Lower</span>
                  </div>
                  <div className="flex justify-between gap-2">
                     <span className="text-red-600">Below 1.00:</span>
                     <span>Fail</span>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

function ReportFooter({ semester, academicYear }: { semester: string; academicYear: string; institutionName: string }) {
   return (
      <div className="rounded-b-3xl border-t border-border bg-muted/30 px-6 py-6">
         <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center justify-center gap-2">
               <FileText className="h-4 w-4 text-muted-foreground" />
               <h4 className="text-sm font-medium text-foreground">Official Grade Report</h4>
            </div>

            <div className="space-y-2 text-center">
               <p className="text-sm text-muted-foreground">
                  This is an official academic transcript for <strong>{formatSemesterLabel(semester)}</strong> of the <strong>{academicYear}</strong> academic session.
               </p>
               <p className="text-sm text-muted-foreground">Computed using the Nigerian University 5.00 Grade Point System.</p>

               <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                     <Calendar className="h-3 w-3" />
                     <span>
                        Generated: {new Date().toLocaleDateString("en-NG", {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </span>
                  </div>
                  <span>•</span>
                  <span>System: 5.00 Scale</span>
                  <span>•</span>
                  <span>Official Document</span>
               </div>
            </div>
         </div>
      </div>
   );
}

// Main Page Component
export default function StudentGradeReportsPage() {
   const user = useStudentStore((state) => state.studentStats);
   const { selectedCategory, setSelectedCategory } = useStudentStore();
   const { transcript, loading } = useStudentTranscript(1);
   const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
   const [selectedSemesterId, setSelectedSemesterId] = useState("");
   const currentAcademicYear = useMemo(() => getCurrentAcademicYearLabel(), []);

   const semesterOptions = useMemo(() => {
      if (!transcript) return [];

      return Array.from(
         new Map(
            transcript.grades.map((grade) => [
               `${grade.academicYear}::${grade.semesterId}`,
               {
                  academicYear: grade.academicYear,
                  semesterId: grade.semesterId,
                  semesterName: grade.semesterName,
               },
            ])
         ).values()
      );
   }, [transcript]).sort((left, right) => {
      if (left.academicYear === right.academicYear) {
         return left.semesterName.localeCompare(right.semesterName);
      }
      return right.academicYear.localeCompare(left.academicYear);
   });

   const academicYearOptions = useMemo(() => {
      return Array.from(new Set([currentAcademicYear, ...semesterOptions.map((option) => option.academicYear)])).sort((left, right) =>
         right.localeCompare(left)
      );
   }, [currentAcademicYear, semesterOptions]);

   const filteredOptions = useMemo(() => {
      if (!selectedAcademicYear) return semesterOptions;
      return semesterOptions.filter((option) => option.academicYear === selectedAcademicYear);
   }, [semesterOptions, selectedAcademicYear]);

   useEffect(() => {
      if (!selectedAcademicYear && academicYearOptions.includes(currentAcademicYear)) {
         setSelectedAcademicYear(currentAcademicYear);
      }
   }, [academicYearOptions, currentAcademicYear, selectedAcademicYear]);

   const filteredGrades = useMemo(() => {
      if (!transcript) return [];
      return transcript.grades.filter((grade) => {
         if (grade.status !== "PUBLISHED") return false;
         const matchesYear = !selectedAcademicYear || grade.academicYear === selectedAcademicYear;
         const matchesSemester = !selectedSemesterId || grade.semesterId === selectedSemesterId;
         return matchesYear && matchesSemester;
      });
   }, [transcript, selectedAcademicYear, selectedSemesterId]);

   const reportCourses = useMemo(() => toReportCourses(filteredGrades), [filteredGrades]);
   const reportSummary = useMemo(() => calculateReportSummary(reportCourses), [reportCourses]);
   const studentInfo = useMemo(() => {
      if (!transcript) return null;
      return buildReportStudentInfo(transcript, user);
   }, [transcript, user]);

   const selectedSemester = filteredOptions.find((option) => option.semesterId === selectedSemesterId) ?? null;

   if (loading) {
      return (
         <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
               <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <div className="text-lg text-muted-foreground">Loading grade reports...</div>
               </div>
            </div>
         </div>
      );
   }

   if (!transcript || !studentInfo) {
      return (
         <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
               <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg text-foreground">No grade data available</div>
                  <p className="text-sm text-muted-foreground mt-2">Your transcript information could not be loaded.</p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6 p-4 md:p-6">
         {/* Hero Section */}
         <section className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-amber-500/10 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Result History</p>
                  <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Grade Reports</h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                     Review your published semester results, breakdown by course, and export your official grade report.
                  </p>
               </div>
            </div>

            {/* Statistics Cards */}
            {selectedAcademicYear && selectedSemester && reportCourses.length > 0 && (
               <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                     <p className="text-xs text-muted-foreground">GPA</p>
                     <p className="mt-1 text-2xl font-bold text-foreground">{reportSummary.gpa.toFixed(2)}</p>
                     <p className="text-xs text-muted-foreground mt-1">Grade Point Average</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                     <p className="text-xs text-muted-foreground">Total Credits</p>
                     <p className="mt-1 text-2xl font-bold text-foreground">{reportSummary.totalCredits}</p>
                     <p className="text-xs text-muted-foreground mt-1">Credit Units</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                     <p className="text-xs text-muted-foreground">Degree Class</p>
                     <p className="mt-1 text-sm font-semibold text-foreground">{reportSummary.degreeClass}</p>
                     <p className="text-xs text-muted-foreground mt-1">Current Standing</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                     <p className="text-xs text-muted-foreground">Subjects Taken</p>
                     <p className="mt-1 text-2xl font-bold text-foreground">{reportCourses.length}</p>
                     <p className="text-xs text-muted-foreground mt-1">This Semester</p>
                  </div>
               </div>
            )}

            {/* Filters */}
            <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
               <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Academic Year</p>
                  <Select
                     value={selectedAcademicYear}
                     onValueChange={(value) => {
                        setSelectedAcademicYear(value);
                        setSelectedSemesterId("");
                     }}
                  >
                     <SelectTrigger className="w-full justify-between bg-background/80">
                        <SelectValue placeholder="Select academic year" />
                     </SelectTrigger>
                     <SelectContent>
                        {academicYearOptions.map((year) => (
                           <SelectItem key={year} value={year}>
                              {year}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Semester</p>
                  <Tabs value={selectedSemesterId} onValueChange={setSelectedSemesterId} className="w-full">
                     <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-background/70 p-2">
                        {filteredOptions.length > 0 ? (
                           filteredOptions.map((option) => (
                              <TabsTrigger
                                 key={`${option.academicYear}-${option.semesterId}`}
                                 value={option.semesterId}
                                 className="rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                              >
                                 {formatSemesterLabel(option.semesterName)}
                              </TabsTrigger>
                           ))
                        ) : (
                           <div className="px-3 py-2 text-sm text-muted-foreground">
                              Select an academic year to see available semesters.
                           </div>
                        )}
                     </TabsList>
                  </Tabs>
               </div>
            </div>
         </section>

         {/* Empty State - No Selection */}
         {(!selectedAcademicYear || !selectedSemesterId) && (
            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-border bg-card/70 p-8 text-center text-muted-foreground">
               <div>
                  <FileText size={34} className="mx-auto mb-3 opacity-50" />
                  <p className="text-base font-medium text-foreground">Select an academic year and semester</p>
                  <p className="mt-2 text-sm">Your published results will appear here once both filters are set.</p>
               </div>
            </div>
         )}

         {/* No Results State */}
         {selectedAcademicYear && selectedSemesterId && reportCourses.length === 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800">
               <div className="flex items-center gap-3">
                  <Award className="h-6 w-6" />
                  <div>
                     <p className="font-semibold">No Published Results</p>
                     <p className="text-sm">
                        No published results were found for {selectedAcademicYear} {selectedSemester ? `(${formatSemesterLabel(selectedSemester.semesterName)})` : ""}.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* Results Display */}
         {selectedAcademicYear && selectedSemester && reportCourses.length > 0 && (
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
               <StudentHeader
                  semester={selectedSemester.semesterName}
                  academicYear={selectedAcademicYear}
                  summary={reportSummary}
               />
               <StudentInfoSection student={studentInfo} />
               <CourseTable courses={reportCourses} />

               <div className="bg-muted/30 px-6 py-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Summary</h3>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                     <GradeDistribution summary={reportSummary} />
                     <AcademicStanding summary={reportSummary} />
                  </div>
               </div>

               <ReportFooter
                  semester={selectedSemester.semesterName}
                  academicYear={selectedAcademicYear}
                  institutionName="University"
               />
            </div>
         )}
      </div>
   );
}