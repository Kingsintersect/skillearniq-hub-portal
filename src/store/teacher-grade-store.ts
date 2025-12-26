// store/teacher-grade-store.ts
import { create } from 'zustand';
import { TeacherGradeStore, StudentGradeData, Grade } from '@/types/teacher-grades';
import { teacherService } from '@/lib/services/teacherService';
import { toast } from 'sonner';

const getLetterGrade = (percentage: number): Grade => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const useTeacherGradeStore = create<TeacherGradeStore>((set, get) => ({
  courses: [],
  selectedCourse: '',
  gradeData: [],
  isLoading: false,
  error: null,
  courseInfo: null,

  // Fetch teacher's assigned courses using existing getClasses method
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    
    const getCurrentTeacherId = (): number => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            return user.id || 22;
          } catch (e) {
            console.error('Error parsing user data:', e);
            return 22;
          }
        }
      }
      return 22;
    };

    try {
      const teacherId = getCurrentTeacherId();
      
      // Use the existing getClasses method that works in AssessmentsPage
      const classesData = await teacherService.getClasses(teacherId);
      
      console.log('Teacher Courses Raw Response:', classesData);
      
      // teacherService.getClasses returns the data directly (not wrapped in ApiResponse)
      if (Array.isArray(classesData)) {
        const courses = classesData.map((course: any) => ({
          id: course.id.toString(),
          name: course.name,
          course_code: course.shortName || course.code,
          shortname: course.shortName,
          category: course.category?.toString() || '0',
          studentCount: course.studentCount,
          term: course.term,
          academicYear: course.academicYear,
          progress: course.progress,
          averageGrade: course.averageGrade,
          room: course.room,
          schedule: course.schedule,
          subject: course.subject,
          level: course.level,
          arm: course.arm
        }));
        
        console.log('Processed teacher courses:', courses);
        
        set({ 
          courses: courses, 
          isLoading: false,
          error: null 
        });
        
        if (courses.length > 0) {
          toast.success(`Loaded ${courses.length} assigned courses`);
        } else {
          toast.info('No courses assigned to you');
        }
      } else {
        console.error('Unexpected response structure from getClasses:', classesData);
        const errorMsg = 'Invalid course data structure received';
        set({ 
          error: errorMsg, 
          isLoading: false 
        });
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Error in fetchCourses:', error);
      const errorMsg = error.message || 'Network error while fetching courses';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      toast.error(errorMsg);
    }
  },

  setSelectedCourse: (courseId: string) => {
    set({ 
      selectedCourse: courseId,
      gradeData: [],
      courseInfo: null,
      error: null
    });
  },

  setGradeData: (data: StudentGradeData[]) => {
    set({ gradeData: data });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // Fetch grade data for selected course
  fetchGradeData: async () => {
    const { selectedCourse } = get();
    if (!selectedCourse) {
      const errorMsg = 'Please select a course first';
      set({ error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    set({ 
      isLoading: true, 
      error: null, 
      gradeData: [], 
      courseInfo: null 
    });

    try {
      const response = await teacherService.getCourseGrades(parseInt(selectedCourse));
      
      console.log('Teacher Grades API Response:', response);
      
      if (response.status === 200 || response.status === 201) {
        const courseData = response.data;
        
        set({ 
          courseInfo: {
            course_id: courseData.course_id,
            course_code: courseData.course_code || '',
            course_name: courseData.course_name || '',
            course_image_url: courseData.course_image_url || '',
            instructors: courseData.instructors || []
          }
        });

        const students: StudentGradeData[] = courseData.students.map((student: any, index: number) => {
          let assignmentScore = 0;
          let quizScore = 0;
          let examScore = student.final_grade || 0;
          
          if (Array.isArray(student.activities)) {
            student.activities.forEach((activity: any) => {
              if (activity.type === 'assign') {
                assignmentScore = Math.max(assignmentScore, activity.grade || 0);
              } else if (activity.type === 'quiz') {
                quizScore = Math.max(quizScore, activity.grade || 0);
              }
            });
          }

          const total = student.final_grade || 0;
          const studentUsername = student.student_username || '';
          const nameParts = studentUsername.split('.');
          const firstName = nameParts[0] || 'Student';
          const lastName = nameParts[1] || (index + 1).toString();

          const grade: Grade = student.letter_grade as Grade || getLetterGrade(total);

          return {
            id: (index + 1).toString(),
            email: student.student_email || '',
            firstName: firstName,
            lastName: lastName,
            assignment: assignmentScore,
            quiz: quizScore,
            exam: examScore,
            total: total,
            grade: grade
          };
        });

        set({ 
          gradeData: students, 
          isLoading: false,
          error: null 
        });
        toast.success(`Loaded ${students.length} student records`);
      } else {
        const errorMsg = response.message || 'Failed to fetch grade data';
        set({ 
          error: errorMsg, 
          isLoading: false 
        });
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Error in fetchGradeData:', error);
      const errorMsg = error.message || 'Network error while fetching grades';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      toast.error(errorMsg);
    }
  },

  getLetterGrade: (percentage: number): Grade => {
    return getLetterGrade(percentage);
  },

  resetState: () => {
    set({
      selectedCourse: '',
      courses: [],
      gradeData: [],
      courseInfo: null,
      error: null,
    });
  },
}));