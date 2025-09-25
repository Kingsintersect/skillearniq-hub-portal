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

export interface Class {
  id: number;
  name: string;
  level: string; // JSS1, JSS2, etc.
  arm: string; // A, B, C
  subjects: Subject[];
}

export interface Subject {
  id: number;
  name: string;
  teacherId: number;
  classId: number;
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

export interface Grade {
  id: number;
  studentId: number;
  assignmentId: number;
  score: number;
  feedback?: string;
  gradedBy: number;
  gradedAt: string;
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

export interface Student {
  id: number;
  name: string;
  email: string;
  classId: number;
  parentId?: number;
  avatar?: string;
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