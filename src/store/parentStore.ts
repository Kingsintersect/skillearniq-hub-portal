import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for parent data
export interface ParentChild {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  studentId: string;
  relationship: string;
}

export interface ChildStats {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  enrollment_status: 'enrolled' | 'not_enrolled';
  enrolled_courses: number[];
  assignments: {
    upcoming: any[];
    overdue: any[];
  };
  payments: any[];
  grade: string;
  avgGrade: number;
  attendance: number;
  pendingAssignments: number;
}



export interface SubjectData {
  name: string;
  teacher: string;
  testScores: number[];
  quizScores: number[];
  examScore: number;
  assignments: Assignment[];
  attendance: number;
}

export interface Assignment {
  title: string;
  dueDate: string;
  status: 'submitted' | 'pending';
  score?: number;
}

export interface TeacherMessage {
  id: number;
  from: string;
  subject: string;
  message: string;
  date: string;
  student: string;
  studentId: string;
}

export interface PaymentRecord {
  id: number;
  student: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface ParentDashboardStats {
  childrenCount: number;
  childrenStats: ChildStats[];
}

interface Child {
  id: number;
  first_name: string;
  email: string;
  phone: string;
}

// Parent Dashboard Data interface
export interface ParentDashboardResponse {
  children: Child[];
}
// Parent Dashboard Data interface
export interface ParentChildrenResponse {
  children: ParentChild[];
}
// Combined Types
export interface Assignment {
  title: string;
  dueDate: string;
  status: 'submitted' | 'pending' //| 'late' | 'graded';
  score?: number;
}

export interface MoodleActivity {
  activity_id?: number;
  activity_name?: string;
  activity_type?: string;
  grade?: number;
  max_grade?: number;
}

export interface Course {
  // From first structure
  course_id?: number;
  course_name: string;
  course_code?: string;
  finalgrade?: number | null;
  activities?: MoodleActivity[];

  // From second structure
  teacher: string;
  testScores: number[];
  quizScores: number[];
  examScore: number;
  assignments: Assignment[];
  attendance: number;
}

export interface MoodleData {
  found: boolean;
  courses: Course[];
}

export interface ChildAcademicData {
  // Common fields
  id: number | string;
  name: string;
  email?: string;

  // From second structure
  class?: string;
  classTeacher?: string;
  groups?: string[];
  attendance?: number;
  courses: Course[];

  // From first structure
  moodle?: MoodleData;
}
export interface ReportChildrenResponse {
  children: ChildAcademicData[];
}



// types/payment.ts
export interface Payment {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  upcomingPayments: Payment[];
}

// Message types
export interface Message {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  content: string;
  sender: string;
  senderType: 'teacher' | 'admin' | 'system';
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'attendance' | 'behavior' | 'general' | 'payment';
}

// types/gradeReport.ts
export interface SubjectGrade {
  subject: string;
  code: string;
  ca1: number; // Continuous Assessment 1
  ca2: number; // Continuous Assessment 2
  exam: number;
  total: number;
  grade: string;
  remark: string;
  position: number;
  classAverage: number;
}

export interface TermGrade {
  term: 'First' | 'Second' | 'Third';
  subjects: SubjectGrade[];
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  remarks: {
    classTeacher: string;
    principal: string;
  };
  summary: {
    totalScore: number;
    average: number;
    position: number;
    classSize: number;
    grade: string;
  };
}

export interface StudentGradeReport {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  classArm: string;
  classTeacher: string;
  terms: TermGrade[];
}

export interface GradeSummary {
  studentId: string;
  studentName: string;
  class: string;
  currentTerm: string;
  currentAverage: number;
  currentGrade: string;
  currentPosition: number;
  classSize: number;
  improvement: 'improved' | 'declined' | 'maintained';
  trend: number; // percentage change from previous term
}

export type ExportFormat = 'pdf' | 'csv' | 'excel';

interface ParentStore {
  selectedStudentId: string | null;
  selectedChild: ParentChild | null;
  children: ParentChild[];
  setSelectedStudentId: (id: string | null) => void;
  setSelectedChild: (child: ParentChild) => void;
  setChildren: (children: ParentChild[]) => void;

