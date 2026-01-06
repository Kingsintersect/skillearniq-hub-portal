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
import { toast } from 'sonner';

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

export interface PaymentResponse {
  id: string;
  studentId: string;
  studentName: string;
  description: string | null;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  status: string;
  referenceNumber: string;
  paymentMethod: string | null;
  program: string | null;
  createdAt: string;
}

export interface PaymentsSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  upcomingPayments: any[];
  totalPayments: number;
}

export interface PaymentsApiResponse {
  status: number;
  message: string;
  data: {
    student: {
      id: string;
      name: string;
      email: string;
    };
    payments: Array<{
      id: string;
      description: string;
      amount: number;
      dueDate: string | null;
      paymentDate: string | null;
      status: string;
      referenceNumber: string;
      paymentMethod: string | null;
      program: string | null;
      createdAt: string;
    }>;
    summary: {
      totalPaid: number;
      totalPending: number;
      totalOverdue: number;
      totalPayments: number;
      upcomingPayments: any[];
    };
  };
}

export const parentService = {
  getDashboardStats: async (): Promise<ParentDashboardStats> => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await apiClient.get<ParentDashboardResponse>('/parent/dashboard');
      const children = response.data?.children || [];
      
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

  getChildren: async (): Promise<ParentChild[]> => {
    try {
      console.log('Fetching children...');
      const response = await apiClient.get<ParentChildrenResponse>('/parent/children');
      const apiChildren = response.data?.children || [];
      
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
      
      return children;
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  },

  getChildAcademicData: async (childId?: string): Promise<ChildAcademicData[]> => {
    try {
      console.log('Fetching academic data...');
      const response = await apiClient.get<PerformanceReportResponse>('/parent/performance-report');
      const apiChildren = response.data?.children || [];
      
      const academicData: ChildAcademicData[] = apiChildren.map(child => {
        const courses = child.moodle?.courses?.map(course => ({
          course_id: course.course_id,
          course_name: course.course_name,
          course_code: course.course_code || '',
          finalgrade: course.finalgrade,
          activities: course.activities || []
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

      if (childId) {
        return academicData.filter(child => child.id === childId);
      }

      return academicData;
    } catch (error) {
      console.error('Error fetching academic data:', error);
      return [];
    }
  },

  getCourseGradings: async (studentEmail: string): Promise<CourseGradingData[]> => {
    try {
      console.log('Fetching course gradings for:', studentEmail);
      const response = await apiClient.get<any>(
        `/parent/course/course-gradings?student_email=${encodeURIComponent(studentEmail)}`
      );
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && typeof response.data === 'object') {
        return [response.data];
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching course gradings:', error);
      return [];
    }
  },

 
  getTeacherMessages: async (): Promise<Message[]> => {
    return [];
  },

getGradeReports: async (): Promise<StudentGradeReport[]> => {
  return [];
},

getPaymentHistory: async (childId: string): Promise<{ payments: Payment[]; summary: PaymentSummary }> => {
    try {
      console.log('🔄 getPaymentHistory called with childId:', childId);
      
      if (!childId || childId === 'undefined') {
        console.error('❌ Invalid childId:', childId);
        return getEmptyPaymentResponse();
      }
      
      const endpoint = `/parent/child/${childId}/payments`;
      console.log('📞 Calling endpoint:', endpoint);
      
      // Make the API call
      const response = await apiClient.get<any>(endpoint);
      console.log('✅ Raw API Response:', response);
      
      // IMPORTANT: Your apiClient already returns { status, message, data }
      // So response is already the ApiResponse object
      const apiResponse = response;
      
      if (!apiResponse) {
        console.error('❌ No response received');
        return getEmptyPaymentResponse();
      }
      
      console.log('Response status:', apiResponse.status);
      console.log('Response message:', apiResponse.message);
      console.log('Response data:', apiResponse.data);
      
      // The data is in response.data, not response.data.data
      const apiData = apiResponse.data;
      
      if (!apiData) {
        console.error('❌ No data in response');
        return getEmptyPaymentResponse();
      }
      
      // Check the structure of apiData
      console.log('apiData structure:', apiData);
      console.log('apiData.payments:', apiData.payments);
      console.log('apiData.student:', apiData.student);
      console.log('apiData.summary:', apiData.summary);
      
      const apiPayments = apiData.payments || [];
      const apiSummary = apiData.summary || {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        totalPayments: 0,
        upcomingPayments: []
      };
      
      console.log(`💰 Found ${apiPayments.length} payments`);
      
      // Convert to our format
      const payments: Payment[] = apiPayments.map((payment: any, index: number) => ({
        id: payment.id?.toString() || `pay-${index}`,
        invoiceNumber: payment.referenceNumber || payment.id?.toString() || '',
        studentId: apiData.student?.id || childId,
        studentName: apiData.student?.name || 'Student',
        description: payment.description || 'Payment',
        amount: Number(payment.amount) || 0,
        dueDate: payment.dueDate || '',
        status: getPaymentStatus(payment.status),
        paymentDate: payment.paymentDate || undefined,
        paymentMethod: payment.paymentMethod || undefined,
        transactionId: payment.referenceNumber,
        createdAt: payment.createdAt || new Date().toISOString(),
        updatedAt: payment.createdAt || new Date().toISOString()
      }));
      
      // Create summary
      const paidPayments = payments.filter(p => p.status === 'paid');
      const pendingPayments = payments.filter(p => p.status === 'pending');
      const overduePayments = payments.filter(p => p.status === 'overdue');
      
      const summary: PaymentSummary = {
        totalPaid: apiSummary.totalPaid || sumAmount(paidPayments),
        totalPending: apiSummary.totalPending || sumAmount(pendingPayments),
        totalOverdue: apiSummary.totalOverdue || sumAmount(overduePayments),
        upcomingPayments: apiSummary.upcomingPayments || [],
        totalAmount: sumAmount(payments),
        totalCount: payments.length,
        paidCount: paidPayments.length,
        pendingCount: pendingPayments.length,
        overdueCount: overduePayments.length,
        paidAmount: sumAmount(paidPayments),
        pendingAmount: sumAmount(pendingPayments),
        overdueAmount: sumAmount(overduePayments)
      };
      
      console.log('✅ Successfully processed payment history');
      console.log('Payments:', payments);
      console.log('Summary:', summary);
      
      return { payments, summary };
      
    } catch (error: any) {
      console.error('❌ Error in getPaymentHistory:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      return getEmptyPaymentResponse();
    }
  },
};

function getPaymentStatus(status: string): Payment['status'] {
  if (!status) return 'pending';
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'paid') return 'paid';
  if (statusLower === 'pending') return 'pending';
  if (statusLower === 'overdue') return 'overdue';
  return 'pending';
}

function sumAmount(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

function getEmptyPaymentResponse(): { payments: Payment[]; summary: PaymentSummary } {
  return {
    payments: [],
    summary: {
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      upcomingPayments: [],
      totalAmount: 0,
      totalCount: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0
    }
  };
}

function mapPaymentStatus(apiStatus: string): Payment['status'] {
  const statusMap: Record<string, Payment['status']> = {
    'paid': 'paid',
    'PAID': 'paid',
    'pending': 'pending',
    'PENDING': 'pending',
    'overdue': 'overdue',
    'OVERDUE': 'overdue',
    'cancelled': 'cancelled',
    'CANCELLED': 'cancelled'
  };
  
  const normalizedStatus = (apiStatus || '').toLowerCase();
  return statusMap[normalizedStatus] || 'pending';
}

function calculateTotalAmount(payments: Payment[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
}





