// lib/services/parentService.ts
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

// Your API returns direct data, not wrapped
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
  children: Array<{
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    country: string | null;
    state: string | null;
    lga: string | null;
    is_active: number;
    email_verified: number;
    phone_verified: number;
    created_at: string;
    updated_at: string;
    last_login_at: string;
    meta: any;
  }>;
}

export interface CourseGradingData {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url?: string;
  instructors: Array<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }>;
  students: Array<{
    student_id: number;
    student_email: string;
    student_username: string;
    final_grade: number;
    letter_grade: string;
    quality_points: number;
    credit_load: number;
    activities: Array<{
      activity_name: string;
      type: string;
      grade: number;
      max_grade: number;
    }>;
  }>;
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

export const parentService = {
  // Get dashboard stats - SIMPLE VERSION
  getDashboardStats: async (): Promise<ParentDashboardStats> => {
    try {
      console.log('Fetching dashboard stats...');
      
      const response = await apiClient.get<ParentDashboardResponse>('/parent/dashboard');
      
      console.log('Dashboard API response:', response);
      
      // apiClient returns: { status: number, data: ParentDashboardResponse, message: string }
      // So response.data is ParentDashboardResponse
      const children = response.data?.children || [];
      console.log('Found children in dashboard:', children.length);
      
      const childrenStats = children.map(child => ({
        id: child.id,
        first_name: child.name.split(' ')[0] || child.name,
        last_name: child.name.split(' ').slice(1).join(' ') || '',
        email: child.email,
        phone: child.phone,
        enrollment_status: child.enrollment_status as 'enrolled' | 'not_enrolled',
        enrolled_courses: child.enrolled_courses?.map(course => course.id) || [],
        assignments: child.assignments || { upcoming: [], overdue: [] },
        payments: child.payments || [],
        grade: '',
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
      return {
        childrenCount: 0,
        childrenStats: []
      };
    }
  },

  // Get children list - SIMPLE VERSION
  getChildren: async (): Promise<ParentChild[]> => {
    try {
      console.log('Fetching children...');
      
      const response = await apiClient.get<ParentChildrenResponse>('/parent/children');
      
      console.log('Children API response:', response);
      
      // apiClient returns: { status: number, data: ParentChildrenResponse, message: string }
      // So response.data is ParentChildrenResponse
      const apiChildren = response.data?.children || [];
      console.log('Found children:', apiChildren.length);
      
      // Convert API children to ParentChild format
      const children: ParentChild[] = apiChildren.map(child => ({
        id: child.id.toString(),
        first_name: child.first_name,
        last_name: child.last_name,
        grade: '',
        studentId: child.id.toString(),
        relationship: 'child',
        email: child.email,
        phone: child.phone
      }));
      
      console.log('Converted children:', children);
      return children;
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  },

  // Get child academic data - SIMPLE VERSION
  getChildAcademicData: async (childId?: string): Promise<ChildAcademicData[]> => {
  try {
    console.log('Fetching academic data...');
    
    const response = await apiClient.get<PerformanceReportResponse>('/parent/performance-report');
    
    console.log('Performance report API response:', response);
    
    const apiChildren = response.data?.children || [];
    console.log('Found children in performance report:', apiChildren.length);
    
    // Convert API response to ChildAcademicData format
    const academicData: ChildAcademicData[] = apiChildren.map(child => {
      const courses = child.moodle?.courses?.map(course => ({
        course_name: course.course_name,
        course_code: course.course_code || '',
        finalgrade: course.finalgrade,
        activities: course.activities || [],
        // Add all required properties from Course interface
        teacher: '',
        testScores: [0, 0, 0],
        quizScores: [0, 0, 0],
        examScore: course.finalgrade || 0,
        assignments: [],
        attendance: 0
      })) || [];

      return {
        id: child.id.toString(),
        name: child.name,
        email: child.email,
        class: '',
        classTeacher: '',
        groups: [],
        attendance: 0,
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

  // Get course gradings
  // In lib/services/parentService.ts - update getCourseGradings method
getCourseGradings: async (studentEmail: string): Promise<CourseGradingData[]> => {
  try {
    console.log('Fetching course gradings for:', studentEmail);
    
    const response = await apiClient.get<any>(
      `/parent/course/course-gradings?student_email=${encodeURIComponent(studentEmail)}`
    );
    
    console.log('Course gradings response:', response);
    
    // Handle single course or array response
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data && typeof response.data === 'object') {
      // If it's a single course object, wrap it in an array
      return [response.data];
    }
    
    return [];
  } catch (error: any) {
    console.error('Error fetching course gradings:', error);
    return [];
  }
},
  // Get teacher messages
  getTeacherMessages: async (): Promise<Message[]> => {
    return [];
  },

  // Get payment history
  getPaymentHistory: async (): Promise<{ payments: Payment[]; summary: PaymentSummary }> => {
    return {
      payments: [],
      summary: {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        upcomingPayments: []
      }
    };
  },

  // Get grade reports
  getGradeReports: async (): Promise<StudentGradeReport[]> => {
    return [];
  },
};