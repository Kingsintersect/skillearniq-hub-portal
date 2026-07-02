import { apiClient } from "@/core/client";
import { ApiResponse } from '@/types/auth';

// Dashboard Interfaces
export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalAssessments: number;
  averageAttendance: number;
  pendingGrading: number;
  upcomingDeadlines: number;
  recentActivities: RecentActivity[];
  performanceTrend: PerformanceData[];
  subjectPerformance: SubjectPerformance[];
  attendanceTrend: AttendanceTrend[];
}

export interface CourseCategory {
  id: number;
  name: string;
  parent: number;
  sortorder: number;
}

export interface Course {
  id: number;
  fullname: string;
  shortname: string;
  category: number;
  visible: number;
  startdate: number;
  summary: string;
}

export interface Instructor {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface StudentActivity {
  activity_name: string;
  type: 'quiz' | 'assign' | 'exam' | 'other';
  grade: number;
  max_grade: number;
}

export interface StudentGrade {
  student_id: number;
  student_email: string;
  student_username: string;
  final_grade: number;
  letter_grade: string;
  quality_points: number;
  credit_load: number;
  activities: StudentActivity[];
}

export interface CourseGradesResponse {
  course_id: number;
  course_code: string;
  course_name: string;
  course_image_url: string;
  instructors: Instructor[];
  students: StudentGrade[];
}



export interface GeneralAttendanceApiResponse {
  attendance: {
    status: number;
    message: string;
    data: {
      daily: AttendanceRecord[];
      monthly: AttendanceRecord[];
    };
  };
}

export interface RecentActivity {
  id: number;
  type: 'assessment' | 'attendance' | 'message' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  class?: string;
}

export interface PerformanceData {
  date: string;
  averageScore: number | null;
  totalAssessments: number;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  totalStudents: number;
  improvement: number;
}

export interface AttendanceTrend {
  month: string;
  present: number;
  absent: number;
  rate: number;
}

export interface AttendanceRecord {
  id?: number;
  date: string;
  month: string;
  present: number;
  absent: number;
  late?: number;
  rate: number;
  students?: Array<{
    id: number;
    name: string;
    status: 'present' | 'absent' | 'late';
    time: string;
  }>;
}

// API Response Interfaces
export interface DashboardApiResponse {
  dashboard: {
    overview: {
      totalStudents: number;
      totalClasses: number;
      totalAssessments: number;
      averageAttendance: number;
      pendingGrading: number;
      upcomingDeadlines: number;
    };
    attendanceTrend: AttendanceTrend[];
    performanceTrend: PerformanceData[];
    subjectPerformance: SubjectPerformance[];
    recentActivities: RecentActivity[];
  };
}

export interface GeneralAttendanceApiResponse {
  attendance: {
    status: number;
    message: string;
    data: {
      daily: AttendanceRecord[];
      monthly: AttendanceRecord[];
    };
  };
}

export interface CourseAttendanceApiResponse {
  status: number;
  message: string;
  data: {
    daily: AttendanceRecord[];
    monthly: AttendanceRecord[];
    course_details: {
      id: number;
      fullname: string;
      shortname: string;
      idnumber: string;
      category: number;
      categoryName: string;
    };
  };
}

export interface StudentsApiResponse {
  status: number;
  message: string;
  data: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    class: string;
    status: string;
    attendance: number;
    averageScore: number | null;
    enrollmentDate: string;
    subjects: string[];
  }>;
}

// Other existing interfaces
export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assessmentReminders: boolean;
  attendanceAlerts: boolean;
  messageNotifications: boolean;
}

export interface Preferences {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export interface StudentGroup {
  id: number;
  name: string;
  description: string;
  studentCount: number;
  classId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  students?: any[];
}

export interface TeacherProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  bio: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  name: string;
  shortName: string;
  code: string;
  subject: string;
  level: string | null;
  arm: string | null;
  room: string | null;
  schedule: string | null;
  academicYear: string;
  term: string;
  studentCount: number;
  averageGrade: number | null;
  progress: number;
}

export interface Assessment {
  id: number;
  title: string;
  class: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  dueDate: string;
  maxScore: number;
  submissions: number;
  totalStudents: number;
  averageScore?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'graded';
  results?: Array<{
    studentId: number;
    studentName: string;
    score: number;
    grade: string;
  }>;
}

