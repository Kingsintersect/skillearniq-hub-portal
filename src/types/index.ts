import { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Program {
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
}

export interface CampusHighlights {
  title: string;
  imageUrl: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}


export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  avatar?: string;
}




export interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  classId: number;
  dueDate: string;
  maxScore: number;
  type: 'quiz' | 'assignment' | 'exam';
  status: 'draft' | 'published' | 'completed';
  createdAt: string;
}



export interface LiveClass {
  id: number;
  subjectId: number;
  teacherId: number;
  classId: number;
  startTime: string;
  endTime: string;
  zoomLink?: string;
  recordingUrl?: string;
  title: string;
  description?: string;
}



export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  recordedBy: number;
}


export interface Exam {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  classId: number;
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  maxScore: number;
  requiresWebcam: boolean;
  ipRestriction: boolean;
  status: 'draft' | 'published' | 'completed';
  questions?: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'essay' | 'true_false';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface ExamSession {
  id: number;
  examId: number;
  studentId: number;
  startTime: string;
  endTime?: string;
  answers: Answer[];
  status: 'in_progress' | 'completed' | 'terminated';
}

export interface Answer {
  questionId: number;
  answer: string;
  submittedAt: string;
}

export interface Class {
  id: number;
  name: string;
  shortName: string;
  level: string;
  arm: string;
  term: '1st' | '2nd' | '3rd';
  teacherId: number;
  studentCount: number;
  createdAt: string;
}



export interface Class {
  id: number;
  name: string;
  shortName: string;
  level: string;
  arm: string;
  term: '1st' | '2nd' | '3rd';
  teacherId: number;
  studentCount: number;
  createdAt: string;
}

export interface ClassStudent {
  id: number;
  classId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  enrollmentDate: string;
}

export interface Assessment {
  id: number;
  title: string;
  type: 'quiz' | 'assignment' | 'exam';
  classId: number;
  maxScore: number;
  dueDate: string;
  createdAt: string;
  status: 'draft' | 'published' | 'completed';
}

export interface Grade {
  id: number;
  assessmentId: number;
  studentId: number;
  score: number;
  totalScore: number;
  percentage: number;
  gradedAt: string;
  feedback?: string;
}

export interface StudentPerformance {
  studentId: number;
  studentName: string;
  studentAvatar: string;
  averageScore: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  recentGrades: Grade[];
}


// export interface Student {
//   id: number;
//   name: string;
//   email: string;
//   avatar: string;
//   enrollmentDate: string;
// }

export interface Enrollment {
  id: number;
  studentId: number;
  classId: number;
  className: string;
  subjects: string[];
  term: '1st' | '2nd' | '3rd';
  enrollmentDate: string;
}

export interface StudentGroup {
  id: number;
  name: string;
  description?: string;
  classId: number;
  className: string;
  studentIds: number[];
  createdAt: string;
  createdBy: number; // teacher ID
}

// Update your existing types to match API responses
export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  phone: string;
  role: string;
  is_active: number;
  email_verified: number;
  phone_verified: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  meta: any;
  // Frontend computed properties
  name?: string;
  teacherId?: string;
  subjects?: string[];
  classes?: string[];
  status?: 'active' | 'inactive';
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  phone: string;
  role: string;
  is_active: number;
  email_verified: number;
  phone_verified: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  meta: any;
  // Frontend computed properties
  name?: string;
  studentId?: string;
  class?: string;
  gender?: string;
  parentName?: string;
  status?: 'active' | 'suspended';
}