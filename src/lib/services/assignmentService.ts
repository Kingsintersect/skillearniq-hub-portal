import { apiClient } from "./client";
import { Assignment, Grade } from "@/types";

export const assignmentService = {
  getAssignments: async (filters?: { classId?: number; subjectId?: number; teacherId?: number }): Promise<Assignment[]> => {
    // TODO: Replace with actual API call
    const filtered = dummyAssignments.filter(a => 
      (!filters?.classId || a.classId === filters.classId) &&
      (!filters?.subjectId || a.subjectId === filters.subjectId) &&
      (!filters?.teacherId || true) // Teacher filter logic
    );
    return Promise.resolve(filtered);
  },

  getAssignment: async (id: number): Promise<Assignment> => {
    const assignment = dummyAssignments.find(a => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    return Promise.resolve(assignment);
  },

  createAssignment: async (assignment: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Math.max(...dummyAssignments.map(a => a.id)) + 1,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    dummyAssignments.push(newAssignment);
    return Promise.resolve(newAssignment);
  },

  updateAssignment: async (id: number, updates: Partial<Assignment>): Promise<Assignment> => {
    const index = dummyAssignments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Assignment not found');
    dummyAssignments[index] = { ...dummyAssignments[index], ...updates };
    return Promise.resolve(dummyAssignments[index]);
  },

  getGrades: async (assignmentId: number): Promise<Grade[]> => {
    return Promise.resolve(dummyGrades.filter(g => g.assignmentId === assignmentId));
  },

  submitGrade: async (grade: Omit<Grade, 'id' | 'gradedAt'>): Promise<Grade> => {
    const newGrade: Grade = {
      ...grade,
      id: Math.max(...dummyGrades.map(g => g.id), 0) + 1,
      gradedAt: new Date().toISOString()
    };
    dummyGrades.push(newGrade);
    return Promise.resolve(newGrade);
  },

  bulkUploadGrades: async (assignmentId: number, grades: File): Promise<Grade[]> => {
    // Simulate Excel upload processing
    console.log('Processing grades file:', grades.name);
    return Promise.resolve([]);
  }
};

const dummyAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Algebra Basics Assignment',
    description: 'Complete exercises 1-10 from chapter 3',
    subjectId: 1,
    classId: 1,
    dueDate: '2024-01-20T23:59:00',
    maxScore: 100,
    type: 'assignment',
    status: 'published',
    createdAt: '2024-01-10T10:00:00'
  },
  {
    id: 2,
    title: 'English Comprehension Quiz',
    description: 'Read the passage and answer questions',
    subjectId: 2,
    classId: 1,
    dueDate: '2024-01-18T15:00:00',
    maxScore: 50,
    type: 'quiz',
    status: 'published',
    createdAt: '2024-01-09T14:30:00'
  }
];

const dummyGrades: Grade[] = [
  {
    id: 1,
    studentId: 1,
    assignmentId: 1,
    score: 85,
    feedback: 'Good work, but show your calculations',
    gradedBy: 2,
    gradedAt: '2024-01-16T10:00:00'
  }
];