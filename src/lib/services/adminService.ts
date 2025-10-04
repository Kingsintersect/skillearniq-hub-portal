import { ApiResponse, PaginationParams } from '@/types/auth';

// Types for admin data
export interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  gender: string;
  dateOfBirth: string;
  parentName: string;
  status: 'active' | 'suspended';
  email: string;
  phone: string;
}

export interface Teacher {
  id: number;
  name: string;
  teacherId: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: 'active' | 'inactive';
}

export interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  children: string[];
  status: 'active' | 'inactive';
}

export interface Payment {
  id: number;
  student: string;
  class: string;
  paymentFor: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  method: string;
  reference: string;
}

export interface Report {
  student: string;
  studentId: string;
  class: string;
  subjects: SubjectResult[];
  overallAverage: number;
  position: number;
  attendance: number;
}

export interface SubjectResult {
  name: string;
  test: number;
  quiz: number;
  exam: number;
  total: number;
  average: number;
  grade: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  activeClasses: number;
  attendanceRate: number;
  feeCollection: number;
  academicYear: string;
}

export interface MessageData {
  recipientType: string;
  specificRecipients: string[];
  subject: string;
  content: string;
}

// Dummy data
const dummyStudents: Student[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    studentId: 'STU2025001',
    class: 'JSS 2A',
    gender: 'Male',
    dateOfBirth: '2010-05-15',
    parentName: 'Mr. & Mrs. Johnson',
    status: 'active',
    email: 'alex.j@school.edu',
    phone: '+1234567890'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    studentId: 'STU2025002',
    class: 'JSS 1B',
    gender: 'Female',
    dateOfBirth: '2011-08-22',
    parentName: 'Mr. & Mrs. Johnson',
    status: 'active',
    email: 'sarah.j@school.edu',
    phone: '+1234567891'
  }
];

