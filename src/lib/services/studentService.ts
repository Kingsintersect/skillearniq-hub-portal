import { apiClient } from "./client";
import { Student, Attendance } from "@/types";

export const studentService = {
  getStudents: async (classId?: number): Promise<Student[]> => {
    const filtered = dummyStudents.filter(s => !classId || s.classId === classId);
    return Promise.resolve(filtered);
  },

  getStudent: async (id: number): Promise<Student> => {
    const student = dummyStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return Promise.resolve(student);
  },

  getAttendance: async (studentId: number, startDate?: string, endDate?: string): Promise<Attendance[]> => {
    return Promise.resolve(dummyAttendance.filter(a => a.studentId === studentId));
  },

  bulkImportStudents: async (classId: number, file: File): Promise<Student[]> => {
    console.log('Importing students for class', classId, 'from file:', file.name);
    return Promise.resolve([]);
  }
};

const dummyStudents: Student[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@school.com', classId: 1, avatar: '👦' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@school.com', classId: 1, avatar: '👧' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@school.com', classId: 2, avatar: '👦' }
];

const dummyAttendance: Attendance[] = [
  { id: 1, studentId: 1, classId: 1, date: '2024-01-15', status: 'present', recordedBy: 2 },
  { id: 2, studentId: 2, classId: 1, date: '2024-01-15', status: 'present', recordedBy: 2 }
];