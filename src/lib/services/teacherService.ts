import { ApiResponse, PaginationParams } from '@/types/auth';

// Types for teacher data
export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  teacherId: string;
  bio: string;
  avatar: string;
  subjects: string[];
  classes: number;
  totalStudents: number;
  joinDate: string;
}

export interface TeacherClass {
  id: number;
  name: string;
  shortName: string;
  code: string;
  subject: string;
  level: string;
  arm: string;
  academicYear: string;
  term: string;
  studentCount: number;
  schedule: string;
  room: string;
  progress: number;
  averageGrade: string;
}

export interface Assessment {
  id: number;
  title: string;
  class: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  dueDate: string;
  maxScore: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'graded' | 'draft';
  submissions: number;
  totalStudents: number;
  averageScore?: number;
  createdAt: string;
}

export interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
  rate: number;
  students?: any[];
}

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
export const teacherService = {
  // Dashboard
  getDashboardData: async (teacherId: number): Promise<ApiResponse<DashboardStats>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      status: 200,
      data: {
        totalClasses: 6,
        totalStudents: 180,
        totalAssessments: 24,
        averageAttendance: 94.2,
        pendingGrading: 3,
        upcomingDeadlines: 5,
        recentActivities: [
          {
            id: 1,
            type: 'assessment',
            title: 'Mathematics Quiz Graded',
            description: 'JSS 1A Algebra quiz completed grading',
            timestamp: '2024-01-25T10:30:00Z',
            class: 'JSS 1A'
          },
          {
            id: 2,
            type: 'attendance',
            title: 'Attendance Submitted',
            description: 'Daily attendance recorded for all classes',
            timestamp: '2024-01-25T08:15:00Z'
          },
          {
            id: 3,
            type: 'message',
            title: 'New Parent Message',
            description: 'Message from John Doe\'s parent',
            timestamp: '2024-01-24T16:45:00Z'
          },
          {
            id: 4,
            type: 'grade',
            title: 'Science Project Scores Updated',
            description: 'Final scores submitted for JSS 2B',
            timestamp: '2024-01-24T14:20:00Z',
            class: 'JSS 2B'
          }
        ],
        performanceTrend: [
          { date: '2024-01-15', averageScore: 82.5, totalAssessments: 3 },
          { date: '2024-01-16', averageScore: 85.2, totalAssessments: 2 },
          { date: '2024-01-17', averageScore: 78.9, totalAssessments: 4 },
          { date: '2024-01-18', averageScore: 87.1, totalAssessments: 3 },
          { date: '2024-01-19', averageScore: 90.3, totalAssessments: 2 },
          { date: '2024-01-20', averageScore: 88.7, totalAssessments: 5 },
          { date: '2024-01-21', averageScore: 91.2, totalAssessments: 3 }
        ],
        subjectPerformance: [
          { subject: 'Mathematics', averageScore: 88.5, totalStudents: 90, improvement: 2.3 },
          { subject: 'Science', averageScore: 85.2, totalStudents: 85, improvement: 1.8 },
          { subject: 'English', averageScore: 82.7, totalStudents: 95, improvement: 3.1 },
          { subject: 'Social Studies', averageScore: 79.8, totalStudents: 80, improvement: 0.9 }
        ],
        attendanceTrend: [
          { month: 'Jan 2024', present: 580, absent: 20, rate: 96.7 },
          { month: 'Feb 2024', present: 560, absent: 40, rate: 93.3 },
          { month: 'Mar 2024', present: 590, absent: 10, rate: 98.3 },
          { month: 'Apr 2024', present: 575, absent: 25, rate: 95.8 },
          { month: 'May 2024', present: 585, absent: 15, rate: 97.5 }
        ]
      },
      message: 'Dashboard data fetched successfully'
    };
  },

  // Classes
  getClasses: async (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
  }): Promise<ApiResponse<TeacherClass[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const classes: TeacherClass[] = [
      {
        id: 1,
        name: 'Mathematics - JSS 1A',
        shortName: 'JSS 1A',
        code: 'MATH101',
        subject: 'Mathematics',
        level: 'JSS 1',
        arm: 'A',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 30,
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        room: 'Room 201',
        progress: 75,
        averageGrade: 'A-'
      },
      {
        id: 2,
        name: 'Science - JSS 1A',
        shortName: 'JSS 1A',
        code: 'SCI101',
        subject: 'Science',
        level: 'JSS 1',
        arm: 'A',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 30,
        schedule: 'Tue, Thu - 10:30 AM',
        room: 'Lab 301',
        progress: 60,
        averageGrade: 'B+'
      },
      {
        id: 3,
        name: 'Mathematics - JSS 2B',
        shortName: 'JSS 2B',
        code: 'MATH202',
        subject: 'Mathematics',
        level: 'JSS 2',
        arm: 'B',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 28,
        schedule: 'Mon, Wed, Fri - 11:00 AM',
        room: 'Room 205',
        progress: 80,
        averageGrade: 'A'
      },
      {
        id: 4,
        name: 'Science - JSS 2B',
        shortName: 'JSS 2B',
        code: 'SCI202',
        subject: 'Science',
        level: 'JSS 2',
        arm: 'B',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 28,
        schedule: 'Tue, Thu - 1:00 PM',
        room: 'Lab 302',
        progress: 70,
        averageGrade: 'B+'
      },
      {
        id: 5,
        name: 'Mathematics - JSS 3A',
        shortName: 'JSS 3A',
        code: 'MATH303',
        subject: 'Mathematics',
        level: 'JSS 3',
        arm: 'A',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 32,
        schedule: 'Mon, Wed, Fri - 2:00 PM',
        room: 'Room 210',
        progress: 85,
        averageGrade: 'A'
      },
      {
        id: 6,
        name: 'Science - JSS 3A',
        shortName: 'JSS 3A',
        code: 'SCI303',
        subject: 'Science',
        level: 'JSS 3',
        arm: 'A',
        academicYear: '2024-2025',
        term: '1st',
        studentCount: 32,
        schedule: 'Tue, Thu - 3:30 PM',
        room: 'Lab 305',
        progress: 65,
        averageGrade: 'B'
      }
    ];

    let filteredClasses = classes;

    if (filters?.academicYear) {
      filteredClasses = filteredClasses.filter(cls => cls.academicYear === filters.academicYear);
    }

    if (filters?.term) {
      filteredClasses = filteredClasses.filter(cls => cls.term === filters.term);
    }

    return {
      status: 200,
      data: filteredClasses,
      message: 'Classes fetched successfully'
    };
  },

  // Assessments
  getAssessments: async (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
    type?: string;
  }): Promise<ApiResponse<{
    upcoming: Assessment[];
    completed: Assessment[];
    drafts: Assessment[];
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const assessments = {
      upcoming: [
        {
          id: 1,
          title: 'Mathematics Quiz - Algebra',
          class: 'JSS 1A',
          type: 'quiz' as 'quiz',
          dueDate: '2024-02-01',
          maxScore: 20,
          status: 'scheduled' as 'scheduled',
          submissions: 0,
          totalStudents: 30,
          createdAt: '2024-01-25'
        },
        {
          id: 2,
          title: 'Science Project - Solar System',
          class: 'JSS 2B',
          type: 'project' as 'project',
          dueDate: '2024-02-05',
          maxScore: 50,
          status: 'scheduled' as 'scheduled',
          submissions: 0,
          totalStudents: 28,
          createdAt: '2024-01-24'
        }
      ],
      completed: [
        {
          id: 3,
          title: 'English Literature Assignment',
          class: 'JSS 1A',
          type: 'assignment' as 'assignment',
          dueDate: '2024-01-20',
          maxScore: 100,
          status: 'graded' as 'graded',
          submissions: 28,
          totalStudents: 30,
          averageScore: 85.5,
          createdAt: '2024-01-15'
        },
        {
          id: 4,
          title: 'Mathematics Mid-Term Exam',
          class: 'JSS 3A',
          type: 'exam' as 'exam',
          dueDate: '2024-01-18',
          maxScore: 60,
          status: 'graded' as 'graded',
          submissions: 32,
          totalStudents: 32,
          averageScore: 78.2,
          createdAt: '2024-01-10'
        }
      ],
      drafts: [
        {
          id: 5,
          title: 'Science Project',
          class: 'JSS 1A',
          type: 'project' as 'project',
          dueDate: '2024-02-15',
          maxScore: 50,
          status: 'draft' as 'draft',
          submissions: 0,
          totalStudents: 30,
          createdAt: '2024-01-26'
        }
      ]
    };

    return {
      status: 200,
      data: assessments,
      message: 'Assessments fetched successfully'
    };
  },

  // Attendance
  getAttendance: async (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<{
    daily: AttendanceRecord[];
    monthly: AttendanceRecord[];
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const attendance = {
      daily: [
        { 
          date: '2024-01-15', 
          present: 28, 
          absent: 2, 
          late: 1, 
          rate: 93.3,
          students: [
            { id: 1, name: 'John Doe', status: 'present', time: '08:00 AM' },
            { id: 2, name: 'Jane Smith', status: 'absent', time: '-' },
            { id: 3, name: 'Mike Johnson', status: 'late', time: '08:15 AM' },
          ]
        },
        { 
          date: '2024-01-16', 
          present: 29, 
          absent: 1, 
          late: 1, 
          rate: 96.7,
          students: [
            { id: 1, name: 'John Doe', status: 'present', time: '07:55 AM' },
            { id: 2, name: 'Jane Smith', status: 'present', time: '08:00 AM' },
            { id: 3, name: 'Mike Johnson', status: 'late', time: '08:20 AM' },
          ]
        },
        { 
          date: '2024-01-17', 
          present: 27, 
          absent: 3, 
          late: 1, 
          rate: 90.0,
          students: [
            { id: 1, name: 'John Doe', status: 'present', time: '08:00 AM' },
            { id: 2, name: 'Jane Smith', status: 'absent', time: '-' },
            { id: 3, name: 'Mike Johnson', status: 'present', time: '08:00 AM' },
          ]
        }
      ],
      monthly: [
        { date: '2024-01-31', present: 580, absent: 20, late: 0, rate: 96.7, students: [], month: 'January 2024' },
        { date: '2024-02-29', present: 560, absent: 40, late: 0, rate: 93.3, students: [], month: 'February 2024' },
        { date: '2024-03-31', present: 590, absent: 10, late: 0, rate: 98.3, students: [], month: 'March 2024' },
        { date: '2024-04-30', present: 575, absent: 25, late: 0, rate: 95.8, students: [], month: 'April 2024' },
        { date: '2024-05-31', present: 585, absent: 15, late: 0, rate: 97.5, students: [], month: 'May 2024' }
      ]
    };

    return {
      status: 200,
      data: attendance,
      message: 'Attendance data fetched successfully'
    };
  },

  // Students
  getStudents: async (teacherId: number, filters?: {
    academicYear?: string;
    term?: string;
    classId?: number;
  }): Promise<ApiResponse<Student[]>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const students: Student[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@school.edu',
        phone: '+1234567890',
        avatar: '',
        status: 'active',
        class: 'JSS 1A',
        enrollmentDate: '2024-01-15',
        subjects: ['Mathematics', 'English', 'Science', 'Social Studies'],
        attendance: 95,
        averageScore: 88.5
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@school.edu',
        phone: '+1234567891',
        avatar: '',
        status: 'active',
        class: 'JSS 1A',
        enrollmentDate: '2024-01-15',
        subjects: ['Mathematics', 'English', 'Arts', 'Physical Education'],
        attendance: 92,
        averageScore: 85.2
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@school.edu',
        phone: '+1234567892',
        avatar: '',
        status: 'active',
        class: 'JSS 1A',
        enrollmentDate: '2024-01-16',
        subjects: ['Science', 'Mathematics', 'Technology', 'English'],
        attendance: 98,
        averageScore: 91.3
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@school.edu',
        phone: '+1234567893',
        avatar: '',
        status: 'active',
        class: 'JSS 1A',
        enrollmentDate: '2024-01-14',
        subjects: ['English', 'Arts', 'Social Studies', 'Mathematics'],
        attendance: 90,
        averageScore: 82.7
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@school.edu',
        phone: '+1234567894',
        avatar: '',
        status: 'active',
        class: 'JSS 1A',
        enrollmentDate: '2024-01-17',
        subjects: ['Science', 'Technology', 'Mathematics', 'Physical Education'],
        attendance: 96,
        averageScore: 89.1
      }
    ];

    return {
      status: 200,
      data: students,
      message: 'Students fetched successfully'
    };
  },

  // Messages
  getMessages: async (teacherId: number): Promise<ApiResponse<{
    notifications: Message[];
    sentMessages: any[];
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const data = {
      notifications: [
        {
          id: 1,
          title: 'New Assignment Posted',
          message: 'Mathematics assignment for JSS 1A has been posted. Due date: 2024-02-01',
          type: 'assignment',
          sender: 'system',
          timestamp: '2024-01-25T10:30:00Z',
          read: false,
          archived: false
        },
        {
          id: 2,
          title: 'Parent Message - John Doe',
          message: 'Hello, I would like to discuss my son\'s progress in mathematics',
          type: 'parent-message',
          sender: 'parent',
          timestamp: '2024-01-24T14:20:00Z',
          read: true,
          archived: false
        },
        {
          id: 3,
          title: 'Attendance Alert',
          message: 'Low attendance detected for student Jane Smith in JSS 1A',
          type: 'attendance',
          sender: 'system',
          timestamp: '2024-01-23T09:15:00Z',
          read: true,
          archived: false
        }
      ],
      sentMessages: [
        {
          id: 101,
          title: 'To Parents - JSS 1A',
          message: 'Reminder: Parent-teacher meeting scheduled for next week',
          recipients: 'All JSS 1A Parents',
          method: 'in-app',
          timestamp: '2024-01-25T09:00:00Z',
          status: 'delivered'
        }
      ]
    };

    return {
      status: 200,
      data: data,
      message: 'Messages fetched successfully'
    };
  },

  // Academic Years
  getAcademicYears: async (teacherId: number): Promise<ApiResponse<string[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 200,
      data: ['2023-2024', '2024-2025', '2025-2026'],
      message: 'Academic years fetched successfully'
    };
  },

  // Create Assessment
  createAssessment: async (assessmentData: Partial<Assessment>): Promise<ApiResponse<Assessment>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAssessment: Assessment = {
      id: Date.now(),
      title: assessmentData.title || 'New Assessment',
      class: assessmentData.class || 'JSS 1A',
      type: assessmentData.type || 'assignment',
      dueDate: assessmentData.dueDate || new Date().toISOString(),
      maxScore: assessmentData.maxScore || 100,
      status: 'draft',
      submissions: 0,
      totalStudents: 30,
      createdAt: new Date().toISOString()
    };
    
    return {
      status: 200,
      data: newAssessment,
      message: 'Assessment created successfully'
    };
  },

  // Update Assessment
  updateAssessment: async (assessmentId: number, assessmentData: Partial<Assessment>): Promise<ApiResponse<Assessment>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedAssessment: Assessment = {
      id: assessmentId,
      title: assessmentData.title || 'Updated Assessment',
      class: assessmentData.class || 'JSS 1A',
      type: assessmentData.type || 'assignment',
      dueDate: assessmentData.dueDate || new Date().toISOString(),
      maxScore: assessmentData.maxScore || 100,
      status: assessmentData.status || 'draft',
      submissions: 0,
      totalStudents: 30,
      createdAt: new Date().toISOString()
    };
    
    return {
      status: 200,
      data: updatedAssessment,
      message: 'Assessment updated successfully'
    };
  },

  // Delete Assessment
  deleteAssessment: async (assessmentId: number): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 200,
      data: undefined,
      message: 'Assessment deleted successfully'
    };
  },

 
