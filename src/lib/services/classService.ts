import { Assessment, Class, ClassStudent, Grade, StudentPerformance } from '@/types';

// Demo data for teacher's classes
const demoClasses: Class[] = [
  {
    id: 1,
    name: 'Junior Secondary School 1A',
    shortName: 'JSS1A',
    level: 'JSS1',
    arm: 'A',
    academicYear: '2024-2025',
    term: '1st',
    teacherId: 1,
    studentCount: 35,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Junior Secondary School 1B',
    shortName: 'JSS1B',
    level: 'JSS1',
    arm: 'B',
    academicYear: '2024-2025',
    term: '1st',
    teacherId: 1,
    studentCount: 32,
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    name: 'Senior Secondary School 2A',
    shortName: 'SSS2A',
    level: 'SSS2',
    arm: 'A',
    academicYear: '2024-2025',
    term: '1st',
    teacherId: 1,
    studentCount: 28,
    createdAt: '2024-01-15'
  },
  {
    id: 4,
    name: 'Junior Secondary School 1A',
    shortName: 'JSS1A',
    level: 'JSS1',
    arm: 'A',
    academicYear: '2023-2024',
    term: '3rd',
    teacherId: 1,
    studentCount: 30,
    createdAt: '2023-09-15'
  },
];

// Demo assessments data
const demoAssessments: Assessment[] = [
  {
    id: 1,
    title: 'Mathematics Quiz 1',
    type: 'quiz',
    classId: 1,
    maxScore: 20,
    dueDate: '2024-02-15',
    createdAt: '2024-02-01',
    status: 'completed'
  },
  {
    id: 2,
    title: 'English Essay Assignment',
    type: 'assignment',
    classId: 1,
    maxScore: 100,
    dueDate: '2024-02-20',
    createdAt: '2024-02-05',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Science Midterm Exam',
    type: 'exam',
    classId: 1,
    maxScore: 100,
    dueDate: '2024-03-01',
    createdAt: '2024-02-25',
    status: 'completed'
  },
];

// Demo grades data
const demoGrades: Grade[] = [
  // Quiz grades
  { id: 1, assessmentId: 1, studentId: 1, score: 18, totalScore: 20, percentage: 90, gradedAt: '2024-02-16' },
  { id: 2, assessmentId: 1, studentId: 2, score: 16, totalScore: 20, percentage: 80, gradedAt: '2024-02-16' },
  { id: 3, assessmentId: 1, studentId: 3, score: 20, totalScore: 20, percentage: 100, gradedAt: '2024-02-16' },
  
  // Assignment grades
  { id: 4, assessmentId: 2, studentId: 1, score: 85, totalScore: 100, percentage: 85, gradedAt: '2024-02-21' },
  { id: 5, assessmentId: 2, studentId: 2, score: 92, totalScore: 100, percentage: 92, gradedAt: '2024-02-21' },
  { id: 6, assessmentId: 2, studentId: 3, score: 78, totalScore: 100, percentage: 78, gradedAt: '2024-02-21' },
  
  // Exam grades
  { id: 7, assessmentId: 3, studentId: 1, score: 88, totalScore: 100, percentage: 88, gradedAt: '2024-03-02' },
  { id: 8, assessmentId: 3, studentId: 2, score: 95, totalScore: 100, percentage: 95, gradedAt: '2024-03-02' },
  { id: 9, assessmentId: 3, studentId: 3, score: 82, totalScore: 100, percentage: 82, gradedAt: '2024-03-02' },
];