  // PERFORMANCE REPORT
  allReports: ChildAcademicData[];
  selectedReport: ChildAcademicData | null;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  setAllReports: (reports: ChildAcademicData[]) => void;
  setSelectedReport: (report: ChildAcademicData | null) => void;

  /// MESSAGES
  messages: Message[];
  selectedMessage: Message | null;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  setSelectedMessage: (message: Message | null) => void;
  setMessages: (messages: Message[]) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadCount: (studentId?: string) => number;

  // ACADEMIC REPORT


  // React Query synchronization
  isReportsLoading: boolean;
  reportsError: string | null;
  setReportsLoading: (loading: boolean) => void;
  setReportsError: (error: string | null) => void;

  // PAYMENTS
  payments: Payment[];
  paymentSummary: PaymentSummary | null;
  selectedPayment: Payment | null;
  filteredPayments: Payment[];
  paymentFilters: {
    status: string;
    dateRange: {
      from: string;
      to: string;
    };
  };

  // Payment actions
  setPayments: (payments: Payment[]) => void;
  setPaymentSummary: (summary: PaymentSummary) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  setFilteredPayments: (payments: Payment[]) => void;
  setPaymentFilters: (filters: Partial<ParentStore['paymentFilters']>) => void;
  clearPaymentFilters: () => void;

  // Payment utilities
  getPaymentsByStudentId: (studentId: string) => Payment[];
  getPaymentById: (paymentId: string) => Payment | undefined;
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => void;

  // Payment loading states
  isPaymentsLoading: boolean;
  paymentsError: string | null;
  setPaymentsLoading: (loading: boolean) => void;
  setPaymentsError: (error: string | null) => void;

  // Messages loading states
  isMessagesLoading: boolean;
  messagesError: string | null;
  setMessagesLoading: (loading: boolean) => void;
  setMessagesError: (error: string | null) => void;



  // GRADE REPORTS
  gradeReports: StudentGradeReport[];
  selectedGradeReport: StudentGradeReport | null;
  selectedGradeReportId: string | null;
  gradeSummary: GradeSummary | null;

  // Grade Report actions
  setGradeReports: (reports: StudentGradeReport[]) => void;
  setSelectedGradeReport: (report: StudentGradeReport | null) => void;
  setSelectedGradeReportId: (id: string | null) => void;
  setGradeSummary: (summary: GradeSummary | null) => void;

  // Grade Report loading states
  isGradeReportsLoading: boolean;
  gradeReportsError: string | null;
  setGradeReportsLoading: (loading: boolean) => void;
  setGradeReportsError: (error: string | null) => void;
}

export const useParentStore = create<ParentStore>()(
  persist(
    (set, get) => ({
      selectedStudentId: null,
      children: [],
      selectedChild: null,
      setSelectedStudentId: (id) => set({ selectedStudentId: id }),
      setSelectedChild: (child) => set({ selectedChild: child }),
      setChildren: (children) => set({ children }),

      // PERFORMANCE REPORT
      allReports: [],
      selectedReport: null,
      selectedReportId: null,
      setSelectedReportId: (id) => set({ selectedReportId: id }),
      setAllReports: (reports) => set({ allReports: reports }),
      setSelectedReport: (report) => set({
        selectedReport: report,
        selectedReportId: report?.id.toString() || null
      }),

      // MESSAGES
      messages: [],
      selectedMessage: null,
      selectedMessageId: null,
      setSelectedMessageId: (id) => set({
        selectedMessageId: id,
        selectedMessage: id ? get().messages.find(msg => msg.id === id) || null : null
      }),
      setSelectedMessage: (message) => set({
        selectedMessage: message,
        selectedMessageId: message?.id || null
      }),
      setMessages: (messages) => set({ messages }),
      markMessageAsRead: (messageId: string) =>
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          ),
          selectedMessage: state.selectedMessage?.id === messageId
            ? { ...state.selectedMessage, isRead: true }
            : state.selectedMessage
        })),
      getUnreadCount: (studentId?: string) => {
        const state = get();
        const messages = studentId
          ? state.messages.filter(msg => msg.studentId === studentId)
          : state.messages;
        return messages.filter(msg => !msg.isRead).length;
      },