getGroups: async (teacherId: number, classId?: number): Promise<ApiResponse<StudentGroup[]>> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const groups: StudentGroup[] = [
    {
      id: 1,
      name: 'Science Club',
      description: 'Students interested in science projects',
      studentIds: [1, 3, 5],
      className: 'JSS 1A',
      classId: 1,
      createdBy: teacherId,
      createdAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Math Olympiad',
      description: 'Advanced mathematics competition team',
      studentIds: [1, 2],
      className: 'JSS 1A',
      classId: 1,
      createdBy: teacherId,
      createdAt: '2024-01-22'
    }
  ];

  let filteredGroups = groups;

  if (classId) {
    filteredGroups = filteredGroups.filter(group => group.classId === classId);
  }

  return {
    status: 200,
    data: filteredGroups,
    message: 'Groups fetched successfully'
  };
},

createGroup: async (groupData: Partial<StudentGroup>): Promise<ApiResponse<StudentGroup>> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newGroup: StudentGroup = {
    id: Date.now(),
    name: groupData.name || 'New Group',
    description: groupData.description || '',
    studentIds: groupData.studentIds || [],
    className: groupData.className || '',
    classId: groupData.classId || 0,
    createdBy: groupData.createdBy || 0,
    createdAt: new Date().toISOString()
  };
  
  return {
    status: 200,
    data: newGroup,
    message: 'Group created successfully'
  };
},