// Demo data for class students
const demoClassStudents: ClassStudent[] = [
  // JSS1A 2024-2025 students
  { id: 1, classId: 1, studentId: 1, studentName: 'John Doe', studentEmail: 'john@school.com', studentAvatar: '👦', enrollmentDate: '2024-01-15' },
  { id: 2, classId: 1, studentId: 2, studentName: 'Jane Smith', studentEmail: 'jane@school.com', studentAvatar: '👧', enrollmentDate: '2024-01-15' },
  { id: 3, classId: 1, studentId: 3, studentName: 'Mike Johnson', studentEmail: 'mike@school.com', studentAvatar: '👦', enrollmentDate: '2024-01-15' },
  
  // JSS1B 2024-2025 students
  { id: 4, classId: 2, studentId: 4, studentName: 'Sarah Wilson', studentEmail: 'sarah@school.com', studentAvatar: '👧', enrollmentDate: '2024-01-15' },
  { id: 5, classId: 2, studentId: 5, studentName: 'David Brown', studentEmail: 'david@school.com', studentAvatar: '👦', enrollmentDate: '2024-01-15' },
  
  // SSS2A 2024-2025 students
  { id: 6, classId: 3, studentId: 6, studentName: 'Emma Davis', studentEmail: 'emma@school.com', studentAvatar: '👧', enrollmentDate: '2024-01-15' },
  { id: 7, classId: 3, studentId: 7, studentName: 'James Miller', studentEmail: 'james@school.com', studentAvatar: '👦', enrollmentDate: '2024-01-15' },
];

export const classService = {
  // Get all classes for the current teacher
  getTeacherClasses: async (teacherId: number, filters?: { academicYear?: string; term?: string }): Promise<Class[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredClasses = demoClasses.filter(cls => cls.teacherId === teacherId);
    
    if (filters?.academicYear) {
      filteredClasses = filteredClasses.filter(cls => cls.academicYear === filters.academicYear);
    }
    
    if (filters?.term) {
      filteredClasses = filteredClasses.filter(cls => cls.term === filters.term);
    }
    
    return filteredClasses;
  },

  // Get students for a specific class
  getClassStudents: async (classId: number): Promise<ClassStudent[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return demoClassStudents.filter(student => student.classId === classId);
  },

  // Get available academic years for filter
  getAcademicYears: async (teacherId: number): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const years = demoClasses
      .filter(cls => cls.teacherId === teacherId)
      .map(cls => cls.academicYear);
    
    return Array.from(new Set(years)).sort().reverse();
  },

  // Get students with pagination for infinite scroll
  getClassStudentsPaginated: async (classId: number, page: number, pageSize: number = 10, search?: string): Promise<{
    students: ClassStudent[];
    hasMore: boolean;
    total: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredStudents = demoClassStudents.filter(student => student.classId === classId);
    
    // Apply search filter
    if (search) {
      filteredStudents = filteredStudents.filter(student =>
        student.studentName.toLowerCase().includes(search.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
    
    return {
      students: paginatedStudents,
      hasMore: endIndex < filteredStudents.length,
      total: filteredStudents.length
    };
  },

  // Get assessments for a class
  getClassAssessments: async (classId: number): Promise<Assessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return demoAssessments.filter(assessment => assessment.classId === classId);
  },

  // Get student performance data
  getStudentPerformance: async (classId: number): Promise<StudentPerformance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const classStudents = demoClassStudents.filter(student => student.classId === classId);
    const classGrades = demoGrades.filter(grade => 
      demoAssessments.some(assessment => 
        assessment.id === grade.assessmentId && assessment.classId === classId
      )
    );
    
    return classStudents.map(student => {
      const studentGrades = classGrades.filter(grade => grade.studentId === student.studentId);
      const averageScore = studentGrades.length > 0 
        ? studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length
        : 0;
      
      return {
        studentId: student.studentId,
        studentName: student.studentName,
        studentAvatar: student.studentAvatar,
        averageScore,
        assignmentsCompleted: studentGrades.length,
        totalAssignments: demoAssessments.filter(a => a.classId === classId).length,
        recentGrades: studentGrades.slice(-3) // Last 3 grades
      };
    });
  },

  // Export class data
  exportClassData: async (classId: number, format: 'csv' | 'pdf'): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const classData = demoClasses.find(c => c.id === classId);
    const students = demoClassStudents.filter(s => s.classId === classId);
    const assessments = demoAssessments.filter(a => a.classId === classId);
    
    // Simulate file generation
    const content = format === 'csv' 
      ? generateCSV(classData, students, assessments)
      : 'PDF content would be generated here';
    
    return new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/pdf' 
    });
  },
};

// Helper function to generate CSV
const generateCSV = (classData: any, students: any[], assessments: any[]): string => {
  const headers = ['Student Name', 'Email', 'Enrollment Date', 'Status'];
  const rows = students.map(student => [
    student.studentName,
    student.studentEmail,
    student.enrollmentDate,
    'Active'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');

};