export interface AssessmentsData {
  assessments: {
    upcoming: Assessment[];
    completed: Assessment[];
    drafts: Assessment[];
  };
}

export const teacherService = {
  // ==================== DASHBOARD ====================
  // In teacherService.ts - update the getDashboardData method:

  getDashboardData: async (teacherId: number): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await apiClient.get<DashboardApiResponse>('/teacher/dashboard/stats');

      console.log('Dashboard API Response:', response);

      // If response is empty or doesn't have the expected structure
      if (!response.data || !response.data.dashboard || Object.keys(response.data).length === 0) {
        console.warn('Dashboard API returned empty or invalid response, using fallback data');

        // Try to fetch students separately to get accurate count
        try {
          const studentsResponse = await apiClient.get<StudentsApiResponse>('/teacher/dashboard/students');
          const studentCount = studentsResponse.data?.data?.length || 0;

          // Try to fetch classes to get accurate count
          const classesResponse = await apiClient.get<any[]>('/teacher/dashboard/classes');
          const classCount = classesResponse.data?.length || 0;

          const fallbackStats: DashboardStats = {
            totalClasses: classCount,
            totalStudents: studentCount,
            totalAssessments: 0,
            averageAttendance: 0,
            pendingGrading: 0,
            upcomingDeadlines: 0,
            recentActivities: [],
            performanceTrend: [],
            subjectPerformance: [],
            attendanceTrend: []
          };

          return {
            status: 200,
            data: fallbackStats,
            message: 'Using fallback dashboard data'
          };
        } catch (fallbackError) {
          console.error('Failed to fetch fallback data:', fallbackError);

          // Return basic fallback
          const fallbackStats: DashboardStats = {
            totalClasses: 0,
            totalStudents: 0,
            totalAssessments: 0,
            averageAttendance: 0,
            pendingGrading: 0,
            upcomingDeadlines: 0,
            recentActivities: [],
            performanceTrend: [],
            subjectPerformance: [],
            attendanceTrend: []
          };

          return {
            status: 200,
            data: fallbackStats,
            message: 'Dashboard data not available, using empty data'
          };
        }
      }

      const dashboardData = response.data.dashboard;

      const overview = dashboardData.overview || {};

      console.log('Dashboard overview data:', overview);

      const dashboardStats: DashboardStats = {
        totalClasses: overview.totalClasses || 0,
        totalStudents: overview.totalStudents || 0,
        totalAssessments: overview.totalAssessments || 0,
        averageAttendance: overview.averageAttendance || 0,
        pendingGrading: overview.pendingGrading || 0,
        upcomingDeadlines: overview.upcomingDeadlines || 0,
        recentActivities: dashboardData.recentActivities || [],
        performanceTrend: dashboardData.performanceTrend || [],
        subjectPerformance: dashboardData.subjectPerformance || [],
        attendanceTrend: dashboardData.attendanceTrend || []
      };

      console.log('Processed dashboard stats:', dashboardStats);

      return {
        status: response.status || 200,
        data: dashboardStats,
        message: 'Dashboard data fetched successfully'
      };

    } catch (error: any) {
      console.error('Error in getDashboardData:', error);

      // Return empty stats on error
      const fallbackStats: DashboardStats = {
        totalClasses: 0,
        totalStudents: 0,
        totalAssessments: 0,
        averageAttendance: 0,
        pendingGrading: 0,
        upcomingDeadlines: 0,
        recentActivities: [],
        performanceTrend: [],
        subjectPerformance: [],
        attendanceTrend: []
      };

      return {
        status: 500,
        data: fallbackStats,
        message: error.message || 'Failed to fetch dashboard data'
      };
    }
  },

  getTeacherCourses: async (): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await apiClient.get<any>('/teacher/courses');

      // Handle different response structures
      let coursesData: Course[] = [];

      if (Array.isArray(response.data)) {
        // Direct array response
        coursesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Nested data property
        coursesData = response.data.data;
      } else if (response.data?.data) {
        // Single object response
        coursesData = [response.data.data];
      } else if (response.data) {
        // If response.data is already an array of courses
        coursesData = response.data;
      }

      return {
        status: 200,
        message: 'Success',
        data: coursesData
      };
    } catch (error: any) {
      console.error('Error fetching teacher courses:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch courses',
        data: []
      };
    }
  },



  getStudentsCount: async (teacherId: number): Promise<number> => {
    try {
      const response = await apiClient.get<StudentsApiResponse>('/teacher/dashboard/students');
      console.log('Students API Response for count:', response);

      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.length;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching students count:', error);
      return 0;
    }
  },

  getAttendance: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<{
    daily: AttendanceRecord[];
    monthly: AttendanceRecord[];
  }>> => {
    try {
      console.log('DEBUG: Starting getAttendance...');

      // Don't use ApiResponse type here since API doesn't return that structure
      //@ts-ignore
      const response = await apiClient.instance.get('/teacher/dashboard/attendance', {
        params: filters
      });

      console.log('DEBUG: Raw axios response:', response);
      console.log('DEBUG: Response data:', response.data);

      // The API returns: { attendance: { status, message, data: { daily, monthly } } }
      if (response.data && response.data.attendance) {
        const attendanceData = response.data.attendance;

        // Check if we have the expected structure
        if (attendanceData.data && (attendanceData.data.daily !== undefined || attendanceData.data.monthly !== undefined)) {
          return {
            status: attendanceData.status || 200,
            data: attendanceData.data,
            message: attendanceData.message || 'Attendance fetched successfully'
          };
        }
      }

      // If structure is unexpected, log it for debugging
      console.log('DEBUG: Unexpected structure - full response:', response);
      console.log('DEBUG: response.data keys:', Object.keys(response.data || {}));

      throw new Error('Unexpected API response structure');

    } catch (error: any) {
      console.error('Error in getAttendance:', error);

      // If it's an Axios error, check the response
      if (error.response) {
        console.log('DEBUG: Error response data:', error.response.data);

        if (error.response.data && error.response.data.attendance) {
          const attendanceData = error.response.data.attendance;
          return {
            status: attendanceData.status,
            data: attendanceData.data || { daily: [], monthly: [] },
            message: attendanceData.message
          };
        }
      }

      // Return empty data but don't throw - let the component handle empty state
      return {
        status: error.status || 500,
        data: { daily: [], monthly: [] },
        message: error.message || 'Failed to fetch attendance data'
      };
    }
  },
  // ==================== ATTENDANCE PER COURSE ====================
  getAttendancePerCourse: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<{
    daily: AttendanceRecord[];
    monthly: AttendanceRecord[];
    course_details: any;
  }>> => {
    try {
      const courseId = filters?.classId || teacherId;

      console.log('🚀 [getAttendancePerCourse] Starting fetch...');
      console.log('🚀 Course ID:', courseId);
      console.log('🚀 Teacher ID:', teacherId);
      console.log('🚀 Filters:', filters);

      // Construct the URL
      const url = `/teacher/dashboard/attendance-by-course-id?course_id=${courseId}`;
      console.log('🚀 Calling URL:', url);

      // Make the API call
      const response = await apiClient.get<any>(url);

      console.log('✅ [getAttendancePerCourse] Response received');
      console.log('✅ Response status:', response.status);
      console.log('✅ Full response object:', response);
      console.log('✅ Response data:', response.data);

      // If response.data is an empty object {}, handle it gracefully
      if (!response.data || Object.keys(response.data).length === 0) {
        console.warn('⚠️ API returned empty object. This might mean:');
        console.warn('⚠️ 1. The endpoint doesnt exist');
        console.warn('⚠️ 2. Authentication failed');
        console.warn('⚠️ 3. The course has no attendance data');

        // Return empty data structure instead of throwing
        return {
          status: 200,
          data: {
            daily: [],
            monthly: [],
            course_details: {
              id: courseId,
              fullname: `Class ${courseId}`,
              shortname: '',
              idnumber: '',
              category: 0,
              categoryName: ''
            }
          },
          message: 'No attendance data found for this course'
        };
      }

      // Try to extract data from different possible structures
      let dailyData: any[] = [];
      let monthlyData: any[] = [];
      let courseDetails: any = {
        id: courseId,
        fullname: `Class ${courseId}`,
        shortname: '',
        idnumber: '',
        category: 0,
        categoryName: ''
      };

      // Structure 1: Your expected structure (from Postman)
      if (response.data.data) {
        console.log('📊 Using structure 1: response.data.data');
        dailyData = response.data.data.daily || [];
        monthlyData = response.data.data.monthly || [];
        courseDetails = response.data.data.course_details || courseDetails;
      }
      // Structure 2: Data directly in response
      else if (response.data.daily || response.data.monthly) {
        console.log('📊 Using structure 2: data at root level');
        dailyData = response.data.daily || [];
        monthlyData = response.data.monthly || [];
        courseDetails = response.data.course_details || courseDetails;
      }
      // Structure 3: Maybe the entire response is the data
      else if (Array.isArray(response.data.daily) || Array.isArray(response.data.monthly)) {
        console.log('📊 Using structure 3: arrays at root');
        dailyData = response.data.daily || [];
        monthlyData = response.data.monthly || [];
      }
      // Structure 4: Completely different structure
      else {
        console.warn('⚠️ Unexpected response structure, using empty data');
        console.warn('⚠️ Response structure:', JSON.stringify(response.data, null, 2));
      }

      console.log('📊 Extracted - Daily:', dailyData.length, 'Monthly:', monthlyData.length);
      console.log('📊 Course details:', courseDetails);

      return {
        status: response.status || 200,
        data: {
          daily: dailyData,
          monthly: monthlyData,
          course_details: courseDetails
        },
        message: response.data.message || 'Attendance data fetched successfully'
      };

    } catch (error: any) {
      console.error('❌ [getAttendancePerCourse] Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);

      return {
        status: error.response?.status || 500,
        data: {
          daily: [],
          monthly: [],
          course_details: {
            id: filters?.classId || 0,
            fullname: `Class ${filters?.classId || 'Unknown'}`,
            shortname: '',
            idnumber: '',
            category: 0,
            categoryName: ''
          }
        },
        message: error.message || 'Failed to fetch course attendance data'
      };
    }
  },

  // ==================== STUDENTS ====================
  getStudentsPerCourse: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get<any>('/teacher/dashboard/students');

      console.log('Students API Full Response:', response);

      if (response.data) {
        const studentsData =
          response.data.data ||
          response.data.students ||
          response.data;

        if (Array.isArray(studentsData)) {
          return {
            status: response.status || 200,
            data: studentsData,
            message: 'Students data fetched successfully'
          };
        }
      }

      console.error('Unexpected response structure:', response.data);
      throw new Error('Invalid students response structure');

    } catch (error: any) {
      console.error('Error fetching students:', error);

      return {
        status: 500,
        data: [],
        message: error.message || 'Failed to fetch students data'
      };
    }
  },
  getStudents: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get<any>('/teacher/dashboard/students');

      console.log('Students API Full Response:', response);

      if (response.data) {
        const studentsData =
          response.data.data ||
          response.data.students ||
          response.data;

        if (Array.isArray(studentsData)) {
          return {
            status: response.status || 200,
            data: studentsData,
            message: 'Students data fetched successfully'
          };
        }
      }

      console.error('Unexpected response structure:', response.data);
      throw new Error('Invalid students response structure');

    } catch (error: any) {
      console.error('Error fetching students:', error);

      return {
        status: 500,
        data: [],
        message: error.message || 'Failed to fetch students data'
      };
    }
  },

  // ==================== CLASSES ====================
  getClasses: async (teacherId: number, filters?: { term?: string }): Promise<any[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);

      const response = await apiClient.get<any[]>(`/teacher/dashboard/classes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  // ==================== ASSESSMENTS ====================
  getAssessments: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
    type?: string;
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);
      if (filters?.classId) params.append('classId', filters.classId?.toString() || '');
      if (filters?.type) params.append('type', filters.type || '');

      const response = await apiClient.get<any>(`/teacher/dashboard/assessments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.message?.includes('PRO FEATURE ONLY') || error.response?.data?.message?.includes('PRO FEATURE')) {
        console.log('Assessments feature not available in current plan');
        return {
          assessments: {
            upcoming: [],
            completed: [],
            drafts: []
          }
        };
      }
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  // ==================== MESSAGES ====================
  getMessages: async (teacherId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/messages?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // ==================== CREATE ASSESSMENT ====================
  createAssessment: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/teacher/dashboard/assessments/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // ==================== UPDATE ASSESSMENT ====================
  updateAssessment: async (id: number, data: any): Promise<any> => {
    try {
      const response = await apiClient.put<any>(`/teacher/dashboard/assessments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  // ==================== DELETE ASSESSMENT ====================
  deleteAssessment: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  // ==================== GROUPS ====================
  createGroup: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/teacher/dashboard/groups', data);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  updateGroup: async (id: number, data: Partial<StudentGroup>): Promise<any> => {
    try {
      const response = await apiClient.put<any>(`/teacher/dashboard/groups/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  deleteGroup: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  addStudentToGroup: async (groupId: number, studentId: number): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/groups/${groupId}/students`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error adding student to group:', error);
      throw error;
    }
  },

  removeStudentFromGroup: async (groupId: number, studentId: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/groups/${groupId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing student from group:', error);
      throw error;
    }
  },

  // ==================== PROFILE ====================
  getProfile: async (teacherId: number): Promise<TeacherProfile> => {
    try {
      const response = await apiClient.get<TeacherProfile>(`/teacher/dashboard/profile?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (teacherId: number, data: Partial<TeacherProfile>): Promise<TeacherProfile> => {
    try {
      const response = await apiClient.put<TeacherProfile>(`/teacher/dashboard/profile/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // ==================== NOTIFICATION SETTINGS ====================
  getNotificationSettings: async (teacherId: number): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.get<NotificationSettings>(`/teacher/dashboard/settings/notifications?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  updateNotificationSettings: async (teacherId: number, data: NotificationSettings): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.put<NotificationSettings>(`/teacher/dashboard/settings/notifications/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // ==================== SECURITY SETTINGS ====================
  getSecuritySettings: async (teacherId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/settings/security?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  },

  // ==================== PREFERENCES ====================
  getPreferences: async (teacherId: number): Promise<Preferences> => {
    try {
      const response = await apiClient.get<Preferences>(`/teacher/dashboard/settings/preferences?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  updatePreferences: async (teacherId: number, data: Preferences): Promise<Preferences> => {
    try {
      const response = await apiClient.put<Preferences>(`/teacher/dashboard/settings/preferences/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  // ==================== CHANGE PASSWORD ====================
  changePassword: async (teacherId: number, data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/settings/change-password/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // ==================== EXPORT ASSESSMENTS ====================
  exportAssessments: async (teacherId: number, filters?: {
    classId?: number;
    format: 'csv' | 'excel' | 'pdf';
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.classId) params.append('classId', filters.classId.toString());
      if (filters?.format) params.append('format', filters.format);

      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/export?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting assessments:', error);
      throw error;
    }
  },

  // ==================== EXPORT RESULTS ====================
  exportResults: async (assessmentId: number, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}/results/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  },

  // ==================== GET ASSESSMENT DETAILS ====================
  getAssessmentDetails: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      throw error;
    }
  },

  // ==================== GRADE ASSESSMENT ====================
  gradeAssessment: async (assessmentId: number, data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/assessments/${assessmentId}/grade`, data);
      return response.data;
    } catch (error) {
      console.error('Error grading assessment:', error);
      throw error;
    }
  },

  // ==================== GET ASSESSMENT SUBMISSIONS ====================
  getAssessmentSubmissions: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment submissions:', error);
      throw error;
    }
  },

  // ==================== PUBLISH ASSESSMENT RESULTS ====================
  publishAssessmentResults: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/assessments/${assessmentId}/publish-results`);
      return response.data;
    } catch (error) {
      console.error('Error publishing assessment results:', error);
      throw error;
    }
  },

  getCourseGrades: async (courseId: number): Promise<ApiResponse<CourseGradesResponse>> => {
    try {
      const response = await apiClient.get<any>(`/teacher/course/course-gradings/${courseId}`);

      console.log('Teacher Course Grades Response:', response);

      // Handle different response structures
      let courseData: any = {};

      if (response.data && typeof response.data === 'object') {
        if (response.data.data) {
          courseData = response.data.data;
        } else {
          courseData = response.data;
        }
      }

      const formattedData: CourseGradesResponse = {
        course_id: courseData.course_id || courseId,
        course_code: courseData.course_code || '',
        course_name: courseData.course_name || '',
        course_image_url: courseData.course_image_url || '',
        instructors: Array.isArray(courseData.instructors) ? courseData.instructors : [],
        students: Array.isArray(courseData.students) ? courseData.students : []
      };

      return {
        status: 200,
        message: 'Success',
        data: formattedData
      };
    } catch (error: any) {
      console.error('Error fetching teacher course grades:', error);
      return {
        status: error.statusCode || 500,
        message: error.message || 'Failed to fetch course grades',
        data: {
          course_id: courseId,
          course_code: '',
          course_name: '',
          course_image_url: '',
          instructors: [],
          students: []
        }
      };
    }
  }
};