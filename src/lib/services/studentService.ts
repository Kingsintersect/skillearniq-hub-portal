import { ApiResponse, PaginationParams } from '@/types/auth';

// Types for student data
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  studentId: string;
  bio: string;
  avatar: string;
  points: number;
  level: number;
  nextLevelPoints: number;
  streak: number;
  rank: number;
  totalStudents: number;
  attendance: number;
  averageGrade: number;
}

export interface StudentClass {
  id: number;
  name: string;
  code: string;
  subject: string;
  teacher: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    department: string;
  };
  schedule: string;
  room: string;
  academicYear: string;
  term: string;
  progress: number;
  currentGrade: string;
  attendance: number;
  nextTopic: string;
  materials: number;
  assignments: number;
  students: number;
  assessments: Assessment[];
  studyGroups: StudyGroup[];
}

export interface Assessment {
  type: 'test' | 'quiz' | 'exam';
  title: string;
  score: number;
  maxScore: number;
  date: string;
  weight?: number;
}

export interface StudyGroup {
  id: number;
  name: string;
  members: number;
  description: string;
}

export interface StudentResult {
  academicYear: string;
  term: string;
  subjects: SubjectResult[];
}

export interface SubjectResult {
  name: string;
  code: string;
  teacher: string;
  assessments: Assessment[];
  attendance: number;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  points: number;
  category: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
  avatar: string;
}

export interface Reward {
  id: number;
  name: string;
  cost: number;
  description: string;
  available: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  gradeAlerts: boolean;
  studyGroupUpdates: boolean;
  eventReminders: boolean;
}

export interface PrivacySettings {
  showProfile: boolean;
  showGrades: boolean;
  showAttendance: boolean;
  leaderboardVisibility: boolean;
  allowMessages: boolean;
  dataSharing: boolean;
}

export interface AppearanceSettings {
  theme: string;
  fontSize: string;
  density: string;
  reducedMotion: boolean;
}

export interface RecentActivity {
  type: 'badge' | 'assignment' | 'streak' | 'quiz';
  title: string;
  points: number;
  time: string;
}

export interface UpcomingDeadline {
  subject: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
}