      // React Query sync states
      isReportsLoading: false,
      reportsError: null,
      setReportsLoading: (isReportsLoading) => set({ isReportsLoading }),
      setReportsError: (reportsError) => set({ reportsError }),

      // PAYMENTS
      payments: [],
      paymentSummary: null,
      selectedPayment: null,
      filteredPayments: [],
      paymentFilters: {
        status: 'all',
        dateRange: {
          from: '',
          to: ''
        }
      },

      // Payment actions
      setPayments: (payments) => set({ payments }),
      setPaymentSummary: (paymentSummary) => set({ paymentSummary }),
      setSelectedPayment: (selectedPayment) => set({ selectedPayment }),
      setFilteredPayments: (filteredPayments) => set({ filteredPayments }),
      setPaymentFilters: (filters) => set((state) => ({
        paymentFilters: { ...state.paymentFilters, ...filters }
      })),
      clearPaymentFilters: () => set({
        paymentFilters: {
          status: 'all',
          dateRange: { from: '', to: '' }
        }
      }),

      // Payment utilities
      getPaymentsByStudentId: (studentId: string) => {
        const state = get();
        return state.payments.filter(payment => payment.studentId === studentId);
      },

      getPaymentById: (paymentId: string) => {
        const state = get();
        return state.payments.find(payment => payment.id === paymentId);
      },

      updatePaymentStatus: (paymentId: string, status: Payment['status']) =>
        set((state) => ({
          payments: state.payments.map(payment =>
            payment.id === paymentId
              ? {
                ...payment,
                status,
                paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : payment.paymentDate,
                updatedAt: new Date().toISOString()
              }
              : payment
          ),
          filteredPayments: state.filteredPayments.map(payment =>
            payment.id === paymentId
              ? {
                ...payment,
                status,
                paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : payment.paymentDate,
                updatedAt: new Date().toISOString()
              }
              : payment
          ),
          selectedPayment: state.selectedPayment?.id === paymentId
            ? {
              ...state.selectedPayment,
              status,
              paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : state.selectedPayment.paymentDate,
              updatedAt: new Date().toISOString()
            }
            : state.selectedPayment
        })),

      // GRADE REPORTS
      gradeReports: [],
      selectedGradeReport: null,
      selectedGradeReportId: null,
      gradeSummary: null,

      // Grade Report actions
      setGradeReports: (gradeReports) => set({ gradeReports }),
      setSelectedGradeReport: (selectedGradeReport) => set({ selectedGradeReport }),
      setSelectedGradeReportId: (selectedGradeReportId) => set({ selectedGradeReportId }),
      setGradeSummary: (gradeSummary) => set({ gradeSummary }),

      // Grade Report loading states
      isGradeReportsLoading: false,
      gradeReportsError: null,
      setGradeReportsLoading: (isGradeReportsLoading) => set({ isGradeReportsLoading }),
      setGradeReportsError: (gradeReportsError) => set({ gradeReportsError }),

      // Payment loading states
      isPaymentsLoading: false,
      paymentsError: null,
      setPaymentsLoading: (isPaymentsLoading) => set({ isPaymentsLoading }),
      setPaymentsError: (paymentsError) => set({ paymentsError }),

      // Messages loading states
      isMessagesLoading: false,
      messagesError: null,
      setMessagesLoading: (isMessagesLoading) => set({ isMessagesLoading }),
      setMessagesError: (messagesError) => set({ messagesError }),
    }),
    {
      name: 'parent-storage',
      partialize: (state) => ({
        selectedStudentId: state.selectedStudentId,
        children: state.children,
        allReports: state.allReports,
        selectedReportId: state.selectedReportId,
        payments: state.payments,
        paymentSummary: state.paymentSummary,
        messages: state.messages,
        selectedMessageId: state.selectedMessageId,
        selectedMessage: state.selectedMessage,
        selectedChild: state.selectedChild,
        gradeReports: state.gradeReports,
        selectedGradeReportId: state.selectedGradeReportId,
        gradeSummary: state.gradeSummary,
      }),
    }
  )
);
