
import { apiClient } from '@/core/client';
import { 
  ChildAcademicData, 
  Message, 
  ParentChild, 
  ParentDashboardStats, 
  Payment, 
  PaymentSummary, 
  StudentGradeReport 
} from '@/store/parentStore';
import { ApiResponse } from '@/types/auth';

// API Response Interfaces
export interface ParentDashboardResponse {
  children: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    enrollment_status: string;
    enrolled_courses: Array<{ id: number }>;
    assignments: {
      upcoming: any[];
      overdue: any[];
    };
    payments: any[];
    avgGrade: number | null;
    attendance: number | null;
    pendingAssignments: number | null;
  }>;
}

export interface ParentChildrenResponse {
  children: ParentChild[];
}

export interface PerformanceReportResponse {
  children: Array<{
    id: number;
    name: string;
    email: string;
    moodle: {
      found: boolean;
      courses: Array<{
        course_id: number;
        course_name: string;
        course_code: string;
        finalgrade: number | null;
        activities: any[];
      }>;
    };
  }>;
}

export interface CourseGradingsResponse {
  status: number;
  message: string;
  data: any[];
}

// Internal interface for payment response
interface PaymentApiResponse {
  payments: Payment[];
  summary: PaymentSummary;
}

export const parentService = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<ParentDashboardStats> => {
    try {
      const response = await apiClient.get<ParentDashboardResponse>('/parent/dashboard');
      
      const children = response.data.children || [];
      const childrenStats = children.map(child => ({
        id: child.id,
        first_name: child.name.split(' ')[0] || child.name,
        last_name: child.name.split(' ').slice(1).join(' ') || '',
        email: child.email,
        phone: child.phone,
        enrollment_status: child.enrollment_status as 'enrolled' | 'not_enrolled',
        enrolled_courses: child.enrolled_courses.map(course => course.id),
        assignments: child.assignments,
        payments: child.payments,
        grade: '', // Will be populated from other endpoints
        avgGrade: child.avgGrade || 0,
        attendance: child.attendance || 0,
        pendingAssignments: child.pendingAssignments || 0
      }));

      return {
        childrenCount: children.length,
        childrenStats
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get children list
  getChildren: async (): Promise<ParentChild[]> => {
    try {
      const response = await apiClient.get<ParentChildrenResponse>('/parent/children');
      return response.data.children;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  },

  // Get child academic data (performance report)
  getChildAcademicData: async (childId?: string): Promise<ChildAcademicData[]> => {
    try {
      const response = await apiClient.get<PerformanceReportResponse>('/parent/performance-report');
      const children = response.data.children || [];
      
      // Convert API response to ChildAcademicData format
      //@ts-ignore
      const academicData: ChildAcademicData[] = children.map(child => {
        // For each course in moodle, create a course entry
        const courses = child.moodle?.courses?.map(course => ({
          course_name: course.course_name,
          teacher: '', // Not available in this endpoint
          testScores: [0, 0, 0], // Default values
          quizScores: [0, 0, 0], // Default values
          examScore: course.finalgrade || 0,
          assignments: [], // Not available in this endpoint
          attendance: 0 // Not available in this endpoint
        })) || [];

        return {
          id: child.id.toString(),
          name: child.name,
          email: child.email,
          class: '', // Not available in this endpoint
          classTeacher: '', // Not available in this endpoint
          groups: [], // Not available in this endpoint
          attendance: 0, // Not available in this endpoint
          courses,
          moodle: child.moodle
        };
      });

      // Filter by childId if provided
      if (childId) {
        return academicData.filter(child => child.id === childId);
      }

      return academicData;
    } catch (error) {
      console.error('Error fetching academic data:', error);
      return [];
    }
  },

  // Get course gradings for a specific student
  getCourseGradings: async (studentEmail: string): Promise<any[]> => {
    try {
      const response = await apiClient.get<CourseGradingsResponse>(
        `/parent/course/course-gradings?student_email=${studentEmail}`
      );
      
      // Return empty array if no grades found (404)
      if (response.status === 404 || !response.data) {
        return [];
      }
      // @ts-ignore
      return response.data;
    } catch (error) {
      console.error('Error fetching course gradings:', error);
      return [];
    }
  },

  // Get teacher messages
  getTeacherMessages: async (): Promise<Message[]> => {
    try {
      // Since we don't have a messages endpoint, return empty array
      // In production, you would make an API call to /parent/messages or similar
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Get payment history
  getPaymentHistory: async (): Promise<PaymentApiResponse> => {
    try {
      // Since we don't have a payments endpoint, return empty data
      // In production, you would make an API call to /parent/payments or similar
      const payments: Payment[] = [];
      
      const summary: PaymentSummary = {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        upcomingPayments: []
      };

      return { payments, summary };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return {
        payments: [],
        summary: {
          totalPaid: 0,
          totalPending: 0,
          totalOverdue: 0,
          upcomingPayments: []
        }
      };
    }
  },

  // Get grade reports
  getGradeReports: async (): Promise<StudentGradeReport[]> => {
    try {
      // Since we don't have a grade reports endpoint, return empty array
      // In production, you would make an API call to /parent/grade-reports or similar
      return [];
    } catch (error) {
      console.error('Error fetching grade reports:', error);
      return [];
    }
  },
};