import { Student, Enrollment, StudentGroup } from '@/types';



// Demo data
const demoStudents: Student[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john.doe@school.com', 
    avatar: '/boy.png', 
    enrollmentDate: '2024-01-15' 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane.smith@school.com', 
    avatar: '/girl.png', 
    enrollmentDate: '2024-01-15' 
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    email: 'mike.johnson@school.com', 
    avatar: '/boy.png', 
    enrollmentDate: '2024-01-15' 
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    email: 'sarah.wilson@school.com', 
    avatar: '/images/students/sarah.jpg', 
    enrollmentDate: '2024-01-15' 
  },
  { 
    id: 5, 
    name: 'David Brown', 
    email: 'david.brown@school.com', 
    avatar: '/images/students/david.jpg', 
    enrollmentDate: '2024-01-15' 
  },
];


const demoEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, classId: 1, className: 'JSS1A', subjects: ['Mathematics', 'English', 'Science'], academicYear: '2024-2025', term: '1st', enrollmentDate: '2024-01-15' },
  { id: 2, studentId: 2, classId: 1, className: 'JSS1A', subjects: ['Mathematics', 'English', 'Social Studies', 'Agriculture', 'Basic Science'], academicYear: '2024-2025', term: '1st', enrollmentDate: '2024-01-15' },
  { id: 3, studentId: 3, classId: 1, className: 'JSS1A', subjects: ['Mathematics', 'Science', 'ICT'], academicYear: '2024-2025', term: '1st', enrollmentDate: '2024-01-15' },
  { id: 4, studentId: 4, classId: 2, className: 'JSS1B', subjects: ['English', 'Science', 'Arts'], academicYear: '2024-2025', term: '1st', enrollmentDate: '2024-01-15' },
  { id: 5, studentId: 5, classId: 2, className: 'JSS1B', subjects: ['Mathematics', 'English', 'Science'], academicYear: '2024-2025', term: '1st', enrollmentDate: '2024-01-15' },
  // 2nd term enrollments
  { id: 6, studentId: 1, classId: 1, className: 'JSS1A', subjects: ['Mathematics', 'English', 'Science'], academicYear: '2024-2025', term: '2nd', enrollmentDate: '2024-05-15' },
  { id: 7, studentId: 2, classId: 1, className: 'JSS1A', subjects: ['Mathematics', 'English', 'Social Studies'], academicYear: '2024-2025', term: '2nd', enrollmentDate: '2024-05-15' },
];

const demoGroups: StudentGroup[] = [
  { id: 1, name: 'Science Group', description: 'Students interested in science subjects', classId: 1, className: 'JSS1A', studentIds: [1, 3], createdAt: '2024-01-20', createdBy: 1 },
  { id: 2, name: 'Math Team', description: 'Advanced mathematics students', classId: 1, className: 'JSS1A', studentIds: [2], createdAt: '2024-01-22', createdBy: 1 },
];

export const studentService = {
  // Get all students with their enrollments
  getStudentEnrollments: async (filters?: { academicYear?: string; term?: string; classId?: number }): Promise<{ enrollments: Enrollment[]; students: Student[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEnrollments = demoEnrollments;
    
    if (filters?.academicYear) {
      filteredEnrollments = filteredEnrollments.filter(e => e.academicYear === filters.academicYear);
    }
    
    if (filters?.term) {
      filteredEnrollments = filteredEnrollments.filter(e => e.term === filters.term);
    }
    
    if (filters?.classId) {
      filteredEnrollments = filteredEnrollments.filter(e => e.classId === filters.classId);
    }
    
    const studentIds = [...new Set(filteredEnrollments.map(e => e.studentId))];
    const students = demoStudents.filter(s => studentIds.includes(s.id));
    
    return { enrollments: filteredEnrollments, students };
  },

  // Get groups for a class
  getGroups: async (classId: number): Promise<StudentGroup[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return demoGroups.filter(g => g.classId === classId);
  },

  // Create a new group
  createGroup: async (groupData: Omit<StudentGroup, 'id'>): Promise<StudentGroup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newGroup: StudentGroup = {
      ...groupData,
      id: Math.max(...demoGroups.map(g => g.id), 0) + 1,
    };
    
    demoGroups.push(newGroup);
    return newGroup;
  },

  // Update a group
  updateGroup: async (groupId: number, updates: Partial<StudentGroup>): Promise<StudentGroup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = demoGroups.findIndex(g => g.id === groupId);
    if (index === -1) throw new Error('Group not found');
    
    demoGroups[index] = { ...demoGroups[index], ...updates };
    return demoGroups[index];
  },

  // Delete a group
  deleteGroup: async (groupId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = demoGroups.findIndex(g => g.id === groupId);
    if (index === -1) throw new Error('Group not found');
    
    demoGroups.splice(index, 1);
  },

  // Add student to group
  addStudentToGroup: async (groupId: number, studentId: number): Promise<StudentGroup> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const group = demoGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');
    
    if (!group.studentIds.includes(studentId)) {
      group.studentIds.push(studentId);
    }
    
    return group;
  },

  // Remove student from group
  removeStudentFromGroup: async (groupId: number, studentId: number): Promise<StudentGroup> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const group = demoGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');
    
    group.studentIds = group.studentIds.filter(id => id !== studentId);
    return group;
  },
};