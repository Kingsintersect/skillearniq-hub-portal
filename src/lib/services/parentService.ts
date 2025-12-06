import { apiClient } from '@/core/client';
import { ChildAcademicData, Message, ParentChild, ParentChildrenResponse, ParentDashboardResponse, ParentDashboardStats, Payment, PaymentSummary, StudentGradeReport } from '@/store/parentStore';
import { ApiResponse } from '@/types/auth';

export const parentService = {

  getDashboardStats: async (): Promise<ApiResponse<ParentDashboardStats>> => {
    const result = await apiClient.get<ParentDashboardResponse>('/parent/dashboard');
    const count = result.data.children.length

    return {
      status: 200,
      data: {
        childrenCount: count,
        childrenStats: [
          {
            id: 3,
            first_name: "Chukwuebuka",
            last_name: "Noko",
            email: "user@gmail.com",
            phone: "07015363296",
            enrollment_status: "enrolled",
            enrolled_courses: [
              9,
              6
            ],
            assignments: {
              "upcoming": [],
              "overdue": []
            },
            payments: [],
            grade: 'JSS 2A',
            avgGrade: 85.6,
            attendance: 95,
            pendingAssignments: 2
          },
          {
            id: 7,
            first_name: 'Sarah',
            last_name: "Johnson",
            email: "user@gmail.com",
            phone: "07015363296",
            enrollment_status: "enrolled",
            enrolled_courses: [
              9,
              6
            ],
            assignments: {
              "upcoming": [],
              "overdue": []
            },
            payments: [],
            grade: 'JSS 1B',
            avgGrade: 78.3,
            attendance: 92,
            pendingAssignments: 3
          },
          {
            id: 9,
            first_name: 'Maurice',
            last_name: "Johnson",
            email: "user@gmail.com",
            phone: "07015363296",
            enrollment_status: "enrolled",
            enrolled_courses: [
              9,
              6
            ],
            assignments: {
              "upcoming": [],
              "overdue": []
            },
            payments: [],
            grade: 'JSS 1B',
            avgGrade: 66.3,
            attendance: 80,
            pendingAssignments: 1
          }
        ]
      },
      message: 'Dashboard stats fetched successfully'
    };
  },

  getChildren: async (): Promise<ApiResponse<ParentChild[]>> => {
    const result = await apiClient.get<ParentChildrenResponse>('/parent/children');

    return {
      status: 200,
      data: result.data.children,
      message: 'Children data fetched successfully'
    };
  },

  getChildAcademicData: async (): Promise<ApiResponse<ChildAcademicData[]>> => {
    const result = await apiClient.get<ChildAcademicData[]>('/parent/performance-report');
    const data: ChildAcademicData[] = [
      {
        id: '3',
        name: 'Alex Johnson',
        class: 'JSS 2A',
        classTeacher: 'Mr. Smith',
        groups: ['Science Club', 'Math Olympiad'],
        attendance: 95,
        courses: [
          {
            course_name: 'Mathematics',
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
            course_name: 'English',
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
        id: '7',
        name: 'Sarah Johnson',
        class: 'JSS 1B',
        classTeacher: 'Mrs. Davis',
        groups: ['Art Club', 'Debate Society'],
        attendance: 92,
        courses: [
          {
            course_name: 'Mathematics',
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
      },
      {
        id: '9',
        name: 'Maurice Johnson',
        class: 'JSS 1B',
        classTeacher: 'Mrs. Davis',
        groups: ['Art Club', 'Debate Society'],
        attendance: 92,
        courses: [
          {
            course_name: 'Mathematics',
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
    // const filteredData = childId ? data.filter(child => child.id.toString() === childId) : data;
    return {
      status: 200,
      data: data,
      message: 'Academic data fetched successfully'
    };
  },

  getTeacherMessages: async (): Promise<ApiResponse<Message[]>> => {
    const messages: Message[] = [
      {
        id: 'msg-3-1',
        studentId: '3',
        studentName: 'Alex Johnson',
        title: 'Excellent Performance in Mathematics',
        content: 'Alex has shown remarkable improvement in mathematics this term. His problem-solving skills have improved significantly and he scored 95% in the last assessment. Keep up the great work!',
        sender: 'Mr. Smith',
        senderType: 'teacher',
        date: '2024-02-15',
        isRead: false,
        priority: 'high',
        category: 'academic'
      },
      {
        id: 'msg-3-2',
        studentId: '3',
        studentName: 'Alex Johnson',
        title: 'Science Club Meeting Update',
        content: 'The next Science Club meeting has been rescheduled to Friday, 3:00 PM in Lab 2. Please ensure Alex brings his lab coat and safety goggles.',
        sender: 'Mrs. Davis',
        senderType: 'teacher',
        date: '2024-02-12',
        isRead: true,
        priority: 'medium',
        category: 'general'
      },
      {
        id: 'msg-3-3',
        studentId: '3',
        studentName: 'Alex Johnson',
        title: 'Attendance Concern',
        content: 'We noticed Alex was absent on February 10th without prior notice. Please inform the school office if he will be absent for medical or other reasons.',
        sender: 'School Administration',
        senderType: 'admin',
        date: '2024-02-11',
        isRead: false,
        priority: 'medium',
        category: 'attendance'
      },

      // Student ID: 7 - Sarah Johnson
      {
        id: 'msg-7-1',
        studentId: '7',
        studentName: 'Sarah Johnson',
        title: 'Art Competition Winner!',
        content: 'Congratulations! Sarah won first place in the inter-school art competition. Her painting will be displayed in the school gallery for the next month.',
        sender: 'Mrs. Robinson',
        senderType: 'teacher',
        date: '2024-02-14',
        isRead: false,
        priority: 'high',
        category: 'academic'
      },
      {
        id: 'msg-7-2',
        studentId: '7',
        studentName: 'Sarah Johnson',
        title: 'Debate Society Practice',
        content: 'Debate Society practice sessions will now be held every Wednesday after school. Sarah has shown great potential in argumentation and research skills.',
        sender: 'Mr. Thompson',
        senderType: 'teacher',
        date: '2024-02-10',
        isRead: true,
        priority: 'low',
        category: 'general'
      },
      {
        id: 'msg-7-3',
        studentId: '7',
        studentName: 'Sarah Johnson',
        title: 'Library Book Overdue',
        content: 'The book "Advanced Art Techniques" borrowed by Sarah is overdue. Please return it to the library as soon as possible to avoid late fees.',
        sender: 'School Library',
        senderType: 'system',
        date: '2024-02-08',
        isRead: false,
        priority: 'medium',
        category: 'general'
      },

      // Student ID: 9 - Maurice Johnson
      {
        id: 'msg-9-1',
        studentId: '9',
        studentName: 'Maurice Johnson',
        title: 'Sports Day Participation',
        content: 'Maurice has been selected to represent his class in the upcoming Sports Day events. Please ensure he has proper sports attire and brings a water bottle.',
        sender: 'Coach Wilson',
        senderType: 'teacher',
        date: '2024-02-13',
        isRead: true,
        priority: 'medium',
        category: 'general'
      },
      {
        id: 'msg-9-2',
        studentId: '9',
        studentName: 'Maurice Johnson',
        title: 'Mathematics Support Needed',
        content: 'Maurice is struggling with geometry concepts. We recommend additional practice at home. The math department offers extra help sessions on Tuesdays and Thursdays.',
        sender: 'Mr. Brown',
        senderType: 'teacher',
        date: '2024-02-09',
        isRead: false,
        priority: 'high',
        category: 'academic'
      },
      {
        id: 'msg-9-3',
        studentId: '9',
        studentName: 'Maurice Johnson',
        title: 'Art Club Materials',
        content: 'Please provide Maurice with the required art materials for the upcoming project: sketchbook, charcoal pencils, and watercolor set.',
        sender: 'Mrs. Roberts',
        senderType: 'teacher',
        date: '2024-02-07',
        isRead: true,
        priority: 'low',
        category: 'general'
      },
      {
        id: 'msg-9-4',
        studentId: '9',
        studentName: 'Maurice Johnson',
        title: 'Positive Behavior Recognition',
        content: 'Maurice demonstrated excellent teamwork and sportsmanship during today\'s group activities. His positive attitude is commendable!',
        sender: 'Mrs. Davis',
        senderType: 'teacher',
        date: '2024-02-05',
        isRead: false,
        priority: 'medium',
        category: 'behavior'
      }
    ];

    return {
      status: 200,
      data: messages,
      message: 'Messages fetched successfully'
    };
  },

  getPaymentHistory: async (): Promise<ApiResponse<{ payments: Payment[]; summary: PaymentSummary }>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

    const payments: Payment[] = [
      {
        id: 'pay-3-1',
        invoiceNumber: 'INV-2024-001',
        studentId: '3',
        studentName: 'Alex Johnson',
        description: 'Term 1 Tuition Fee',
        amount: 150000,
        dueDate: '2024-02-15',
        status: 'paid',
        paymentDate: '2024-02-10',
        paymentMethod: 'bank transfer',
        transactionId: 'TXN-001',
        createdAt: '2024-01-15',
        updatedAt: '2024-02-10'
      },
      {
        id: 'pay-3-2',
        invoiceNumber: 'INV-2024-002',
        studentId: '3',
        studentName: 'Alex Johnson',
        description: 'Science Club Fee',
        amount: 25000,
        dueDate: '2024-03-01',
        status: 'pending',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
      },
      {
        id: 'pay-3-3',
        invoiceNumber: 'INV-2024-003',
        studentId: '3',
        studentName: 'Alex Johnson',
        description: 'Math Olympiad Registration',
        amount: 15000,
        dueDate: '2024-02-20',
        status: 'overdue',
        createdAt: '2024-01-20',
        updatedAt: '2024-02-21'
      },
      {
        id: 'pay-3-4',
        invoiceNumber: 'INV-2024-004',
        studentId: '3',
        studentName: 'Alex Johnson',
        description: 'Term 2 Tuition Fee',
        amount: 150000,
        dueDate: '2024-05-15',
        status: 'pending',
        createdAt: '2024-04-01',
        updatedAt: '2024-04-01'
      },

      // Student ID: 7 - Sarah Johnson
      {
        id: 'pay-7-1',
        invoiceNumber: 'INV-2024-005',
        studentId: '7',
        studentName: 'Sarah Johnson',
        description: 'Term 1 Tuition Fee',
        amount: 145000,
        dueDate: '2024-02-15',
        status: 'paid',
        paymentDate: '2024-02-12',
        paymentMethod: 'credit card',
        transactionId: 'TXN-002',
        createdAt: '2024-01-15',
        updatedAt: '2024-02-12'
      },
      {
        id: 'pay-7-2',
        invoiceNumber: 'INV-2024-006',
        studentId: '7',
        studentName: 'Sarah Johnson',
        description: 'Art Club Materials Fee',
        amount: 18000,
        dueDate: '2024-03-10',
        status: 'pending',
        createdAt: '2024-02-05',
        updatedAt: '2024-02-05'
      },
      {
        id: 'pay-7-3',
        invoiceNumber: 'INV-2024-007',
        studentId: '7',
        studentName: 'Sarah Johnson',
        description: 'Debate Society Fee',
        amount: 12000,
        dueDate: '2024-02-25',
        status: 'paid',
        paymentDate: '2024-02-20',
        paymentMethod: 'online',
        transactionId: 'TXN-003',
        createdAt: '2024-01-25',
        updatedAt: '2024-02-20'
      },
      {
        id: 'pay-7-4',
        invoiceNumber: 'INV-2024-008',
        studentId: '7',
        studentName: 'Sarah Johnson',
        description: 'Library Fine',
        amount: 5000,
        dueDate: '2024-02-18',
        status: 'overdue',
        createdAt: '2024-02-10',
        updatedAt: '2024-02-19'
      },

      // Student ID: 9 - Maurice Johnson
      {
        id: 'pay-9-1',
        invoiceNumber: 'INV-2024-009',
        studentId: '9',
        studentName: 'Maurice Johnson',
        description: 'Term 1 Tuition Fee',
        amount: 145000,
        dueDate: '2024-02-15',
        status: 'paid',
        paymentDate: '2024-02-08',
        paymentMethod: 'bank transfer',
        transactionId: 'TXN-004',
        createdAt: '2024-01-15',
        updatedAt: '2024-02-08'
      },
      {
        id: 'pay-9-2',
        invoiceNumber: 'INV-2024-010',
        studentId: '9',
        studentName: 'Maurice Johnson',
        description: 'Sports Equipment Fee',
        amount: 22000,
        dueDate: '2024-03-05',
        status: 'pending',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
      },
      {
        id: 'pay-9-3',
        invoiceNumber: 'INV-2024-011',
        studentId: '9',
        studentName: 'Maurice Johnson',
        description: 'Art Club Annual Fee',
        amount: 30000,
        dueDate: '2024-02-28',
        status: 'pending',
        createdAt: '2024-01-28',
        updatedAt: '2024-01-28'
      },
      {
        id: 'pay-9-4',
        invoiceNumber: 'INV-2024-012',
        studentId: '9',
        studentName: 'Maurice Johnson',
        description: 'Science Lab Fee',
        amount: 15000,
        dueDate: '2024-02-22',
        status: 'paid',
        paymentDate: '2024-02-21',
        paymentMethod: 'cash',
        transactionId: 'TXN-005',
        createdAt: '2024-01-22',
        updatedAt: '2024-02-21'
      },
      {
        id: 'pay-9-5',
        invoiceNumber: 'INV-2024-013',
        studentId: '9',
        studentName: 'Maurice Johnson',
        description: 'School Trip Deposit',
        amount: 50000,
        dueDate: '2024-04-01',
        status: 'pending',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-01'
      }
    ];

    // Calculate payment summary
    const summary: PaymentSummary = {
      totalPaid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      totalOverdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
      upcomingPayments: payments
        .filter(p => p.status === 'pending' && new Date(p.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5)
    };

    return {
      status: 200,
      data: { payments, summary },
      message: 'Payments data fetched successfully'
    };
  },


  getGradeReports: async (): Promise<ApiResponse<StudentGradeReport[]>> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const gradeReports: StudentGradeReport[] = [
      {
        id: 'grade-3',
        studentId: '3',
        studentName: 'Alex Johnson',
        class: 'JSS 2',
        classArm: 'A',
        classTeacher: 'Mr. B. Smith',
        terms: [
          {
            term: 'First',
            attendance: {
              present: 85,
              total: 90,
              percentage: 94.4
            },
            remarks: {
              classTeacher: 'Alex has shown remarkable improvement in Mathematics and Basic Science. He needs to work on his English Language composition skills.',
              principal: 'A promising student with great potential. Keep up the good work.'
            },
            summary: {
              totalScore: 645,
              average: 71.7,
              position: 5,
              classSize: 35,
              grade: 'B'
            },
            subjects: [
              { subject: 'Mathematics', code: 'MTH', ca1: 18, ca2: 17, exam: 55, total: 90, grade: 'A', remark: 'Excellent', position: 2, classAverage: 68 },
              { subject: 'English Language', code: 'ENG', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B', remark: 'Good', position: 8, classAverage: 65 },
              { subject: 'Basic Science', code: 'BSC', ca1: 16, ca2: 15, exam: 52, total: 83, grade: 'B', remark: 'Very Good', position: 6, classAverage: 62 },
              { subject: 'Social Studies', code: 'SOS', ca1: 14, ca2: 13, exam: 45, total: 72, grade: 'C', remark: 'Good', position: 12, classAverage: 58 },
              { subject: 'Business Studies', code: 'BUS', ca1: 17, ca2: 16, exam: 50, total: 83, grade: 'B', remark: 'Very Good', position: 7, classAverage: 61 },
              { subject: 'Computer Studies', code: 'COM', ca1: 19, ca2: 18, exam: 56, total: 93, grade: 'A', remark: 'Excellent', position: 1, classAverage: 59 },
              { subject: 'Yoruba Language', code: 'YOR', ca1: 13, ca2: 12, exam: 42, total: 67, grade: 'C', remark: 'Fair', position: 15, classAverage: 55 },
              { subject: 'Christian Religious Studies', code: 'CRS', ca1: 16, ca2: 15, exam: 49, total: 80, grade: 'B', remark: 'Very Good', position: 9, classAverage: 63 },
              { subject: 'Creative Arts', code: 'CAT', ca1: 17, ca2: 16, exam: 51, total: 84, grade: 'B', remark: 'Very Good', position: 5, classAverage: 60 }
            ]
          },
          {
            term: 'Second',
            attendance: {
              present: 88,
              total: 92,
              percentage: 95.7
            },
            remarks: {
              classTeacher: 'Consistent performance across all subjects. Notable improvement in English Language.',
              principal: 'Maintain this excellent performance. Well done!'
            },
            summary: {
              totalScore: 685,
              average: 76.1,
              position: 3,
              classSize: 35,
              grade: 'A'
            },
            subjects: [
              { subject: 'Mathematics', code: 'MTH', ca1: 19, ca2: 18, exam: 58, total: 95, grade: 'A', remark: 'Excellent', position: 1, classAverage: 70 },
              { subject: 'English Language', code: 'ENG', ca1: 16, ca2: 15, exam: 52, total: 83, grade: 'B', remark: 'Very Good', position: 6, classAverage: 67 },
              { subject: 'Basic Science', code: 'BSC', ca1: 17, ca2: 16, exam: 54, total: 87, grade: 'B', remark: 'Excellent', position: 4, classAverage: 65 },
              { subject: 'Social Studies', code: 'SOS', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B', remark: 'Good', position: 10, classAverage: 60 },
              { subject: 'Business Studies', code: 'BUS', ca1: 18, ca2: 17, exam: 53, total: 88, grade: 'B', remark: 'Excellent', position: 3, classAverage: 63 },
              { subject: 'Computer Studies', code: 'COM', ca1: 20, ca2: 19, exam: 58, total: 97, grade: 'A', remark: 'Outstanding', position: 1, classAverage: 62 },
              { subject: 'Yoruba Language', code: 'YOR', ca1: 14, ca2: 13, exam: 45, total: 72, grade: 'C', remark: 'Good', position: 14, classAverage: 57 },
              { subject: 'Christian Religious Studies', code: 'CRS', ca1: 17, ca2: 16, exam: 52, total: 85, grade: 'B', remark: 'Excellent', position: 5, classAverage: 65 },
              { subject: 'Creative Arts', code: 'CAT', ca1: 18, ca2: 17, exam: 53, total: 88, grade: 'B', remark: 'Excellent', position: 4, classAverage: 63 }
            ]
          }
        ]
      },
      {
        id: 'grade-7',
        studentId: '7',
        studentName: 'Sarah Johnson',
        class: 'JSS 1',
        classArm: 'B',
        classTeacher: 'Mrs. A. Davis',
        terms: [
          {
            term: 'First',
            attendance: {
              present: 82,
              total: 90,
              percentage: 91.1
            },
            remarks: {
              classTeacher: 'Sarah shows great creativity in Creative Arts. Needs to improve in Mathematics.',
              principal: 'Good start. Focus on improving weak areas.'
            },
            summary: {
              totalScore: 598,
              average: 66.4,
              position: 12,
              classSize: 30,
              grade: 'C'
            },
            subjects: [
              { subject: 'Mathematics', code: 'MTH', ca1: 12, ca2: 11, exam: 40, total: 63, grade: 'C', remark: 'Fair', position: 18, classAverage: 65 },
              { subject: 'English Language', code: 'ENG', ca1: 16, ca2: 15, exam: 50, total: 81, grade: 'B', remark: 'Very Good', position: 8, classAverage: 68 },
              { subject: 'Basic Science', code: 'BSC', ca1: 14, ca2: 13, exam: 45, total: 72, grade: 'C', remark: 'Good', position: 12, classAverage: 63 },
              { subject: 'Social Studies', code: 'SOS', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B', remark: 'Good', position: 10, classAverage: 60 },
              { subject: 'Business Studies', code: 'BUS', ca1: 13, ca2: 12, exam: 42, total: 67, grade: 'C', remark: 'Fair', position: 16, classAverage: 59 },
              { subject: 'Computer Studies', code: 'COM', ca1: 14, ca2: 13, exam: 45, total: 72, grade: 'C', remark: 'Good', position: 14, classAverage: 58 },
              { subject: 'Yoruba Language', code: 'YOR', ca1: 17, ca2: 16, exam: 52, total: 85, grade: 'B', remark: 'Excellent', position: 5, classAverage: 56 },
              { subject: 'Christian Religious Studies', code: 'CRS', ca1: 16, ca2: 15, exam: 49, total: 80, grade: 'B', remark: 'Very Good', position: 9, classAverage: 64 },
              { subject: 'Creative Arts', code: 'CAT', ca1: 19, ca2: 18, exam: 55, total: 92, grade: 'A', remark: 'Outstanding', position: 2, classAverage: 61 }
            ]
          }
        ]
      },
      {
        id: 'grade-9',
        studentId: '9',
        studentName: 'Maurice Johnson',
        class: 'JSS 1',
        classArm: 'B',
        classTeacher: 'Mrs. A. Davis',
        terms: [
          {
            term: 'First',
            attendance: {
              present: 78,
              total: 90,
              percentage: 86.7
            },
            remarks: {
              classTeacher: 'Maurice needs to be more attentive in class. Good performance in practical subjects.',
              principal: 'Put more effort in your studies. You can do better.'
            },
            summary: {
              totalScore: 545,
              average: 60.6,
              position: 22,
              classSize: 30,
              grade: 'D'
            },
            subjects: [
              { subject: 'Mathematics', code: 'MTH', ca1: 10, ca2: 9, exam: 35, total: 54, grade: 'D', remark: 'Poor', position: 25, classAverage: 65 },
              { subject: 'English Language', code: 'ENG', ca1: 12, ca2: 11, exam: 40, total: 63, grade: 'C', remark: 'Fair', position: 20, classAverage: 68 },
              { subject: 'Basic Science', code: 'BSC', ca1: 13, ca2: 12, exam: 42, total: 67, grade: 'C', remark: 'Fair', position: 18, classAverage: 63 },
              { subject: 'Social Studies', code: 'SOS', ca1: 11, ca2: 10, exam: 38, total: 59, grade: 'D', remark: 'Poor', position: 24, classAverage: 60 },
              { subject: 'Business Studies', code: 'BUS', ca1: 14, ca2: 13, exam: 45, total: 72, grade: 'C', remark: 'Good', position: 15, classAverage: 59 },
              { subject: 'Computer Studies', code: 'COM', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B', remark: 'Good', position: 12, classAverage: 58 },
              { subject: 'Yoruba Language', code: 'YOR', ca1: 13, ca2: 12, exam: 42, total: 67, grade: 'C', remark: 'Fair', position: 17, classAverage: 56 },
              { subject: 'Christian Religious Studies', code: 'CRS', ca1: 12, ca2: 11, exam: 40, total: 63, grade: 'C', remark: 'Fair', position: 19, classAverage: 64 },
              { subject: 'Creative Arts', code: 'CAT', ca1: 16, ca2: 15, exam: 48, total: 79, grade: 'B', remark: 'Very Good', position: 10, classAverage: 61 }
            ]
          }
        ]
      }
    ];

    // console.log('Grade reports data loaded:', gradeReports);

    return {
      status: 200,
      data: gradeReports,
      message: 'Grade reports fetched successfully'
    };
  },
};