// Service functions
export const studentService = {
  // Dashboard
  getDashboardData: async (): Promise<ApiResponse<{
    profile: StudentProfile;
    recentActivities: RecentActivity[];
    upcomingDeadlines: UpcomingDeadline[];
    leaderboard: LeaderboardEntry[];
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 200,
      data: {
        profile: {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@school.edu',
          phone: '+1 (555) 123-4567',
          grade: 'JSS 2A',
          studentId: 'STU2024001',
          bio: 'Passionate about mathematics and science. Love coding and robotics.',
          avatar: '',
          points: 1250,
          level: 3,
          nextLevelPoints: 1500,
          streak: 7,
          rank: 3,
          totalStudents: 150,
          attendance: 94.5,
          averageGrade: 85.6
        },
        recentActivities: [
          { type: 'assignment', title: 'Math Homework Submitted', points: 50, time: '2 hours ago' },
          { type: 'quiz', title: 'Science Quiz Completed', points: 30, time: '1 day ago' },
          { type: 'badge', title: 'Earned "Math Whiz" Badge', points: 100, time: '3 days ago' },
          { type: 'streak', title: '7-day Login Streak', points: 25, time: '1 week ago' }
        ],
        upcomingDeadlines: [
          { subject: 'Mathematics', title: 'Algebra Assignment', due: 'Tomorrow', priority: 'high' },
          { subject: 'English', title: 'Essay Writing', due: 'In 3 days', priority: 'medium' },
          { subject: 'Science', title: 'Lab Report', due: 'In 5 days', priority: 'medium' },
          { subject: 'History', title: 'Research Paper', due: 'Next week', priority: 'low' }
        ],
        leaderboard: [
          { rank: 1, name: 'Sarah Wilson', points: 1450, level: 4, avatar: '' },
          { rank: 2, name: 'Mike Johnson', points: 1320, level: 3, avatar: '' },
          { rank: 3, name: 'Alex Johnson', points: 1250, level: 3, avatar: '' },
          { rank: 4, name: 'Emma Davis', points: 1180, level: 3, avatar: '' },
          { rank: 5, name: 'Tom Brown', points: 1050, level: 3, avatar: '' }
        ]
      },
      message: 'Dashboard data fetched successfully'
    };
  },

  // Classes
  getClasses: async (filters?: {
    academicYear?: string;
    term?: string;
    teacher?: string;
    subject?: string;
  }): Promise<ApiResponse<StudentClass[]>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const classes: StudentClass[] = [
      {
        id: 1,
        name: 'Mathematics',
        code: 'MATH202',
        subject: 'Mathematics',
        teacher: {
          id: 1,
          name: 'Mr. Smith',
          email: 'smith@school.edu',
          phone: '+1234567890',
          avatar: '',
          department: 'Mathematics'
        },
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        room: 'Room 201',
        academicYear: '2025-2026',
        term: '1st',
        progress: 75,
        currentGrade: 'A',
        attendance: 95,
        nextTopic: 'Algebraic Expressions',
        materials: 12,
        assignments: 8,
        students: 28,
        assessments: [
          { type: 'test', title: 'Algebra Test 1', score: 28, maxScore: 30, date: '2025-01-15' },
          { type: 'quiz', title: 'Geometry Quiz', score: 9, maxScore: 10, date: '2025-01-22' },
          { type: 'exam', title: 'Mid-Term Exam', score: 55, maxScore: 60, date: '2025-02-01' }
        ],
        studyGroups: [
          { id: 1, name: 'Math Study Group', members: 8, description: 'Algebra focus group' },
          { id: 2, name: 'Calculus Club', members: 12, description: 'Advanced math discussions' }
        ]
      },
      {
        id: 2,
        name: 'English Language',
        code: 'ENG201',
        subject: 'English',
        teacher: {
          id: 2,
          name: 'Mrs. Johnson',
          email: 'johnson@school.edu',
          phone: '+1234567891',
          avatar: '',
          department: 'Languages'
        },
        schedule: 'Tue, Thu - 10:30 AM',
        room: 'Room 105',
        academicYear: '2025-2026',
        term: '1st',
        progress: 60,
        currentGrade: 'B+',
        attendance: 92,
        nextTopic: 'Essay Writing Techniques',
        materials: 8,
        assignments: 6,
        students: 25,
        assessments: [
          { type: 'test', title: 'Grammar Test', score: 26, maxScore: 30, date: '2025-01-18' },
          { type: 'quiz', title: 'Vocabulary Quiz', score: 8, maxScore: 10, date: '2025-01-25' },
          { type: 'exam', title: 'Literature Exam', score: 54, maxScore: 60, date: '2025-02-05' }
        ],
        studyGroups: [
          { id: 3, name: 'Book Club', members: 6, description: 'Literature discussion group' }
        ]
      },
      {
        id: 3,
        name: 'Science',
        code: 'SCI301',
        subject: 'Science',
        teacher: {
          id: 3,
          name: 'Dr. Brown',
          email: 'brown@school.edu',
          phone: '+1234567892',
          avatar: '',
          department: 'Science'
        },
        schedule: 'Mon, Wed - 2:00 PM',
        room: 'Lab 301',
        academicYear: '2025-2026',
        term: '1st',
        progress: 80,
        currentGrade: 'A-',
        attendance: 98,
        nextTopic: 'Chemical Reactions',
        materials: 15,
        assignments: 10,
        students: 30,
        assessments: [
          { type: 'test', title: 'Physics Test', score: 27, maxScore: 30, date: '2025-01-20' },
          { type: 'quiz', title: 'Chemistry Quiz', score: 9, maxScore: 10, date: '2025-01-27' },
          { type: 'exam', title: 'Science Mid-Term', score: 56, maxScore: 60, date: '2025-02-08' }
        ],
        studyGroups: [
          { id: 4, name: 'Science Club', members: 10, description: 'Experimental science group' }
        ]
      },
      {
        id: 4,
        name: 'History',
        code: 'HIS101',
        subject: 'History',
        teacher: {
          id: 4,
          name: 'Mr. Davis',
          email: 'davis@school.edu',
          phone: '+1234567893',
          avatar: '',
          department: 'Social Studies'
        },
        schedule: 'Tue, Thu - 1:00 PM',
        room: 'Room 115',
        academicYear: '2025-2026',
        term: '1st',
        progress: 70,
        currentGrade: 'B',
        attendance: 90,
        nextTopic: 'World War II',
        materials: 10,
        assignments: 7,
        students: 22,
        assessments: [
          { type: 'test', title: 'Ancient History Test', score: 25, maxScore: 30, date: '2025-01-22' },
          { type: 'quiz', title: 'Geography Quiz', score: 8, maxScore: 10, date: '2025-01-29' },
          { type: 'exam', title: 'History Mid-Term', score: 52, maxScore: 60, date: '2025-02-10' }
        ],
        studyGroups: []
      }
    ];

    let filteredClasses = classes;

    if (filters?.academicYear) {
      filteredClasses = filteredClasses.filter(cls => cls.academicYear === filters.academicYear);
    }

    if (filters?.term) {
      filteredClasses = filteredClasses.filter(cls => cls.term === filters.term);
    }

    if (filters?.teacher && filters.teacher !== 'all') {
      filteredClasses = filteredClasses.filter(cls => cls.teacher.name === filters.teacher);
    }

    if (filters?.subject && filters.subject !== 'all') {
      filteredClasses = filteredClasses.filter(cls => cls.subject === filters.subject);
    }

    return {
      status: 200,
      data: filteredClasses,
      message: 'Classes fetched successfully'
    };
  },

  // Results
  getResults: async (filters?: {
    academicYear?: string;
    term?: string;
  }): Promise<ApiResponse<StudentResult[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: StudentResult[] = [
      {
        academicYear: '2024-2025',
        term: '1st',
        subjects: [
          {
            name: 'Mathematics',
            code: 'MATH202',
            teacher: 'Mr. Smith',
            assessments: [
              { type: 'test', title: 'Algebra Test 1', score: 28, maxScore: 30, date: '2025-01-15', weight: 30 },
              { type: 'quiz', title: 'Geometry Quiz', score: 9, maxScore: 10, date: '2025-01-22', weight: 10 },
              { type: 'exam', title: 'Mid-Term Exam', score: 55, maxScore: 60, weight: 60, date: '2025-02-01' }
            ],
            attendance: 95
          },
          {
            name: 'English Language',
            code: 'ENG201',
            teacher: 'Mrs. Johnson',
            assessments: [
              { type: 'test', title: 'Grammar Test', score: 26, maxScore: 30, weight: 30, date: '2025-01-18' },
              { type: 'quiz', title: 'Vocabulary Quiz', score: 8, maxScore: 10, weight: 10, date: '2025-01-25' },
              { type: 'exam', title: 'Literature Exam', score: 54, maxScore: 60, weight: 60, date: '2025-02-05' }
            ],
            attendance: 92
          },
          {
            name: 'Science',
            code: 'SCI301',
            teacher: 'Dr. Brown',
            assessments: [
              { type: 'test', title: 'Physics Test', score: 25, maxScore: 30, weight: 30, date: '2025-01-20' },
              { type: 'quiz', title: 'Chemistry Quiz', score: 8, maxScore: 10, weight: 10, date: '2025-01-27' },
              { type: 'exam', title: 'Science Mid-Term', score: 52, maxScore: 60, weight: 60, date: '2025-02-08' }
            ],
            attendance: 98
          },
          {
            name: 'History',
            code: 'HIS101',
            teacher: 'Mr. Davis',
            assessments: [
              { type: 'test', title: 'Ancient History Test', score: 24, maxScore: 30, weight: 30, date: '2025-01-22' },
              { type: 'quiz', title: 'Geography Quiz', score: 7, maxScore: 10, weight: 10, date: '2025-01-29' },
              { type: 'exam', title: 'History Mid-Term', score: 50, maxScore: 60, weight: 60, date: '2025-02-10' }
            ],
            attendance: 90
          }
        ]
      },
      {
        academicYear: '2023-2024',
        term: '3rd',
        subjects: [
          {
            name: 'Mathematics',
            code: 'MATH201',
            teacher: 'Mr. Smith',
            assessments: [
              { type: 'test', title: 'Final Test', score: 27, maxScore: 30, weight: 30, date: '2024-06-15' },
              { type: 'quiz', title: 'Advanced Quiz', score: 9, maxScore: 10, weight: 10, date: '2024-06-22' },
              { type: 'exam', title: 'Final Exam', score: 56, maxScore: 60, weight: 60, date: '2024-06-30' }
            ],
            attendance: 94
          }
        ]
      }
    ];

    let filteredResults = results;

    if (filters?.academicYear) {
      filteredResults = filteredResults.filter(r => r.academicYear === filters.academicYear);
    }

    if (filters?.term) {
      filteredResults = filteredResults.filter(r => r.term === filters.term);
    }

    return {
      status: 200,
      data: filteredResults,
      message: 'Results fetched successfully'
    };
  },

  // Gamification
  getGamificationData: async (): Promise<ApiResponse<{
    profile: StudentProfile;
    badges: Badge[];
    leaderboard: LeaderboardEntry[];
    rewards: Reward[];
    recentActivities: RecentActivity[];
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 200,
      data: {
        profile: {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@school.edu',
          phone: '+1 (555) 123-4567',
          grade: 'JSS 2A',
          studentId: 'STU2024001',
          bio: 'Passionate about mathematics and science.',
          avatar: '',
          points: 1250,
          level: 3,
          nextLevelPoints: 1500,
          streak: 7,
          rank: 3,
          totalStudents: 150,
          attendance: 94.5,
          averageGrade: 85.6
        },
        badges: [
          { id: 1, name: 'Math Whiz', icon: '🧮', description: 'Score 90%+ in 5 math assessments', earned: true, points: 100, category: 'academic' },
          { id: 2, name: 'Bookworm', icon: '📚', description: 'Read 10 assigned books', earned: true, points: 50, category: 'reading' },
          { id: 3, name: 'Science Explorer', icon: '🔬', description: 'Complete all lab experiments', earned: false, points: 75, category: 'academic' },
          { id: 4, name: 'Perfect Attendance', icon: '⭐', description: 'No absences for one term', earned: true, points: 100, category: 'attendance' },
          { id: 5, name: 'Homework Hero', icon: '💪', description: 'Submit all assignments on time', earned: false, points: 80, category: 'homework' },
          { id: 6, name: 'Group Leader', icon: '👥', description: 'Lead a study group project', earned: false, points: 120, category: 'social' },
          { id: 7, name: 'Early Bird', icon: '🐦', description: 'Submit 5 assignments early', earned: true, points: 60, category: 'homework' },
          { id: 8, name: 'Quiz Master', icon: '🎯', description: 'Score 100% on 3 quizzes', earned: false, points: 90, category: 'academic' }
        ],
        leaderboard: [
          { rank: 1, name: 'Sarah Wilson', points: 1450, level: 4, avatar: '' },
          { rank: 2, name: 'Mike Johnson', points: 1320, level: 3, avatar: '' },
          { rank: 3, name: 'Alex Johnson', points: 1250, level: 3, avatar: '' },
          { rank: 4, name: 'Emma Davis', points: 1180, level: 3, avatar: '' },
          { rank: 5, name: 'Tom Brown', points: 1050, level: 3, avatar: '' },
          { rank: 6, name: 'Lisa Anderson', points: 980, level: 2, avatar: '' },
          { rank: 7, name: 'James Wilson', points: 920, level: 2, avatar: '' },
          { rank: 8, name: 'Maria Garcia', points: 880, level: 2, avatar: '' }
        ],
        rewards: [
          { id: 1, name: 'Homework Pass', cost: 200, description: 'Skip one homework assignment', available: true },
          { id: 2, name: 'Extra Credit', cost: 500, description: 'Get 5% extra credit on next test', available: true },
          { id: 3, name: 'Study Session', cost: 300, description: 'Private study session with teacher', available: false },
          { id: 4, name: 'Library Privileges', cost: 400, description: 'Extended library access', available: true },
          { id: 5, name: 'Lunch with Teacher', cost: 600, description: 'Special lunch with favorite teacher', available: true },
          { id: 6, name: 'Game Time', cost: 250, description: 'Extra computer lab time for games', available: true }
        ],
        recentActivities: [
          { type: 'badge', title: 'Earned Math Whiz Badge', points: 100, time: '2 hours ago' },
          { type: 'assignment', title: 'Completed Science Homework', points: 50, time: '1 day ago' },
          { type: 'streak', title: '7-day login streak', points: 25, time: '2 days ago' },
          { type: 'quiz', title: 'Perfect score on English Quiz', points: 30, time: '3 days ago' },
          { type: 'assignment', title: 'Submitted History Essay', points: 40, time: '4 days ago' }
        ]
      },
      message: 'Gamification data fetched successfully'
    };
  },

  // Settings
  getSettings: async (): Promise<ApiResponse<{
    profile: StudentProfile;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    appearance: AppearanceSettings;
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      status: 200,
      data: {
        profile: {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@school.edu',
          phone: '+1 (555) 123-4567',
          grade: 'JSS 2A',
          studentId: 'STU2024001',
          bio: 'Passionate about mathematics and science. Love coding and robotics.',
          avatar: '',
          points: 1250,
          level: 3,
          nextLevelPoints: 1500,
          streak: 7,
          rank: 3,
          totalStudents: 150,
          attendance: 94.5,
          averageGrade: 85.6
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          assignmentReminders: true,
          gradeAlerts: true,
          studyGroupUpdates: true,
          eventReminders: false
        },
        privacy: {
          showProfile: true,
          showGrades: false,
          showAttendance: true,
          leaderboardVisibility: true,
          allowMessages: true,
          dataSharing: false
        },
        appearance: {
          theme: 'system',
          fontSize: 'medium',
          density: 'comfortable',
          reducedMotion: false
        }
      },
      message: 'Settings fetched successfully'
    };
  },

  updateSettings: async (settings: {
    profile?: Partial<StudentProfile>;
    notifications?: NotificationSettings;
    privacy?: PrivacySettings;
    appearance?: AppearanceSettings;
  }): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Settings updated:', settings);
    
    return {
      status: 200,
      data: undefined,
      message: 'Settings updated successfully'
    };
  },

  // Additional methods for other functionality
  updateProfile: async (profileData: Partial<StudentProfile>): Promise<ApiResponse<StudentProfile>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    console.log('Profile updated:', profileData);
    
    return {
      status: 200,
      data: {
        id: '1',
        name: profileData.name || 'Alex Johnson',
        email: profileData.email || 'alex.johnson@school.edu',
        phone: profileData.phone || '+1 (555) 123-4567',
        grade: 'JSS 2A',
        studentId: 'STU2024001',
        bio: profileData.bio || 'Passionate about mathematics and science. Love coding and robotics.',
        avatar: profileData.avatar || '',
        points: 1250,
        level: 3,
        nextLevelPoints: 1500,
        streak: 7,
        rank: 3,
        totalStudents: 150,
        attendance: 94.5,
        averageGrade: 85.6
      },
      message: 'Profile updated successfully'
    };
  },

  redeemReward: async (rewardId: number): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Reward redeemed:', rewardId);
    
    return {
      status: 200,
      data: undefined,
      message: 'Reward redeemed successfully'
    };
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    console.log('Password changed');
    
    return {
      status: 200,
      data: undefined,
      message: 'Password changed successfully'
    };
  },

  exportData: async (): Promise<ApiResponse<{ downloadUrl: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 200,
      data: { downloadUrl: '/api/export/student-data.csv' },
      message: 'Data exported successfully'
    };
  }
};

// API READY VERSION - COMMENTED OUT FOR NOW
/*
import { apiClient } from './client';

export const studentService = {
  getDashboardData: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/student/dashboard');
    return response.data;
  },

  getClasses: async (filters?: any): Promise<ApiResponse<StudentClass[]>> => {
    const response = await apiClient.get('/student/classes', { params: filters });
    return response.data;
  },

  getResults: async (filters?: any): Promise<ApiResponse<StudentResult[]>> => {
    const response = await apiClient.get('/student/results', { params: filters });
    return response.data;
  },

  getGamificationData: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/student/gamification');
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/student/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<ApiResponse<void>> => {
    const response = await apiClient.put('/student/settings', settings);
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<ApiResponse<StudentProfile>> => {
    const response = await apiClient.put('/student/profile', profileData);
    return response.data;
  },

  redeemReward: async (rewardId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/student/rewards/redeem', { rewardId });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/student/change-password', { currentPassword, newPassword });
    return response.data;
  },

  exportData: async (): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const response = await apiClient.post('/student/export-data');
    return response.data;
  }
};
*/