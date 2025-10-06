import { ApiResponse, PaginationParams } from '@/types/auth';

// Types for parent data
export interface ParentChild {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  relationship: string;
}

export interface ChildStats {
  name: string;
  grade: string;
  avgGrade: number;
  attendance: number;
  pendingAssignments: number;
}

export interface ChildAcademicData {
  id: string;
  name: string;
  class: string;
  classTeacher: string;
  groups: string[];
  attendance: number;
  subjects: SubjectData[];
}

export interface SubjectData {
  name: string;
  teacher: string;
  testScores: number[];
  quizScores: number[];
  examScore: number;
  assignments: Assignment[];
  attendance: number;
}

export interface Assignment {
  title: string;
  dueDate: string;
  status: 'submitted' | 'pending';
  score?: number;
}

export interface TeacherMessage {
  id: number;
  from: string;
  subject: string;
  message: string;
  date: string;
  student: string;
}

export interface PaymentRecord {
  id: number;
  student: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface ParentDashboardStats {
  childrenCount: number;
  overallAttendance: number;
  pendingAssignments: number;
  childrenStats: ChildStats[];
}

// Service functions
export const parentService = {
  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<ParentDashboardStats>> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 200,
      data: {
        childrenCount: 2,
        overallAttendance: 94,
        pendingAssignments: 5,
        childrenStats: [
          { 
            name: 'Alex Johnson', 
            grade: 'JSS 2A', 
            avgGrade: 85.6, 
            attendance: 95,
            pendingAssignments: 2 
          },
          { 
            name: 'Sarah Johnson', 
            grade: 'JSS 1B', 
            avgGrade: 78.3, 
            attendance: 92,
            pendingAssignments: 3 
          }
        ]
      },
      message: 'Dashboard stats fetched successfully'
    };
  },

  getChildren: async (): Promise<ApiResponse<ParentChild[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 200,
      data: [
        { 
          id: '1', 
          name: 'Alex Johnson', 
          grade: 'JSS 2A', 
          studentId: 'STU2025001',
          relationship: 'Son'
        },
        { 
          id: '2', 
          name: 'Sarah Johnson', 
          grade: 'JSS 1B', 
          studentId: 'STU2025002',
          relationship: 'Daughter'
        }
      ],
      message: 'Children data fetched successfully'
    };
  },

  // Academic Data
  getChildAcademicData: async (childId?: string): Promise<ApiResponse<ChildAcademicData[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data: ChildAcademicData[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        class: 'JSS 2A',
        classTeacher: 'Mr. Smith',
        groups: ['Science Club', 'Math Olympiad'],
        attendance: 95,
        subjects: [
          {
            name: 'Mathematics',
            teacher: 'Mr. Smith',
            testScores: [28, 26, 29],
            quizScores: [9, 8, 9],
            examScore: 55,
            assignments: [
              { title: 'Algebra Homework', dueDate: '2025-02-01', status: 'submitted', score: 95 },
              { title: 'Geometry Project', dueDate: '2025-02-15', status: 'pending' }
            ],
            attendance: 96
          },
          {
            name: 'English',
            teacher: 'Mrs. Johnson',
            testScores: [26, 25, 27],
            quizScores: [8, 8, 9],
            examScore: 54,
            assignments: [
              { title: 'Essay Writing', dueDate: '2025-02-03', status: 'submitted', score: 88 }
            ],
            attendance: 94
          }
        ]
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        class: 'JSS 1B',
        classTeacher: 'Mrs. Davis',
        groups: ['Art Club', 'Debate Society'],
        attendance: 92,
        subjects: [
          {
            name: 'Mathematics',
            teacher: 'Mr. Brown',
            testScores: [24, 23, 25],
            quizScores: [7, 7, 8],
            examScore: 48,
            assignments: [
              { title: 'Basic Algebra', dueDate: '2025-02-05', status: 'submitted', score: 82 }
            ],
            attendance: 91
          }
        ]
      }
    ];

    const filteredData = childId ? data.filter(child => child.id === childId) : data;

    return {
      status: 200,
      data: filteredData,
      message: 'Academic data fetched successfully'
    };
  },

  // Messages
  getTeacherMessages: async (childId?: string): Promise<ApiResponse<TeacherMessage[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const messages: TeacherMessage[] = [
      {
        id: 1,
        from: 'Mr. Smith',
        subject: 'Weekly Progress Report - Alex Johnson',
        message: 'Alex showed excellent improvement in mathematics this week. His algebra test scores have improved significantly.',
        date: '2025-01-28',
        student: 'Alex Johnson'
      },
      {
        id: 2,
        from: 'Mrs. Davis',
        subject: 'Weekly Summary - Sarah Johnson',
        message: 'Sarah is doing well in English class. She participated actively in group discussions this week.',
        date: '2025-01-28',
        student: 'Sarah Johnson'
      }
    ];

    const filteredMessages = childId 
      ? messages.filter(message => {
          const child = childId === '1' ? 'Alex Johnson' : 'Sarah Johnson';
          return message.student === child;
        })
      : messages;

    return {
      status: 200,
      data: filteredMessages,
      message: 'Messages fetched successfully'
    };
  },

  // Payments
  getPaymentHistory: async (childId?: string): Promise<ApiResponse<PaymentRecord[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const payments: PaymentRecord[] = [
      {
        id: 1,
        student: 'Alex Johnson',
        description: 'Term 1 Tuition Fee',
        amount: 250000,
        date: '2025-01-15',
        status: 'paid'
      },
      {
        id: 2,
        student: 'Sarah Johnson',
        description: 'Term 1 Tuition Fee',
        amount: 250000,
        date: '2025-01-15',
        status: 'paid'
      }
    ];

    const filteredPayments = childId 
      ? payments.filter(payment => {
          const child = childId === '1' ? 'Alex Johnson' : 'Sarah Johnson';
          return payment.student === child;
        })
      : payments;

    return {
      status: 200,
      data: filteredPayments,
      message: 'Payment history fetched successfully'
    };
  }
};

// When APIs are ready, replace with:
/*
import { apiClient } from './client';

export const parentService = {
  getDashboardStats: async (): Promise<ApiResponse<ParentDashboardStats>> => {
    const response = await apiClient.get('/parent/dashboard/stats');
    return response.data;
  },

  getChildren: async (): Promise<ApiResponse<ParentChild[]>> => {
    const response = await apiClient.get('/parent/children');
    return response.data;
  },

  // ... other API calls
};
*/