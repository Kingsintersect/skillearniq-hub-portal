// store/parentStore.ts
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
  email?: string;
  phone?: string;
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

export interface Assignment {
  title: string;
  dueDate: string;
  status: 'submitted' | 'pending';
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
  // From first structure (from Moodle API)
  course_id?: number;
  course_name: string;
  course_code?: string;
  finalgrade?: number | null;
  activities?: MoodleActivity[];

  // From second structure (from your academic system) - make these optional
  teacher?: string;
  testScores?: number[];
  quizScores?: number[];
  examScore?: number;
  assignments?: Assignment[];
  attendance?: number;
}

export interface MoodleData {
  found: boolean;
  courses: Course[];
}

export interface ChildAcademicData {
  id: number | string;
  name: string;
  email?: string;
  class?: string;
  classTeacher?: string;
  groups?: string[];
  attendance?: number;
  courses: Course[];
  moodle?: MoodleData;
}

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

export interface SubjectGrade {
  subject: string;
  code: string;
  ca1: number;
  ca2: number;
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
  trend: number;
}

export interface ParentDashboardStats {
  childrenCount: number;
  childrenStats: ChildStats[];
}

export type ExportFormat = 'pdf' | 'csv' | 'excel';

interface ParentStore {
  // CHILDREN MANAGEMENT
  selectedStudentId: string | null;
  selectedChild: ParentChild | null;
  children: ParentChild[];
  setSelectedStudentId: (id: string | null) => void;
  setSelectedChild: (child: ParentChild) => void;
  setChildren: (children: ParentChild[]) => void;
  
  // DASHBOARD STATS
  dashboardStats: ParentDashboardStats | null;
  setDashboardStats: (stats: ParentDashboardStats | null) => void;

  // PERFORMANCE REPORT
  allReports: ChildAcademicData[];
  selectedReport: ChildAcademicData | null;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  setAllReports: (reports: ChildAcademicData[]) => void;
  setSelectedReport: (report: ChildAcademicData | null) => void;

  // MESSAGES
  messages: Message[];
  selectedMessage: Message | null;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  setSelectedMessage: (message: Message | null) => void;
  setMessages: (messages: Message[]) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadCount: (studentId?: string) => number;

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
  setPayments: (payments: Payment[]) => void;
  setPaymentSummary: (summary: PaymentSummary) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  setFilteredPayments: (payments: Payment[]) => void;
  setPaymentFilters: (filters: Partial<ParentStore['paymentFilters']>) => void;
  clearPaymentFilters: () => void;
  getPaymentsByStudentId: (studentId: string) => Payment[];
  getPaymentById: (paymentId: string) => Payment | undefined;
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => void;

  // GRADE REPORTS
  gradeReports: StudentGradeReport[];
  selectedGradeReport: StudentGradeReport | null;
  selectedGradeReportId: string | null;
  gradeSummary: GradeSummary | null;
  setGradeReports: (reports: StudentGradeReport[]) => void;
  setSelectedGradeReport: (report: StudentGradeReport | null) => void;
  setSelectedGradeReportId: (id: string | null) => void;
  setGradeSummary: (summary: GradeSummary | null) => void;

  // LOADING STATES
  isReportsLoading: boolean;
  reportsError: string | null;
  setReportsLoading: (loading: boolean) => void;
  setReportsError: (error: string | null) => void;
  
  isPaymentsLoading: boolean;
  paymentsError: string | null;
  setPaymentsLoading: (loading: boolean) => void;
  setPaymentsError: (error: string | null) => void;
  
  isMessagesLoading: boolean;
  messagesError: string | null;
  setMessagesLoading: (loading: boolean) => void;
  setMessagesError: (error: string | null) => void;
  
  isGradeReportsLoading: boolean;
  gradeReportsError: string | null;
  setGradeReportsLoading: (loading: boolean) => void;
  setGradeReportsError: (error: string | null) => void;
}

export const useParentStore = create<ParentStore>()(
  persist(
    (set, get) => ({
      // CHILDREN MANAGEMENT
      selectedStudentId: null,
      children: [],
      selectedChild: null,
      setSelectedStudentId: (id) => set({ selectedStudentId: id }),
      setSelectedChild: (child) => set({ 
        selectedChild: child,
        selectedStudentId: child.id.toString()
      }),
      setChildren: (children) => set({ children }),
      
      // DASHBOARD STATS
      dashboardStats: null,
      setDashboardStats: (dashboardStats) => set({ dashboardStats }),

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
      setGradeReports: (gradeReports) => set({ gradeReports }),
      setSelectedGradeReport: (selectedGradeReport) => set({ selectedGradeReport }),
      setSelectedGradeReportId: (selectedGradeReportId) => set({ selectedGradeReportId }),
      setGradeSummary: (gradeSummary) => set({ gradeSummary }),

      // LOADING STATES
      isReportsLoading: false,
      reportsError: null,
      setReportsLoading: (isReportsLoading) => set({ isReportsLoading }),
      setReportsError: (reportsError) => set({ reportsError }),
      
      isPaymentsLoading: false,
      paymentsError: null,
      setPaymentsLoading: (isPaymentsLoading) => set({ isPaymentsLoading }),
      setPaymentsError: (paymentsError) => set({ paymentsError }),
      
      isMessagesLoading: false,
      messagesError: null,
      setMessagesLoading: (isMessagesLoading) => set({ isMessagesLoading }),
      setMessagesError: (messagesError) => set({ messagesError }),
      
      isGradeReportsLoading: false,
      gradeReportsError: null,
      setGradeReportsLoading: (isGradeReportsLoading) => set({ isGradeReportsLoading }),
      setGradeReportsError: (gradeReportsError) => set({ gradeReportsError }),
    }),
    {
      name: 'parent-storage',
      partialize: (state) => ({
        selectedStudentId: state.selectedStudentId,
        children: state.children,
        selectedChild: state.selectedChild,
        allReports: state.allReports,
        selectedReportId: state.selectedReportId,
        payments: state.payments,
        paymentSummary: state.paymentSummary,
        messages: state.messages,
        selectedMessageId: state.selectedMessageId,
        gradeReports: state.gradeReports,
        selectedGradeReportId: state.selectedGradeReportId,
        gradeSummary: state.gradeSummary,
        dashboardStats: state.dashboardStats,
      }),
    }
  )
);