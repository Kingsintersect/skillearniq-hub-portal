// types/student-grades.ts
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface StudentGradeData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  assignment: number;
  quiz: number;
  exam: number;
  total: number;
  grade: Grade;
}

export interface StudentCourseInfo {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url: string;
  instructors: Array<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }>;
}

export interface StudentEnrolledCourse {
  id: string;
  name: string;
  course_code?: string;
  shortname?: string;
  category: string;
  summary?: string;
}

export interface StudentGradeStore {
  // State
  courses: StudentEnrolledCourse[];
  selectedCourse: string;
  gradeData: StudentGradeData[];
  isLoading: boolean;
  error: string | null;
  courseInfo: StudentCourseInfo | null;

  // Actions
  fetchCourses: () => Promise<void>;
  setSelectedCourse: (course: string) => void;
  setGradeData: (data: StudentGradeData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGradeData: () => Promise<void>;
  resetState: () => void;
  getLetterGrade: (percentage: number) => Grade;
}