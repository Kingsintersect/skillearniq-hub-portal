import { apiClient } from "./client";
import { Answer, Exam, ExamSession, Question } from "@/types";

export const examService = {
  getExams: async (classId?: number): Promise<Exam[]> => {
    // TODO: Replace with actual API call
    const filtered = dummyExams.filter(e => !classId || e.classId === classId);
    return Promise.resolve(filtered);
  },

  getExam: async (id: number): Promise<Exam> => {
    const exam = dummyExams.find(e => e.id === id);
    if (!exam) throw new Error('Exam not found');
    return Promise.resolve(exam);
  },

  createExam: async (exam: Omit<Exam, 'id'>): Promise<Exam> => {
    const newExam: Exam = {
      ...exam,
      id: Math.max(...dummyExams.map(e => e.id)) + 1,
      status: 'draft'
    };
    dummyExams.push(newExam);
    return Promise.resolve(newExam);
  },

  startExam: async (examId: number): Promise<ExamSession> => {
    // Simulate starting an exam session
    const session: ExamSession = {
      id: Math.random(),
      examId,
      studentId: 1, // From auth
      startTime: new Date().toISOString(),
      answers: [],
      status: 'in_progress'
    };
    return Promise.resolve(session);
  },

  submitAnswer: async (sessionId: number, answer: Omit<Answer, 'submittedAt'>) => {
    // Simulate answer submission
    console.log('Submitting answer:', answer);
    return Promise.resolve();
  },

  completeExam: async (sessionId: number) => {
    // Simulate exam completion
    return Promise.resolve();
  },
};

const dummyExams: Exam[] = [
  {
    id: 1,
    title: 'Mathematics Final Examination',
    description: 'Comprehensive exam covering all topics from the term',
    subjectId: 1,
    classId: 1,
    duration: 120,
    startTime: '2024-02-01T09:00:00',
    endTime: '2024-02-01T11:00:00',
    maxScore: 100,
    requiresWebcam: true,
    ipRestriction: true,
    status: 'published',
    questions: [
      {
        id: 1,
        text: 'Solve the quadratic equation: x² - 5x + 6 = 0',
        type: 'multiple_choice',
        options: ['x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = -1, -6'],
        correctAnswer: 'x = 2, 3',
        points: 10
      }
    ]
  },
  {
    id: 2,
    title: 'English Language Proficiency Test',
    description: 'Grammar and comprehension assessment',
    subjectId: 2,
    classId: 1,
    duration: 90,
    startTime: '2024-02-05T10:00:00',
    endTime: '2024-02-05T11:30:00',
    maxScore: 100,
    requiresWebcam: false,
    ipRestriction: true,
    status: 'draft'
  }
];