updateGroup: async (groupId: number, groupData: Partial<StudentGroup>): Promise<ApiResponse<StudentGroup>> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const updatedGroup: StudentGroup = {
    id: groupId,
    name: groupData.name || 'Updated Group',
    description: groupData.description || '',
    studentIds: groupData.studentIds || [],
    className: groupData.className || '',
    classId: groupData.classId || 0,
    createdBy: groupData.createdBy || 0,
    createdAt: groupData.createdAt || new Date().toISOString()
  };
  
  return {
    status: 200,
    data: updatedGroup,
    message: 'Group updated successfully'
  };
},

deleteGroup: async (groupId: number): Promise<ApiResponse<void>> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    status: 200,
    data: undefined,
    message: 'Group deleted successfully'
  };
},

addStudentToGroup: async (operation: GroupStudentOperation): Promise<ApiResponse<StudentGroup>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would update the group
  const mockGroup: StudentGroup = {
    id: operation.groupId,
    name: 'Updated Group',
    description: 'Group with added student',
    studentIds: [1, 2, 3, operation.studentId],
    className: 'JSS 1A',
    classId: 1,
    createdBy: 1,
    createdAt: new Date().toISOString()
  };
  
  return {
    status: 200,
    data: mockGroup,
    message: 'Student added to group successfully'
  };
},

