// ─── Grades Mock Service ──────────────────────────────────────────────────────
//
// All methods are wired for live API calls in comments alongside mock data.
// To switch: uncomment the apiClient calls and remove the mock returns.
//
// Live base URL: /api/results
//

import type {
   Grade,
   GradeScale,
   GradeStatus,
   GradeFilters,
   GradesGroupBy,
   GradesPaginationState,
   GroupedGradeData,
   GradeDashboardData,
   StudentTranscript,
   CgpaHistoryEntry,
   AcademicYear,
   GradeSemester,
   GradeProgram,
   GradeDistributionItem,
   CourseOption,
   PublishSelectionFilters,
   PublishSummary,
} from "../../types/grades.types";

function getCurrentAcademicYearLabel(date = new Date()): string {
   const year = date.getFullYear();
   const month = date.getMonth();
   return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

function toAcademicYearId(label: string) {
   return `ay-${label.replace("/", "-")}`;
}

const CURRENT_ACADEMIC_YEAR = getCurrentAcademicYearLabel();
const CURRENT_ACADEMIC_YEAR_ID = toAcademicYearId(CURRENT_ACADEMIC_YEAR);

// ─── Reference Data ───────────────────────────────────────────────────────────

export const GRADE_SCALES: GradeScale[] = [
   { id: 1, grade: "A", minScore: 70, maxScore: 100, gradePoint: 5.00, description: "Excellent", color: "emerald" },
   { id: 2, grade: "AB", minScore: 60, maxScore: 69, gradePoint: 4.00, description: "Very Good", color: "teal" },
   { id: 3, grade: "B", minScore: 50, maxScore: 59, gradePoint: 3.50, description: "Good", color: "blue" },
   { id: 4, grade: "BC", minScore: 45, maxScore: 49, gradePoint: 3.00, description: "Above Average", color: "indigo" },
   { id: 5, grade: "C", minScore: 40, maxScore: 44, gradePoint: 2.50, description: "Average", color: "violet" },
   { id: 6, grade: "CD", minScore: 35, maxScore: 39, gradePoint: 2.00, description: "Below Average", color: "orange" },
   { id: 7, grade: "D", minScore: 30, maxScore: 34, gradePoint: 1.50, description: "Pass", color: "amber" },
   { id: 8, grade: "F", minScore: 0, maxScore: 29, gradePoint: 0.00, description: "Fail", color: "red" },
];

export const ACADEMIC_YEARS: AcademicYear[] = [
   // { id: "ay-2022-2023", label: "2022/2023" },
   { id: "ay-2023-2024", label: "2023/2024" },
   { id: "ay-2024-2025", label: "2024/2025" },
   ...(CURRENT_ACADEMIC_YEAR !== "2024/2025"
      ? [{ id: CURRENT_ACADEMIC_YEAR_ID, label: CURRENT_ACADEMIC_YEAR }]
      : []),
];

export const SEMESTERS: GradeSemester[] = [
   // { id: "sem-1", label: "First Semester", academicYearId: "ay-2022-2023", academicYear: "2022/2023" },
   // { id: "sem-2", label: "Second Semester", academicYearId: "ay-2022-2023", academicYear: "2022/2023" },
   { id: "sem-3", label: "First Semester", academicYearId: "ay-2023-2024", academicYear: "2023/2024" },
   { id: "sem-4", label: "Second Semester", academicYearId: "ay-2023-2024", academicYear: "2023/2024" },
   { id: "sem-5", label: "First Semester", academicYearId: "ay-2024-2025", academicYear: "2024/2025" },
   { id: "sem-6", label: "Second Semester", academicYearId: "ay-2024-2025", academicYear: "2024/2025" },
   ...(CURRENT_ACADEMIC_YEAR !== "2024/2025"
      ? [
           { id: "sem-7", label: "First Semester", academicYearId: CURRENT_ACADEMIC_YEAR_ID, academicYear: CURRENT_ACADEMIC_YEAR },
           { id: "sem-8", label: "Second Semester", academicYearId: CURRENT_ACADEMIC_YEAR_ID, academicYear: CURRENT_ACADEMIC_YEAR },
        ]
      : []),
];

export const PROGRAMS: GradeProgram[] = [
   { id: "csc", name: "Computer Science", code: "CSC", departmentName: "Department of Computer Science" },
   { id: "eee", name: "Electrical & Electronics Eng.", code: "EEE", departmentName: "Department of Electrical Engineering" },
   { id: "bus", name: "Business Administration", code: "BUS", departmentName: "Faculty of Management Sciences" },
   { id: "mee", name: "Mechanical Engineering", code: "MEE", departmentName: "Department of Mechanical Engineering" },
];

// ─── Course data per program ───────────────────────────────────────────────────

export const COURSES: CourseOption[] = [
   // CSC
   { id: 1, name: "Data Structures & Algorithms", code: "CSC301", creditUnits: 3, programId: "csc" },
   { id: 2, name: "Operating Systems", code: "CSC303", creditUnits: 3, programId: "csc" },
   { id: 3, name: "Computer Organisation", code: "CSC305", creditUnits: 2, programId: "csc" },
   { id: 4, name: "Database Management Systems", code: "CSC302", creditUnits: 3, programId: "csc" },
   { id: 5, name: "Software Engineering", code: "CSC304", creditUnits: 3, programId: "csc" },
   // EEE
   { id: 6, name: "Circuit Theory", code: "EEE301", creditUnits: 3, programId: "eee" },
   { id: 7, name: "Electrical Machines I", code: "EEE303", creditUnits: 3, programId: "eee" },
   { id: 8, name: "Electronic Devices", code: "EEE305", creditUnits: 2, programId: "eee" },
   { id: 9, name: "Power Systems", code: "EEE302", creditUnits: 3, programId: "eee" },
   { id: 10, name: "Control Systems", code: "EEE304", creditUnits: 3, programId: "eee" },
   // BUS
   { id: 11, name: "Business Law", code: "BUS301", creditUnits: 3, programId: "bus" },
   { id: 12, name: "Marketing Management", code: "BUS303", creditUnits: 3, programId: "bus" },
   { id: 13, name: "Cost Accounting", code: "ACC301", creditUnits: 3, programId: "bus" },
   { id: 14, name: "Financial Management", code: "BUS302", creditUnits: 3, programId: "bus" },
   { id: 15, name: "Human Resource Management", code: "BUS304", creditUnits: 3, programId: "bus" },
   // MEE
   { id: 16, name: "Mechanics of Materials", code: "MEE301", creditUnits: 3, programId: "mee" },
   { id: 17, name: "Engineering Thermodynamics", code: "MEE303", creditUnits: 3, programId: "mee" },
   { id: 18, name: "Fluid Mechanics", code: "MEE305", creditUnits: 3, programId: "mee" },
   { id: 19, name: "Machine Design I", code: "MEE302", creditUnits: 3, programId: "mee" },
   { id: 20, name: "Heat Transfer", code: "MEE304", creditUnits: 3, programId: "mee" },
];

// ─── Students ─────────────────────────────────────────────────────────────────

interface StudentEntry { id: number; name: string; matric: string; email: string; programId: string; }

const STUDENTS: StudentEntry[] = [
   // CSC
   { id: 1, name: "Adebayo Emmanuel Olorunfemi", matric: "CSC/21/001", email: "adebayo.e@qhub.edu.ng", programId: "csc" },
   { id: 2, name: "Okafor Chidinma Blessing", matric: "CSC/21/002", email: "okafor.c@qhub.edu.ng", programId: "csc" },
   { id: 3, name: "Ibrahim Abubakar Suleiman", matric: "CSC/21/003", email: "ibrahim.a@qhub.edu.ng", programId: "csc" },
   { id: 4, name: "Nwosu Chiamaka Peace", matric: "CSC/21/004", email: "nwosu.c@qhub.edu.ng", programId: "csc" },
   { id: 5, name: "Adeleke Segun Emmanuel", matric: "CSC/21/005", email: "adeleke.s@qhub.edu.ng", programId: "csc" },
   // EEE
   { id: 6, name: "Bello Ahmed Kamaru", matric: "EEE/21/001", email: "bello.a@qhub.edu.ng", programId: "eee" },
   { id: 7, name: "Lawal Aminat Tolulope", matric: "EEE/21/002", email: "lawal.a@qhub.edu.ng", programId: "eee" },
   { id: 8, name: "Eze Chukwuemeka Uche", matric: "EEE/21/003", email: "eze.c@qhub.edu.ng", programId: "eee" },
   { id: 9, name: "Yusuf Halima Sani", matric: "EEE/21/004", email: "yusuf.h@qhub.edu.ng", programId: "eee" },
   { id: 10, name: "Okonkwo Emeka Prince", matric: "EEE/21/005", email: "okonkwo.e@qhub.edu.ng", programId: "eee" },
   // BUS
   { id: 11, name: "Afolabi Toyin Omolara", matric: "BUS/21/001", email: "afolabi.t@qhub.edu.ng", programId: "bus" },
   { id: 12, name: "Musa Fatima Aliyu", matric: "BUS/21/002", email: "musa.f@qhub.edu.ng", programId: "bus" },
   { id: 13, name: "Akande Rotimi Akin", matric: "BUS/21/003", email: "akande.r@qhub.edu.ng", programId: "bus" },
   { id: 14, name: "Ogundele Nike Sunday", matric: "BUS/21/004", email: "ogundele.n@qhub.edu.ng", programId: "bus" },
   { id: 15, name: "Diallo Fatou Mariam", matric: "BUS/21/005", email: "diallo.f@qhub.edu.ng", programId: "bus" },
   // MEE
   { id: 16, name: "Olawale Biodun Tunde", matric: "MEE/21/001", email: "olawale.b@qhub.edu.ng", programId: "mee" },
   { id: 17, name: "Chukwu Obinna Kalu", matric: "MEE/21/002", email: "chukwu.o@qhub.edu.ng", programId: "mee" },
   { id: 18, name: "Yakubu Hauwa Mohammed", matric: "MEE/21/003", email: "yakubu.h@qhub.edu.ng", programId: "mee" },
   { id: 19, name: "Aina Temidayo Blessing", matric: "MEE/21/004", email: "aina.t@qhub.edu.ng", programId: "mee" },
   { id: 20, name: "Ekong Etini Promise", matric: "MEE/21/005", email: "ekong.e@qhub.edu.ng", programId: "mee" },
];

// ─── Grade scale assignment ───────────────────────────────────────────────────

function assignScale(totalScore: number): GradeScale | undefined {
   return GRADE_SCALES.find((s) => totalScore >= s.minScore && totalScore <= s.maxScore);
}

// ─── Deterministic status assignment based on semester ────────────────────────

function gradeStatus(gradeId: number, semId: string): GradeStatus {
   if (semId === "sem-1" || semId === "sem-2" || semId === "sem-3") return "PUBLISHED";
   if (semId === "sem-4") {
      return (gradeId * 7) % 10 < 7 ? "PUBLISHED" : "APPROVED";
   }
   // sem-5 (2024/2025 First) — mostly approved/published
   if (semId === "sem-5") {
      const r = (gradeId * 11) % 10;
      return r < 5 ? "PUBLISHED" : r < 8 ? "APPROVED" : "SUBMITTED";
   }
   // sem-6 (2024/2025 Second) — current semester, mixed
   const r = (gradeId * 13) % 10;
   return r < 2 ? "PUBLISHED" : r < 5 ? "APPROVED" : r < 8 ? "SUBMITTED" : "DRAFT";
}

// ─── Generate mock grades ─────────────────────────────────────────────────────

// Courses assigned per semester for each program (alternating sets)
const PROGRAM_COURSES: Record<string, number[][]> = {
   csc: [[1, 2, 3], [4, 5, 1]], // courses for semesters 1,3,5 vs 2,4,6
   eee: [[6, 7, 8], [9, 10, 6]],
   bus: [[11, 12, 13], [14, 15, 11]],
   mee: [[16, 17, 18], [19, 20, 16]],
};

function buildMockGrades(): Grade[] {
   const result: Grade[] = [];
   let id = 1;

   for (const sem of SEMESTERS) {
      const semIdx = parseInt(sem.id.split("-")[1]) - 1; // 0-based
      const courseSetIdx = semIdx % 2; // alternates 0/1

      for (const student of STUDENTS) {
         const program = PROGRAMS.find((p) => p.id === student.programId)!;
         const courseIds = PROGRAM_COURSES[student.programId][courseSetIdx];

         for (const courseId of courseIds) {
            const course = COURSES.find((c) => c.id === courseId)!;
            const s = (student.id * 31 + courseId * 17 + semIdx * 7) % 100;
            const caScore = 10 + (s % 31);                      // 10–40
            const examScore = 15 + ((s * 3 + 7) % 46);           // 15–60
            const totalScore = caScore + examScore;
            const scale = assignScale(totalScore);
            const status = gradeStatus(id, sem.id);

            result.push({
               id,
               studentId: student.id,
               studentName: student.name,
               studentMatric: student.matric,
               studentEmail: student.email,
               programId: program.id,
               programName: program.name,
               programCode: program.code,
               courseId: course.id,
               courseName: course.name,
               courseCode: course.code,
               creditUnits: course.creditUnits,
               semesterId: sem.id,
               semesterName: sem.label,
               academicYearId: sem.academicYearId,
               academicYear: sem.academicYear,
               caScore,
               examScore,
               totalScore,
               gradeScaleId: scale?.id ?? null,
               gradeLetter: scale?.grade ?? null,
               gradePoint: scale?.gradePoint ?? null,
               status,
               approvedByName: status === "APPROVED" || status === "PUBLISHED" ? "Dr. Adewale Oladele" : undefined,
               approvedAt: status === "APPROVED" || status === "PUBLISHED" ? "2025-01-15T09:30:00Z" : undefined,
               hasOutstandingFees: student.id % 4 === 0,
               createdAt: "2024-10-01T08:00:00Z",
               updatedAt: "2025-01-15T09:30:00Z",
            });
            id++;
         }
      }
   }

   return result;
}

export const MOCK_GRADES: Grade[] = buildMockGrades();

// ─── CGPA history builder ─────────────────────────────────────────────────────

function buildCgpaHistory(): CgpaHistoryEntry[] {
   const entries: CgpaHistoryEntry[] = [];
   let id = 1;

   for (const student of STUDENTS) {
      let cumWeightedPoints = 0;
      let cumCreditUnits = 0;

      for (const sem of SEMESTERS) {
         const semIdx = parseInt(sem.id.split("-")[1]) - 1;
         const courseSetIdx = semIdx % 2;
         const courseIds = PROGRAM_COURSES[student.programId][courseSetIdx];

         const grades = MOCK_GRADES.filter(
            (g) => g.studentId === student.id && g.semesterId === sem.id
         );

         if (grades.length === 0) continue;

         let semWeightedPoints = 0;
         let semCreditUnits = 0;
         for (const g of grades) {
            if (g.gradePoint !== null && g.creditUnits) {
               semWeightedPoints += g.gradePoint * g.creditUnits;
               semCreditUnits += g.creditUnits;
            }
         }
         if (semCreditUnits === 0) continue;

         const gpa = Math.round((semWeightedPoints / semCreditUnits) * 100) / 100;
         cumWeightedPoints += semWeightedPoints;
         cumCreditUnits += semCreditUnits;
         const cgpa = Math.round((cumWeightedPoints / cumCreditUnits) * 100) / 100;

         void courseIds; // suppress unused variable warning
         entries.push({ id: id++, studentId: student.id, semesterId: sem.id, semesterName: sem.label, academicYear: sem.academicYear, gpa, cgpa, totalCreditUnits: semCreditUnits });
      }
   }

   return entries;
}

const MOCK_CGPA_HISTORY: CgpaHistoryEntry[] = buildCgpaHistory();

// ─── Dashboard aggregation ────────────────────────────────────────────────────

function buildDashboardData(): GradeDashboardData {
   const total = MOCK_GRADES.length;
   const published = MOCK_GRADES.filter((g) => g.status === "PUBLISHED").length;
   const approved = MOCK_GRADES.filter((g) => g.status === "APPROVED").length;
   const submitted = MOCK_GRADES.filter((g) => g.status === "SUBMITTED").length;
   const draft = MOCK_GRADES.filter((g) => g.status === "DRAFT").length;
   const passing = MOCK_GRADES.filter((g) => g.gradePoint !== null && g.gradePoint > 0).length;

   // Avg CGPA from last history entry per student
   const latestCgpa = STUDENTS.map((s) => {
      const hist = MOCK_CGPA_HISTORY.filter((h) => h.studentId === s.id);
      return hist.length ? hist[hist.length - 1].cgpa : 0;
   });
   const avgCGPA = latestCgpa.length
      ? Math.round((latestCgpa.reduce((a, b) => a + b, 0) / latestCgpa.length) * 100) / 100
      : 0;
   const highestCGPA = latestCgpa.length ? Math.max(...latestCgpa) : 0;

   // Grade distribution
   const gradeCountMap: Record<string, number> = {};
   for (const g of MOCK_GRADES) {
      if (g.gradeLetter) {
         gradeCountMap[g.gradeLetter] = (gradeCountMap[g.gradeLetter] ?? 0) + 1;
      }
   }
   const DIST_COLORS: Record<string, string> = {
      A: "#10b981", AB: "#14b8a6", B: "#3b82f6", BC: "#6366f1",
      C: "#8b5cf6", CD: "#f97316", D: "#f59e0b", F: "#ef4444",
   };
   const gradeDistribution: GradeDistributionItem[] = GRADE_SCALES.map((scale) => ({
      grade: scale.grade,
      gradePoint: scale.gradePoint,
      count: gradeCountMap[scale.grade] ?? 0,
      percentage: total ? Math.round(((gradeCountMap[scale.grade] ?? 0) / total) * 1000) / 10 : 0,
      color: DIST_COLORS[scale.grade] ?? "#94a3b8",
   }));

   // Program performance
   const programPerformance = PROGRAMS.map((p) => {
      const programGrades = MOCK_GRADES.filter((g) => g.programId === p.id && g.gradePoint !== null);
      const students = new Set(programGrades.map((g) => g.studentId)).size;
      const wSum = programGrades.reduce((a, g) => a + (g.gradePoint ?? 0) * g.creditUnits, 0);
      const cuSum = programGrades.reduce((a, g) => a + g.creditUnits, 0);
      const avgGPA = cuSum ? Math.round((wSum / cuSum) * 100) / 100 : 0;
      const pass = programGrades.filter((g) => (g.gradePoint ?? 0) > 0).length;
      const passRate = programGrades.length ? Math.round((pass / programGrades.length) * 1000) / 10 : 0;
      return { programId: p.id, programName: p.name, programCode: p.code, studentCount: students, avgGPA, passRate };
   });

   // CGPA trends
   const cgpaTrends = SEMESTERS.map((sem) => {
      const semGrades = MOCK_GRADES.filter((g) => g.semesterId === sem.id && g.gradePoint !== null);
      const wSum = semGrades.reduce((a, g) => a + (g.gradePoint ?? 0) * g.creditUnits, 0);
      const cuSum = semGrades.reduce((a, g) => a + g.creditUnits, 0);
      const avgGPA = cuSum ? Math.round((wSum / cuSum) * 100) / 100 : 0;
      const semIdx = parseInt(sem.id.split("-")[1]) - 1;
      const prevTrend = semIdx > 0 ? null : null;
      void prevTrend;
      const allPrevGrades = MOCK_GRADES.filter(
         (g) => parseInt(g.semesterId.split("-")[1]) <= semIdx + 1 && g.gradePoint !== null
      );
      const cpWSum = allPrevGrades.reduce((a, g) => a + (g.gradePoint ?? 0) * g.creditUnits, 0);
      const cpCuSum = allPrevGrades.reduce((a, g) => a + g.creditUnits, 0);
      const avgCGPA = cpCuSum ? Math.round((cpWSum / cpCuSum) * 100) / 100 : 0;
      return { semesterLabel: `${sem.academicYear} ${sem.label.replace(" Semester", "")}`, avgGPA, avgCGPA };
   });

   // Top performers
   const topPerformers = STUDENTS.map((s) => {
      const hist = MOCK_CGPA_HISTORY.filter((h) => h.studentId === s.id);
      const cgpa = hist.length ? hist[hist.length - 1].cgpa : 0;
      const prog = PROGRAMS.find((p) => p.id === s.programId)!;
      return { rank: 0, studentId: s.id, studentName: s.name, studentMatric: s.matric, programName: prog.name, programCode: prog.code, cgpa };
   }).sort((a, b) => b.cgpa - a.cgpa).map((p, i) => ({ ...p, rank: i + 1 })).slice(0, 10);

   return {
      stats: { totalGrades: total, publishedCount: published, approvedCount: approved, pendingApprovals: submitted, draftCount: draft, averageCGPA: avgCGPA, highestCGPA: Math.round(highestCGPA * 100) / 100, passRate: total ? Math.round((passing / total) * 1000) / 10 : 0 },
      gradeDistribution,
      programPerformance,
      cgpaTrends,
      topPerformers,
   };
}

// ─── Service ──────────────────────────────────────────────────────────────────

class GradesService {
   private delay(ms = 250): Promise<void> {
      return new Promise((res) => setTimeout(res, ms));
   }

   // ── Grade Scales ────────────────────────────────────────────────────────────

   async getGradeScales(): Promise<GradeScale[]> {
      await this.delay();
      // LIVE: return apiClient.get<GradeScale[]>("/results/grade-scales");
      return GRADE_SCALES;
   }

   // ── Dashboard Data ──────────────────────────────────────────────────────────

   async getDashboardData(): Promise<GradeDashboardData> {
      await this.delay(300);
      // LIVE: return apiClient.get<GradeDashboardData>("/results/dashboard");
      return buildDashboardData();
   }

   // ── Grades (filtered + paginated) ───────────────────────────────────────────

   async getGrades(
      filters: GradeFilters,
      page: number,
      pageSize: number
   ): Promise<ReturnType<typeof buildPaginatedGrades>> {
      await this.delay();
      // LIVE: return apiClient.get<PaginatedResponse<Grade>>("/results/grades", { params: { ...filters, page, pageSize } });
      return buildPaginatedGrades(filters, page, pageSize);
   }

   // ── Grouped Grades ──────────────────────────────────────────────────────────

   async getGroupedGrades(groupBy: GradesGroupBy, filters: GradeFilters): Promise<GroupedGradeData[]> {
      await this.delay(200);
      // LIVE: return apiClient.get<GroupedGradeData[]>("/results/grades/grouped", { params: { groupBy, ...filters } });
      return buildGroupedGrades(groupBy, filters);
   }

   // ── Student Transcript ──────────────────────────────────────────────────────

   async getStudentTranscript(studentId: number) {
      await this.delay();
      // LIVE: return apiClient.get<StudentTranscript>(`/results/grades/student/${studentId}`);
      return buildTranscript(studentId);
   }

   // ── Grade Actions ────────────────────────────────────────────────────────────

   async submitGrade(id: number): Promise<Grade> {
      await this.delay();
      // LIVE: return apiClient.patch<Grade>(`/results/grades/${id}/submit`);
      const grade = MOCK_GRADES.find((g) => g.id === id);
      if (!grade) throw new Error("Grade not found");
      grade.status = "SUBMITTED";
      grade.submittedAt = new Date().toISOString();
      return { ...grade };
   }

   async approveGrade(id: number): Promise<Grade> {
      await this.delay();
      // LIVE: return apiClient.patch<Grade>(`/results/grades/${id}/approve`);
      const grade = MOCK_GRADES.find((g) => g.id === id);
      if (!grade) throw new Error("Grade not found");
      grade.status = "APPROVED";
      grade.approvedByName = "Dr. Adewale Oladele";
      grade.approvedAt = new Date().toISOString();
      return { ...grade };
   }

   async rejectGrade(id: number, remarks: string): Promise<Grade> {
      await this.delay();
      // LIVE: return apiClient.patch<Grade>(`/results/grades/${id}/reject`, { remarks });
      const grade = MOCK_GRADES.find((g) => g.id === id);
      if (!grade) throw new Error("Grade not found");
      grade.status = "DRAFT";
      grade.remarks = remarks;
      return { ...grade };
   }

   // ── Export ───────────────────────────────────────────────────────────────────

   exportToCSV(grades: Grade[]): string {
      const header = ["ID", "Student", "Matric", "Program", "Course", "Semester", "CA Score", "Exam Score", "Total", "Grade", "Grade Point", "Status"].join(",");
      const rows = grades.map((g) =>
         [g.id, `"${g.studentName}"`, g.studentMatric, `"${g.programName}"`, `"${g.courseName}"`, `"${g.semesterName} ${g.academicYear}"`, g.caScore ?? "", g.examScore ?? "", g.totalScore ?? "", g.gradeLetter ?? "", g.gradePoint ?? "", g.status].join(",")
      );
      return [header, ...rows].join("\n");
   }

   exportToPDF(grades: Grade[]): void {
      // LIVE: Use jsPDF or server-side PDF generation
      const win = window.open("", "_blank");
      if (!win) return;
      const rows = grades.map((g) => `<tr><td>${g.studentName}</td><td>${g.studentMatric}</td><td>${g.courseName}</td><td>${g.totalScore ?? "-"}</td><td>${g.gradeLetter ?? "-"}</td><td>${g.gradePoint ?? "-"}</td><td>${g.status}</td></tr>`).join("");
      win.document.write(`<!DOCTYPE html><html><head><title>Grades Report</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}th{background:#f0f0f0}h1{margin-bottom:16px}</style></head><body><h1>Grades Report — QHub Portal</h1><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>Student</th><th>Matric</th><th>Course</th><th>Total</th><th>Grade</th><th>Points</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
      win.document.close();
      win.print();
   }

   // ── Publish: get courses for a program ──────────────────────────────────────

   async getCoursesByProgram(programId: string): Promise<CourseOption[]> {
      await this.delay(150);
      // LIVE: return apiClient.get<CourseOption[]>(`/results/programs/${programId}/courses`);
      return COURSES.filter((c) => c.programId === programId);
   }

   // ── Publish: load grades for a course+semester ──────────────────────────────

   async getGradesForPublish(filters: PublishSelectionFilters): Promise<Grade[]> {
      await this.delay(300);
      // LIVE: return apiClient.get<Grade[]>("/results/grades/publish-preview", { params: filters });
      return MOCK_GRADES.filter((g) => {
         if (filters.academicYearId && g.academicYearId !== filters.academicYearId) return false;
         if (filters.semesterId && g.semesterId !== filters.semesterId) return false;
         if (filters.programId && g.programId !== filters.programId) return false;
         if (filters.courseId !== null && g.courseId !== filters.courseId) return false;
         return true;
      });
   }

   // ── Publish: compute summary stats for a grade set ──────────────────────────

   buildPublishSummary(grades: Grade[]): PublishSummary {
      const publishable = grades.filter((g) => g.status === "APPROVED");
      const alreadyPublished = grades.filter((g) => g.status === "PUBLISHED").length;
      const scored = grades.filter((g) => g.totalScore !== null);
      const avgScore = scored.length
         ? Math.round((scored.reduce((a, g) => a + (g.totalScore ?? 0), 0) / scored.length) * 10) / 10
         : null;
      const passing = grades.filter((g) => (g.gradePoint ?? 0) > 0).length;
      return {
         totalGrades: grades.length,
         publishableCount: publishable.length,
         alreadyPublished,
         draftCount: grades.filter((g) => g.status === "DRAFT").length,
         submittedCount: grades.filter((g) => g.status === "SUBMITTED").length,
         withheldCount: grades.filter((g) => g.hasOutstandingFees && g.status !== "PUBLISHED").length,
         avgScore,
         passRate: grades.length ? Math.round((passing / grades.length) * 1000) / 10 : 0,
      };
   }

   // ── Publish: publish specific grade IDs ────────────────────────────────────

   async publishGrades(gradeIds: number[]): Promise<Grade[]> {
      await this.delay(600);
      // LIVE: return apiClient.patch<Grade[]>("/results/grades/publish", { gradeIds });
      const updated: Grade[] = [];
      for (const id of gradeIds) {
         const grade = MOCK_GRADES.find((g) => g.id === id);
         if (grade && grade.status !== "PUBLISHED") {
            grade.status = "PUBLISHED";
            grade.updatedAt = new Date().toISOString();
            updated.push({ ...grade });
         }
      }
      return updated;
   }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function applyFilters(grades: Grade[], filters: GradeFilters): Grade[] {
   return grades.filter((g) => {
      if (filters.search) {
         const q = filters.search.toLowerCase();
         if (!g.studentName.toLowerCase().includes(q) && !g.studentMatric.toLowerCase().includes(q) && !g.courseCode.toLowerCase().includes(q)) return false;
      }
      if (filters.status !== "all" && g.status !== filters.status) return false;
      if (filters.academicYearId !== "all" && g.academicYearId !== filters.academicYearId) return false;
      if (filters.semesterId !== "all" && g.semesterId !== filters.semesterId) return false;
      if (filters.programId !== "all" && g.programId !== filters.programId) return false;
      if (filters.gradeLetter !== "all" && g.gradeLetter !== filters.gradeLetter) return false;
      return true;
   });
}

function buildPaginatedGrades(filters: GradeFilters, page: number, pageSize: number) {
   const filtered = applyFilters(MOCK_GRADES, filters);
   const total = filtered.length;
   const totalPages = Math.ceil(total / pageSize);
   const data = filtered.slice((page - 1) * pageSize, page * pageSize);
   const pagination: GradesPaginationState = { page, pageSize, total, totalPages };
   return { data, pagination };
}

function buildGroupedGrades(groupBy: GradesGroupBy, filters: GradeFilters): GroupedGradeData[] {
   const filtered = applyFilters(MOCK_GRADES, filters);
   const map = new Map<string, Grade[]>();

   for (const g of filtered) {
      const key = groupBy === "academic_year" ? g.academicYearId
         : groupBy === "semester" ? `${g.academicYearId}::${g.semesterId}`
            : g.programId;
      const arr = map.get(key) ?? [];
      arr.push(g);
      map.set(key, arr);
   }

   return Array.from(map.entries()).map(([key, grades]) => {
      const g0 = grades[0];
      const label = groupBy === "academic_year" ? g0.academicYear
         : groupBy === "semester" ? g0.semesterName
            : g0.programName;
      const subLabel = groupBy === "semester" ? g0.academicYear
         : groupBy === "program" ? g0.programCode
            : undefined;
      const students = new Set(grades.map((g) => g.studentId)).size;
      const withPoints = grades.filter((g) => g.gradePoint !== null);
      const wSum = withPoints.reduce((a, g) => a + (g.gradePoint ?? 0) * g.creditUnits, 0);
      const cuSum = withPoints.reduce((a, g) => a + g.creditUnits, 0);
      const avgGPA = cuSum ? Math.round((wSum / cuSum) * 100) / 100 : 0;
      const pass = withPoints.filter((g) => (g.gradePoint ?? 0) > 0).length;
      const passRate = withPoints.length ? Math.round((pass / withPoints.length) * 1000) / 10 : 0;
      return { key, label, subLabel, gradeCount: grades.length, studentCount: students, avgGPA, passRate, grades };
   });
}

function buildTranscript(studentId: number): StudentTranscript {
   const student = STUDENTS.find((s) => s.id === studentId);
   if (!student) throw new Error("Student not found");
   const program = PROGRAMS.find((p) => p.id === student.programId)!;
   const grades = MOCK_GRADES.filter((g) => g.studentId === studentId);
   const cgpaHistory = MOCK_CGPA_HISTORY.filter((h) => h.studentId === studentId);
   const currentCGPA = cgpaHistory.length ? cgpaHistory[cgpaHistory.length - 1].cgpa : 0;
   const totalCreditUnits = cgpaHistory.length ? cgpaHistory.reduce((a, h) => a + h.totalCreditUnits, 0) : 0;
   return { studentId, studentName: student.name, studentMatric: student.matric, studentEmail: student.email, programName: program.name, programCode: program.code, level: "300 Level", currentCGPA, totalCreditUnits, grades, cgpaHistory };
}

export const gradesService = new GradesService();
