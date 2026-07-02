// ─── Grade Domain Types ────────────────────────────────────────────────────

export type GradeStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";
export type ExportFormat = "pdf" | "csv" | "excel";
export type GradesGroupBy = "academic_year" | "semester" | "program";

// ─── Grade Scale ──────────────────────────────────────────────────────────────

export interface GradeScale {
    id: number;
    grade: string;       // "A", "AB", "B", etc.
    minScore: number;
    maxScore: number;
    gradePoint: number;
    description: string;
    color: string;       // Tailwind colour class for UI display
}

// ─── Academic Periods ─────────────────────────────────────────────────────────

export interface AcademicYear {
    id: string;
    label: string;
}

export interface GradeSemester {
    id: string;
    label: string;
    academicYearId: string;
    academicYear: string;
}

export interface GradeProgram {
    id: string;
    name: string;
    code: string;
    departmentName: string;
}

// ─── Grade ────────────────────────────────────────────────────────────────────

export interface Grade {
    id: number;
    studentId: number;
    studentName: string;
    studentMatric: string;
    studentEmail: string;
    programId: string;
    programName: string;
    programCode: string;
    courseId: number;
    courseName: string;
    courseCode: string;
    creditUnits: number;
    semesterId: string;
    semesterName: string;
    academicYearId: string;
    academicYear: string;
    caScore: number | null;
    examScore: number | null;
    totalScore: number | null;
    gradeScaleId: number | null;
    gradeLetter: string | null;
    gradePoint: number | null;
    status: GradeStatus;
    submittedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
    approvedAt?: string;
    remarks?: string;
    hasOutstandingFees: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── CGPA History ─────────────────────────────────────────────────────────────

export interface CgpaHistoryEntry {
    id: number;
    studentId: number;
    semesterId: string;
    semesterName: string;
    academicYear: string;
    gpa: number;
    cgpa: number;
    totalCreditUnits: number;
}

// ─── Student Transcript ───────────────────────────────────────────────────────

export interface StudentTranscript {
    studentId: number;
    studentName: string;
    studentMatric: string;
    studentEmail: string;
    programName: string;
    programCode: string;
    level: string;
    currentCGPA: number;
    totalCreditUnits: number;
    grades: Grade[];
    cgpaHistory: CgpaHistoryEntry[];
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface GradeSummaryStats {
    totalGrades: number;
    publishedCount: number;
    approvedCount: number;
    pendingApprovals: number;
    draftCount: number;
    averageCGPA: number;
    highestCGPA: number;
    passRate: number;
}

export interface GradeDistributionItem {
    grade: string;
    gradePoint: number;
    count: number;
    percentage: number;
    color: string;
}

export interface ProgramPerformance {
    programId: string;
    programName: string;
    programCode: string;
    studentCount: number;
    avgGPA: number;
    passRate: number;
}

export interface CgpaTrendPoint {
    semesterLabel: string;
    avgGPA: number;
    avgCGPA: number;
}

export interface TopPerformer {
    rank: number;
    studentId: number;
    studentName: string;
    studentMatric: string;
    programName: string;
    programCode: string;
    cgpa: number;
}

export interface GradeDashboardData {
    stats: GradeSummaryStats;
    gradeDistribution: GradeDistributionItem[];
    programPerformance: ProgramPerformance[];
    cgpaTrends: CgpaTrendPoint[];
    topPerformers: TopPerformer[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface GradeFilters {
    search: string;
    status: GradeStatus | "all";
    academicYearId: string | "all";
    semesterId: string | "all";
    programId: string | "all";
    gradeLetter: string | "all";
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface GradesPaginationState {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

// ─── Grouped Data ─────────────────────────────────────────────────────────────

export interface GroupedGradeData {
    key: string;
    label: string;
    subLabel?: string;
    gradeCount: number;
    studentCount: number;
    avgGPA: number;
    passRate: number;
    grades: Grade[];
}

// ─── Paginated Response ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    pagination: GradesPaginationState;
}

// ─── Publish Results ──────────────────────────────────────────────────────────

export interface CourseOption {
    id: number;
    name: string;
    code: string;
    creditUnits: number;
    programId: string;
}

export interface PublishSelectionFilters {
    academicYearId: string | null;
    semesterId: string | null;
    programId: string | null;
    courseId: number | null;
}

export interface PublishSummary {
    totalGrades: number;
    publishableCount: number;   // APPROVED grades
    alreadyPublished: number;
    draftCount: number;
    submittedCount: number;
    withheldCount: number;      // students with outstanding fees (not yet published)
    avgScore: number | null;
    passRate: number;
}
