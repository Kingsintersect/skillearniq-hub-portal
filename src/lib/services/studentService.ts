// src/lib/services/studentService.ts
import { ApiResponse } from '@/types/auth';
import { apiClient } from '@/core/client';

/**
 * Domain types
 */
export interface StudentProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string | null;
  address: string | null;
  state: string | null;
  country: string;
  admission_no: string | null;
  registration_date: string | null;
  enrollment_status: string;
  current_class_id: number | null;
  meta: any | null;
}

export interface Payment {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  status: 'pending' | 'paid' | 'overdue';
  referenceNumber: string;
  paymentMethod: string | null;
  program: string | null;
}

export interface PaymentStats {
  studentPayments?: {
    summary: {
      totalPaid: number;
      totalPending: number;
      totalOverdue: number;
      totalDue: number;
    };
    payments: Payment[];
    analytics: {
      byStatus: {
        paid: number;
        pending: number;
        overdue: number;
      };
      byProgram: any[];
    };
  };
  summary?: any;
  payments?: any;
  analytics?: any;
}

export interface Assessment {
  id: number;
  title: string;
  type: string;
  score: number | null;
  max_score: number;
  date: string;
  subject: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  teacher: string;
  remarks: string | null;
}

export interface StudentClass {
  id: number;
  name: string;
  code: string;
  subject: string;
  teacher_name: string;
  teacher_email: string;
  schedule: string;
  room: string;
  term: string;
  current_grade: string | null;
  attendance_percentage: number | null;
}

// Course Types
export interface MoodleCourse {
  id: number;
  category: number;
  sortorder: number;
  fullname: string;
  shortname: string;
  idnumber: string;
  summary: string;
  summaryformat: number;
  format: string;
  showgrades: number;
  newsitems: number;
  startdate: number;
  enddate: number;
  relativedatesmode: number;
  marker: number;
  maxbytes: number;
  legacyfiles: number;
  showreports: number;
  visible: number;
  visibleold: number;
  downloadcontent: any;
  groupmode: number;
  groupmodeforce: number;
  defaultgroupingid: number;
  lang: string;
  calendartype: string;
  theme: string;
  timecreated: number;
  timemodified: number;
  requested: number;
  enablecompletion: number;
  completionnotify: number;
  cacherev: number;
  originalcourseid: number | null;
  showactivitydates: number;
  showcompletionconditions: number | null;
  pdfexportfont: number | null;
}

export interface StudentCourse {
  id: number;
  name: string;
  code: string;
  course: string;
  currentGrade: string;
  progress: number;
  attendance: {
    headers: any;
    original: {
      status: string;
      message: string;
      data: any[];
    };
    exception: any;
  };
  studentCount: number;
  assignments: number;
  materials: number;
  nextTopic: string;
  teacher: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    Course: string;
  };
  assessments: any[];
}

export interface StudentCoursesResponse {
  status: number;
  message: string;
  data: StudentCourse[];
}

/**
 * Normalizes API responses
 */
function normalize<T>(response: any): ApiResponse<T> {
  let extracted: any = response;

  if (response?.data?.data) extracted = response.data.data;
  else if (response?.data) extracted = response.data;

  return {
    status: response.status ?? 200,
    message: response.message ?? 'OK',
    data: extracted as T,
  };
}

