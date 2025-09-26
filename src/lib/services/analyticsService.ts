import { Assignment, Grade, Attendance, LiveClass } from '@/types';

export interface DashboardStats {
  totalAssignments: number;
  gradedAssignments: number;
  pendingGrading: number;
  averageClassScore: number;
  studentPerformance: StudentPerformance[];
  assignmentCompletion: AssignmentCompletion[];
  attendanceRate: number;
  upcomingDeadlines: Assignment[];
  recentActivity: RecentActivity[];
}

export interface StudentPerformance {
  studentId: number;
  studentName: string;
  averageScore: number;
  assignmentsCompleted: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface AssignmentCompletion {
  assignmentId: number;
  title: string;
  completionRate: number;
  averageScore: number;
  submitted: number;
  totalStudents: number;
}

export interface RecentActivity {
  id: number;
  type: 'submission' | 'grade' | 'attendance' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  studentName?: string;
  score?: number;
}

export const analyticsService = {
  getTeacherDashboardStats: async (teacherId: number): Promise<DashboardStats> => {
    // Simulate API call with comprehensive dummy data
    return Promise.resolve({
      totalAssignments: 24,
      gradedAssignments: 18,
      pendingGrading: 6,
      averageClassScore: 76.5,
      studentPerformance: [
        { studentId: 1, studentName: 'John Doe', averageScore: 85, assignmentsCompleted: 12, trend: 'improving' },
        { studentId: 2, studentName: 'Jane Smith', averageScore: 92, assignmentsCompleted: 12, trend: 'stable' },
        { studentId: 3, studentName: 'Mike Johnson', averageScore: 78, assignmentsCompleted: 10, trend: 'improving' },
        { studentId: 4, studentName: 'Sarah Wilson', averageScore: 65, assignmentsCompleted: 8, trend: 'declining' },
        { studentId: 5, studentName: 'David Brown', averageScore: 88, assignmentsCompleted: 11, trend: 'stable' },
      ],
      assignmentCompletion: [
        { assignmentId: 1, title: 'Algebra Basics', completionRate: 95, averageScore: 82, submitted: 19, totalStudents: 20 },
        { assignmentId: 2, title: 'English Essay', completionRate: 85, averageScore: 78, submitted: 17, totalStudents: 20 },
        { assignmentId: 3, title: 'Science Project', completionRate: 70, averageScore: 85, submitted: 14, totalStudents: 20 },
        { assignmentId: 4, title: 'History Quiz', completionRate: 90, averageScore: 76, submitted: 18, totalStudents: 20 },
      ],
      attendanceRate: 92.5,
      upcomingDeadlines: [
        {
          id: 5,
          title: 'Mathematics Final Exam',
          description: 'Chapters 1-10 comprehensive exam',
          subjectId: 1,
          classId: 1,
          dueDate: '2024-02-01T09:00:00',
          maxScore: 100,
          type: 'exam',
          status: 'published',
          createdAt: '2024-01-25T10:00:00'
        },
        {
          id: 6,
          title: 'Physics Lab Report',
          description: 'Experiment on Newton\'s Laws',
          subjectId: 3,
          classId: 1,
          dueDate: '2024-02-03T23:59:00',
          maxScore: 50,
          type: 'assignment',
          status: 'published',
          createdAt: '2024-01-26T14:30:00'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'submission',
          title: 'New Submission',
          description: 'Algebra assignment submitted',
          studentName: 'Mike Johnson',
          timestamp: '2024-01-28T14:30:00'
        },
        {
          id: 2,
          type: 'grade',
          title: 'Assignment Graded',
          description: 'English essay graded',
          studentName: 'Sarah Wilson',
          score: 72,
          timestamp: '2024-01-28T11:15:00'
        },
        {
          id: 3,
          type: 'attendance',
          title: 'Attendance Recorded',
          description: 'Class attendance for 28th Jan',
          timestamp: '2024-01-28T09:00:00'
        }
      ]
    });
  },

  getPerformanceTrends: async (classId: number, period: 'week' | 'month' | 'term') => {
    // Simulate trend data
    return Promise.resolve({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      averages: [72, 75, 74, 76.5],
      submissions: [15, 17, 16, 18]
    });
  }
};