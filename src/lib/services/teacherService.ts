<<<<<<< HEAD
=======
import { apiClient } from '@/core/client';
import { ApiResponse, PaginationParams } from '@/types/auth';
>>>>>>> 4ed5a48b64c36dee535778b1995abace6464259f

import { apiClient } from "@/core/client";
import { ApiResponse } from '@/types/auth';

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
interface CourseSAttendanceResponse {
  course_details: {
    category: number;
    categoryName: string;
    fullname: string;
    id: number;
    idnumber: string;
    shortname: string;
  };
  daily: AttendanceRecord[];
  monthly: AttendanceRecord[];
}

<<<<<<< HEAD
=======
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  class: string;
  enrollmentDate: string;
  subjects: string[];
  attendance: number;
  averageScore: number;
}
interface CourseStudentsResponse {
  course_id: number;
  fullname: string;
  shortname: string;
  students: Student[];
}

export interface Message {
  id: number;
  title: string;
  message: string;
  type: string;
  sender: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

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
  averageScore: number;
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


export interface StudentGroup {
  id: number;
  name: string;
  description: string;
  studentIds: number[];
  className: string;
  classId: number;
  createdBy: number;
  createdAt: string;
}

export interface GroupStudentOperation {
  groupId: number;
  studentId: number;
}

// Service functions
>>>>>>> 4ed5a48b64c36dee535778b1995abace6464259f
export const teacherService = {
  // Dashboard
  getDashboardData: async (teacherId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/overview?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Classes
  getClasses: async (teacherId: number, filters?: { term?: string }): Promise<Course[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);
      
      const response = await apiClient.get<Course[]>(`/teacher/dashboard/classes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  // Assessments
  getAssessments: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
    type?: string;
  }): Promise<AssessmentsData> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);
      if (filters?.classId) params.append('classId', filters.classId?.toString() || '');
      if (filters?.type) params.append('type', filters.type || '');
      
      const response = await apiClient.get<AssessmentsData>(`/teacher/dashboard/assessments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      // Handle "PRO FEATURE ONLY" response
      if (error.message?.includes('PRO FEATURE ONLY') || error.response?.data?.message?.includes('PRO FEATURE')) {
        console.log('Assessments feature not available in current plan');
        // Return empty assessments structure
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

  // Attendance
  getAttendance: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
<<<<<<< HEAD
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);
      if (filters?.classId) params.append('classId', filters.classId?.toString() || '');
      
      const response = await apiClient.get<any>(`/teacher/dashboard/attendance?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
=======
  }): Promise<ApiResponse<{
    daily: AttendanceRecord[];
    monthly: AttendanceRecord[];
  }>> => {
    const attendance = await apiClient.get<CourseSAttendanceResponse>(`/teacher/dashboard/attendance-by-course-id?course_id=${teacherId}`);
    return {
      status: 200,
      data: attendance.data,
      message: 'Attendance data fetched successfully'
    };
>>>>>>> 4ed5a48b64c36dee535778b1995abace6464259f
  },

  // Students
  getStudents: async (teacherId: number, filters?: {
    term?: string;
    classId?: number;
<<<<<<< HEAD
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.term) params.append('term', filters.term);
      if (filters?.classId) params.append('classId', filters.classId?.toString() || '');
      
      const response = await apiClient.get<any>(`/teacher/dashboard/students?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
=======
  }): Promise<ApiResponse<Student[]>> => {
    const students = await apiClient.get<CourseStudentsResponse>(`/teacher/teacher-courses-and-students-by-course-id?course_id=${teacherId}`);
    return {
      status: 200,
      data: students.data.students,
      message: 'Students fetched successfully'
    };
>>>>>>> 4ed5a48b64c36dee535778b1995abace6464259f
  },

  // Messages
  getMessages: async (teacherId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/messages?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Create Assessment
  createAssessment: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/teacher/dashboard/assessments/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // Update Assessment
  updateAssessment: async (id: number, data: any): Promise<any> => {
    try {
      const response = await apiClient.put<any>(`/teacher/dashboard/assessments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  // Delete Assessment
  deleteAssessment: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  // Groups
  getGroups: async (teacherId: number, classId?: number): Promise<any> => {
    try {
      const params = new URLSearchParams();
      params.append('teacherId', teacherId.toString());
      if (classId) params.append('classId', classId.toString());
      
      const response = await apiClient.get<any>(`/teacher/dashboard/groups?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  // Create Group
  createGroup: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/teacher/dashboard/groups', data);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  // Update Group
  updateGroup: async (id: number, data: Partial<StudentGroup>): Promise<any> => {
    try {
      const response = await apiClient.put<any>(`/teacher/dashboard/groups/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  // Delete Group
  deleteGroup: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  // Add Student to Group
  addStudentToGroup: async (groupId: number, studentId: number): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/groups/${groupId}/students`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error adding student to group:', error);
      throw error;
    }
  },

  // Remove Student from Group
  removeStudentFromGroup: async (groupId: number, studentId: number): Promise<any> => {
    try {
      const response = await apiClient.delete<any>(`/teacher/dashboard/groups/${groupId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing student from group:', error);
      throw error;
    }
  },

  // Profile
  getProfile: async (teacherId: number): Promise<TeacherProfile> => {
    try {
      const response = await apiClient.get<TeacherProfile>(`/teacher/dashboard/profile?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update Profile
  updateProfile: async (teacherId: number, data: Partial<TeacherProfile>): Promise<TeacherProfile> => {
    try {
      const response = await apiClient.put<TeacherProfile>(`/teacher/dashboard/profile/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Notification Settings
  getNotificationSettings: async (teacherId: number): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.get<NotificationSettings>(`/teacher/dashboard/settings/notifications?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Update Notification Settings
  updateNotificationSettings: async (teacherId: number, data: NotificationSettings): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.put<NotificationSettings>(`/teacher/dashboard/settings/notifications/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Security Settings
  getSecuritySettings: async (teacherId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/settings/security?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  },

  // Preferences
  getPreferences: async (teacherId: number): Promise<Preferences> => {
    try {
      const response = await apiClient.get<Preferences>(`/teacher/dashboard/settings/preferences?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  // Update Preferences
  updatePreferences: async (teacherId: number, data: Preferences): Promise<Preferences> => {
    try {
      const response = await apiClient.put<Preferences>(`/teacher/dashboard/settings/preferences/${teacherId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  // Change Password
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

  // Export Assessments
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

  // Export Results
  exportResults: async (assessmentId: number, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}/results/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  },

  // Get Assessment Details
  getAssessmentDetails: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      throw error;
    }
  },

  // Grade Assessment
  gradeAssessment: async (assessmentId: number, data: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/assessments/${assessmentId}/grade`, data);
      return response.data;
    } catch (error) {
      console.error('Error grading assessment:', error);
      throw error;
    }
  },

  // Get Assessment Submissions
  getAssessmentSubmissions: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/teacher/dashboard/assessments/${assessmentId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment submissions:', error);
      throw error;
    }
  },

  // Publish Assessment Results
  publishAssessmentResults: async (assessmentId: number): Promise<any> => {
    try {
      const response = await apiClient.post<any>(`/teacher/dashboard/assessments/${assessmentId}/publish-results`);
      return response.data;
    } catch (error) {
      console.error('Error publishing assessment results:', error);
      throw error;
    }
  }
};