const dummyTeachers: Teacher[] = [
  {
    id: 1,
    name: 'Mr. Smith',
    teacherId: 'TCH2025001',
    email: 'smith@school.edu',
    phone: '+1234567890',
    subjects: ['Mathematics', 'Physics'],
    classes: ['JSS 2A', 'JSS 3A'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Mrs. Johnson',
    teacherId: 'TCH2025002',
    email: 'johnson@school.edu',
    phone: '+1234567891',
    subjects: ['English', 'Literature'],
    classes: ['JSS 1A', 'JSS 2B'],
    status: 'active'
  }
];

const dummyParents: Parent[] = [
  {
    id: 1,
    name: 'Mr. & Mrs. Johnson',
    email: 'johnsons@email.com',
    phone: '+1234567890',
    children: ['Alex Johnson', 'Sarah Johnson'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Mr. & Mrs. Smith',
    email: 'smiths@email.com',
    phone: '+1234567891',
    children: ['Michael Smith'],
    status: 'active'
  }
];

const dummyPayments: Payment[] = [
  {
    id: 1,
    student: 'Alex Johnson',
    class: 'JSS 2A',
    paymentFor: 'Term 1 Tuition Fee',
    amount: 250000,
    date: '2025-01-15',
    dueDate: '2025-01-31',
    status: 'paid',
    method: 'Bank Transfer',
    reference: 'REF2025001'
  },
  {
    id: 2,
    student: 'Sarah Johnson',
    class: 'JSS 1B',
    paymentFor: 'Term 1 Tuition Fee',
    amount: 250000,
    date: '2025-01-15',
    dueDate: '2025-01-31',
    status: 'paid',
    method: 'Bank Transfer',
    reference: 'REF2025002'
  }
];

const dummyReports: Report[] = [
  {
    student: 'Alex Johnson',
    studentId: 'STU2025001',
    class: 'JSS 2A',
    subjects: [
      { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, grade: 'A' },
      { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, grade: 'B+' }
    ],
    overallAverage: 88.5,
    position: 5,
    attendance: 95
  }
];

// Service functions with dummy data
export const adminService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalStudents: 1247,
      totalTeachers: 48,
      totalParents: 893,
      activeClasses: 36,
      attendanceRate: 94.2,
      feeCollection: 82,
      academicYear: '2025-2026'
    };
  },

  // Students
  getStudents: async (params?: PaginationParams & { search?: string; class?: string; status?: string }): Promise<ApiResponse<Student[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredStudents = [...dummyStudents];
    
    if (params?.search) {
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        student.studentId.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.class && params.class !== 'all') {
      filteredStudents = filteredStudents.filter(student => student.class === params.class);
    }
    
    if (params?.status && params.status !== 'all') {
      filteredStudents = filteredStudents.filter(student => student.status === params.status);
    }

    return {
      status: 200,
      data: filteredStudents,
      message: 'Students fetched successfully',
      meta: {
        pagination: {
          total: filteredStudents.length,
          perPage: params?.perPage || 10,
          currentPage: params?.page || 1,
          lastPage: Math.ceil(filteredStudents.length / (params?.perPage || 10))
        }
      }
    };
  },

  createStudent: async (student: Omit<Student, 'id' | 'status'>): Promise<ApiResponse<Student>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStudent: Student = {
      ...student,
      id: Math.max(...dummyStudents.map(s => s.id)) + 1,
      status: 'active'
    };
    
    dummyStudents.push(newStudent);
    
    return {
      status: 201,
      data: newStudent,
      message: 'Student created successfully'
    };
  },

  updateStudentStatus: async (studentId: number, status: 'active' | 'suspended'): Promise<ApiResponse<Student>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const studentIndex = dummyStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }
    
    dummyStudents[studentIndex].status = status;
    
    return {
      status: 200,
      data: dummyStudents[studentIndex],
      message: 'Student status updated successfully'
    };
  },

  deleteStudent: async (studentId: number): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const studentIndex = dummyStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }
    
    dummyStudents.splice(studentIndex, 1);
    
    return {
      status: 200,
      data: undefined,
      message: 'Student deleted successfully'
    };
  },

  // Teachers
  getTeachers: async (params?: PaginationParams & { search?: string; subject?: string; status?: string }): Promise<ApiResponse<Teacher[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTeachers = [...dummyTeachers];
    
    if (params?.search) {
      filteredTeachers = filteredTeachers.filter(teacher => 
        teacher.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        teacher.teacherId.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.subject && params.subject !== 'all') {
      filteredTeachers = filteredTeachers.filter(teacher => 
        teacher.subjects.includes(params.subject!)
      );
    }
    
    if (params?.status && params.status !== 'all') {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.status === params.status);
    }

    return {
      status: 200,
      data: filteredTeachers,
      message: 'Teachers fetched successfully'
    };
  },

  createTeacher: async (teacher: Omit<Teacher, 'id' | 'status'>): Promise<ApiResponse<Teacher>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTeacher: Teacher = {
      ...teacher,
      id: Math.max(...dummyTeachers.map(t => t.id)) + 1,
      status: 'active'
    };
    
    dummyTeachers.push(newTeacher);
    
    return {
      status: 201,
      data: newTeacher,
      message: 'Teacher created successfully'
    };
  },

  assignTeacher: async (teacherId: number, className: string, subjects: string[]): Promise<ApiResponse<Teacher>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const teacherIndex = dummyTeachers.findIndex(t => t.id === teacherId);
    if (teacherIndex === -1) {
      throw new Error('Teacher not found');
    }
    
    const teacher = dummyTeachers[teacherIndex];
    teacher.classes = [...new Set([...teacher.classes, className])];
    teacher.subjects = [...new Set([...teacher.subjects, ...subjects])];
    
    return {
      status: 200,
      data: teacher,
      message: 'Teacher assigned successfully'
    };
  },

  deleteTeacher: async (teacherId: number): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const teacherIndex = dummyTeachers.findIndex(t => t.id === teacherId);
    if (teacherIndex === -1) {
      throw new Error('Teacher not found');
    }
    
    dummyTeachers.splice(teacherIndex, 1);
    
    return {
      status: 200,
      data: undefined,
      message: 'Teacher deleted successfully'
    };
  },

  // Parents
  getParents: async (params?: PaginationParams & { search?: string; status?: string }): Promise<ApiResponse<Parent[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredParents = [...dummyParents];
    
    if (params?.search) {
      filteredParents = filteredParents.filter(parent => 
        parent.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        parent.email.toLowerCase().includes(params.search!.toLowerCase()) ||
        parent.children.some(child => child.toLowerCase().includes(params.search!.toLowerCase()))
      );
    }
    
    if (params?.status && params.status !== 'all') {
      filteredParents = filteredParents.filter(parent => parent.status === params.status);
    }

    return {
      status: 200,
      data: filteredParents,
      message: 'Parents fetched successfully'
    };
  },

  createParent: async (parent: Omit<Parent, 'id' | 'status'>): Promise<ApiResponse<Parent>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newParent: Parent = {
      ...parent,
      id: Math.max(...dummyParents.map(p => p.id)) + 1,
      status: 'active'
    };
    
    dummyParents.push(newParent);
    
    return {
      status: 201,
      data: newParent,
      message: 'Parent created successfully'
    };
  },

  deleteParent: async (parentId: number): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const parentIndex = dummyParents.findIndex(p => p.id === parentId);
    if (parentIndex === -1) {
      throw new Error('Parent not found');
    }
    
    dummyParents.splice(parentIndex, 1);
    
    return {
      status: 200,
      data: undefined,
      message: 'Parent deleted successfully'
    };
  },

  // Payments
  getPayments: async (params?: { 
    academicYear?: string; 
    term?: string; 
    class?: string; 
    student?: string; 
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Payment[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredPayments = [...dummyPayments];
    
    if (params?.search) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.student.toLowerCase().includes(params.search!.toLowerCase()) ||
        payment.class.toLowerCase().includes(params.search!.toLowerCase()) ||
        payment.paymentFor.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.class && params.class !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.class === params.class);
    }
    
    if (params?.status && params.status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === params.status);
    }

    return {
      status: 200,
      data: filteredPayments,
      message: 'Payments fetched successfully'
    };
  },

  // Reports
  getReports: async (params?: { 
    academicYear?: string; 
    term?: string; 
    class?: string; 
    student?: string;
  }): Promise<ApiResponse<Report[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredReports = [...dummyReports];
    
    if (params?.class && params.class !== 'all') {
      filteredReports = filteredReports.filter(report => report.class === params.class);
    }
    
    if (params?.student && params.student !== 'all') {
      filteredReports = filteredReports.filter(report => report.student === params.student);
    }

    return {
      status: 200,
      data: filteredReports,
      message: 'Reports fetched successfully'
    };
  },

  // Messages
  sendMessage: async (message: MessageData): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate message sending
    console.log('Message sent:', message);
    
    return {
      status: 200,
      data: undefined,
      message: 'Message sent successfully'
    };
  }
};

// When APIs are ready, replace the above implementations with:
/*
import { apiClient } from './client';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
    return response.data;
  },

  getStudents: async (params?: any): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get<ApiResponse<Student[]>>('/admin/students', { params });
    return response.data;
  },

  // ... other API calls
};
*/