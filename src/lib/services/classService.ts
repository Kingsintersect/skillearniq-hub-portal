import { apiClient } from "./client";
import { Class, Subject } from "@/types";

export const classService = {
  // Class management
  getClasses: async (): Promise<Class[]> => {
    // TODO: Replace with actual API call
    return Promise.resolve(dummyClasses);
  },

  createClass: async (classData: Omit<Class, 'id'>): Promise<Class> => {
  const response = await apiClient.post<Class>('/classes', classData);
  return response.data;
},


  // Subject management
  getSubjects: async (classId?: number): Promise<Subject[]> => {
    // TODO: Replace with actual API call
    return Promise.resolve(dummySubjects.filter(s => !classId || s.classId === classId));
  },

  // Timetable management
  getTimetable: async (classId: number) => {
    const response = await apiClient.get(`/timetable/class/${classId}`);
    return response.data;
  },
};

// Dummy data for development
const dummyClasses: Class[] = [
  { id: 1, name: 'JSS1A', level: 'JSS1', arm: 'A', subjects: [] },
  { id: 2, name: 'JSS1B', level: 'JSS1', arm: 'B', subjects: [] },
  { id: 3, name: 'JSS2A', level: 'JSS2', arm: 'A', subjects: [] },
   { id: 4, name: 'JSS3A', level: 'JSS1', arm: 'A', subjects: [] },
  { id: 5, name: 'SS1B', level: 'JSS1', arm: 'B', subjects: [] },
  { id: 6, name: 'JSS2A', level: 'JSS2', arm: 'A', subjects: [] },
];

const dummySubjects: Subject[] = [
  { id: 1, name: 'Mathematics', teacherId: 1, classId: 1 },
  { id: 2, name: 'English', teacherId: 2, classId: 1 },
];