removeStudentFromGroup: async (operation: GroupStudentOperation): Promise<ApiResponse<StudentGroup>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would update the group
  const mockGroup: StudentGroup = {
    id: operation.groupId,
    name: 'Updated Group',
    description: 'Group with removed student',
    studentIds: [1, 2, 3].filter(id => id !== operation.studentId),
    className: 'JSS 1A',
    classId: 1,
    createdBy: 1,
    createdAt: new Date().toISOString()
  };
  
  return {
    status: 200,
    data: mockGroup,
    message: 'Student removed from group successfully'
  };
},
};

// API READY VERSION - COMMENTED OUT FOR NOW
/*
import { apiClient } from './client';

export const teacherService = {
  getDashboardData: async (teacherId: number): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/dashboard`);
    return response.data;
  },

  getClasses: async (teacherId: number, filters?: any): Promise<ApiResponse<TeacherClass[]>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/classes`, { params: filters });
    return response.data;
  },

  getAssessments: async (teacherId: number, filters?: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/assessments`, { params: filters });
    return response.data;
  },

  getAttendance: async (teacherId: number, filters?: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/attendance`, { params: filters });
    return response.data;
  },

  getStudents: async (teacherId: number, filters?: any): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/students`, { params: filters });
    return response.data;
  },

  getMessages: async (teacherId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/messages`);
    return response.data;
  },

  getAcademicYears: async (teacherId: number): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(`/teacher/${teacherId}/academic-years`);
    return response.data;
  },

  createAssessment: async (assessmentData: any): Promise<ApiResponse<Assessment>> => {
    const response = await apiClient.post('/teacher/assessments', assessmentData);
    return response.data;
  },

  updateAssessment: async (assessmentId: number, assessmentData: any): Promise<ApiResponse<Assessment>> => {
    const response = await apiClient.put(`/teacher/assessments/${assessmentId}`, assessmentData);
    return response.data;
  },

  deleteAssessment: async (assessmentId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/teacher/assessments/${assessmentId}`);
    return response.data;
  }
};
*/