export const studentService = {
  /** Get student profile */
  getProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    const res = await apiClient.get('/student/profile');
    return normalize<StudentProfile>(res);
  },

  /** Update student profile */
  updateProfile: async (
    profileData: Partial<StudentProfile>
  ): Promise<ApiResponse<StudentProfile>> => {
    const res = await apiClient.put('/student/profile', profileData);
    return normalize<StudentProfile>(res);
  },

  /** Payment stats */
  getPaymentStats: async (): Promise<ApiResponse<PaymentStats>> => {
    const res = await apiClient.get('/student/dashboard/payment-stats');
    return normalize<PaymentStats>(res);
  },

  /** Assessments */
  getAssessments: async (): Promise<ApiResponse<Assessment[]>> => {
    const res = await apiClient.get('/student/assessments');
    return normalize<Assessment[]>(res);
  },

  /** Attendance */
  getAttendance: async (): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await apiClient.get('/student/attendance');
    return normalize<AttendanceRecord[]>(res);
  },

  /** Classes */
  getClasses: async (): Promise<ApiResponse<StudentClass[]>> => {
    const res = await apiClient.get('/student/classes');
    return normalize<StudentClass[]>(res);
  },

  /** Get Moodle courses */
  getCourses: async (): Promise<ApiResponse<MoodleCourse[]>> => {
    const res = await apiClient.get('/student/courses');
    return normalize<MoodleCourse[]>(res);
  },

  /** Get student course data with progress */
  /** Get student course data with progress */
getStudentCourses: async (): Promise<ApiResponse<StudentCoursesResponse>> => {
  try {
    const res = await apiClient.get('/student/course/data');
    console.log('Student courses response:', res);

    // Ensure res is always an object
    const body: any = res || {};

    // Normalize all possible backend structures
    const normalized: StudentCoursesResponse = {
      status:
        body.data?.studentCourses?.status ??
        body.data?.status ??
        body.status ??
        200,

      message:
        body.data?.studentCourses?.message ??
        body.data?.message ??
        body.message ??
        'Courses data fetched',

      data:
        body.data?.studentCourses?.data ??
        body.data?.data ??
        body.data ??
        [],
    };

    return {
      status: normalized.status,
      message: normalized.message,
      data: normalized,
    };

  } catch (error: any) {
    console.error('Error fetching student courses:', error);

    // Always return a correctly typed fallback
    return {
      status: 200,
      message: 'Courses data not available',
      data: {
        status: 200,
        message: 'Courses data not available',
        data: [],
      },
    };
  }
},


  /** Dashboard Summary */
  getDashboardSummary: async (): Promise<ApiResponse<{
    profile: StudentProfile;
    paymentStats: PaymentStats;
    recentAssessments: Assessment[];
    attendance: AttendanceRecord[];
    upcomingDeadlines: any[];
  }>> => {
    const [p, ps, a, at] = await Promise.allSettled([
      studentService.getProfile(),
      studentService.getPaymentStats(),
      studentService.getAssessments(),
      studentService.getAttendance(),
    ]);

    const profile =
      p.status === 'fulfilled' ? p.value.data : ({
        user_id: 0,
        first_name: 'Student',
        last_name: '',
        email: '',
        phone: '',
        username: null,
        address: null,
        state: null,
        country: '',
        admission_no: null,
        registration_date: null,
        enrollment_status: 'active',
        current_class_id: null,
        meta: null,
      } as StudentProfile);

    const paymentStats =
      ps.status === 'fulfilled' ? ps.value.data : ({
        studentPayments: {
          summary: { totalPaid: 0, totalPending: 0, totalOverdue: 0, totalDue: 0 },
          payments: [],
          analytics: {
            byStatus: { paid: 0, pending: 0, overdue: 0 },
            byProgram: [],
          },
        },
      } as PaymentStats);

    const assessments =
      a.status === 'fulfilled' ? a.value.data : [];

    const attendance =
      at.status === 'fulfilled' ? at.value.data : [];

    const upcomingDeadlines = assessments
      .filter((x) => x.score === null)
      .slice(0, 5)
      .map((a) => ({
        subject: a.subject,
        title: a.title,
        due: a.date,
        priority: 'high',
      }));

    return {
      status: 200,
      message: 'Dashboard data fetched successfully',
      data: {
        profile,
        paymentStats,
        recentAssessments: assessments.slice(0, 10),
        attendance: attendance.slice(0, 30),
        upcomingDeadlines,
      },
    };
  },

  /** Change password */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    const res = await apiClient.post('/student/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return normalize<void>(res);
  },

  /** Export data */
  exportData: async (): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const res = await apiClient.post('/student/export-data');
    return normalize<{ downloadUrl: string }>(res);
  },
};