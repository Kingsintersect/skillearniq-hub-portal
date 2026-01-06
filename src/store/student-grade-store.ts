
import { create } from 'zustand';
import { StudentGradeStore, StudentGradeData, Grade } from '@/types/student-grades';
import { studentService, MoodleCourse } from '@/lib/services/studentService';
import { toast } from 'sonner';

const getLetterGrade = (percentage: number): Grade => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const useStudentGradeStore = create<StudentGradeStore>((set, get) => ({
  courses: [],
  selectedCourse: '',
  gradeData: [],
  isLoading: false,
  error: null,
  courseInfo: null,

  // Fetch student's enrolled courses
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await studentService.getEnrolledCourses();
      
      console.log('Student Courses API Response:', response);
      
      if (response.status === 200 || response.status === 201) {
        const courses = response.data.map((course: MoodleCourse) => ({
          id: course.id.toString(),
          name: course.fullname || course.shortname || '',
          course_code: course.shortname || course.idnumber || '',
          shortname: course.shortname,
          category: course.category?.toString() || '0',
          summary: course.summary || ''
        }));
        
        console.log('Processed student courses:', courses);
        
        set({ 
          courses: courses, 
          isLoading: false,
          error: null 
        });
        
        if (courses.length > 0) {
          toast.success(`Loaded ${courses.length} enrolled courses`);
        } else {
          toast.info('No courses enrolled yet');
        }
      } else {
        const errorMsg = response.message || 'Failed to fetch courses';
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
      const response = await studentService.getCourseGrades(parseInt(selectedCourse));
      
      console.log('Student Grades API Response:', response);
      
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

        // Get current student ID
        const getCurrentStudentId = (): number => {
          if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const user = JSON.parse(userData);
                return user.id || user.user_id || 0;
              } catch (e) {
                console.error('Error parsing user data:', e);
              }
            }
          }
          return 0;
        };

        const currentStudentId = getCurrentStudentId();
        
        // Filter to get only the current student's data
        const currentStudent = courseData.students.find((student: any) => 
          student.student_id === currentStudentId
        );

        let students: StudentGradeData[] = [];
        
        if (currentStudent) {
          let assignmentScore = 0;
          let quizScore = 0;
          let examScore = currentStudent.final_grade || 0;
          
          if (Array.isArray(currentStudent.activities)) {
            currentStudent.activities.forEach((activity: any) => {
              if (activity.type === 'assign') {
                assignmentScore = Math.max(assignmentScore, activity.grade || 0);
              } else if (activity.type === 'quiz') {
                quizScore = Math.max(quizScore, activity.grade || 0);
              }
            });
          }

          const total = currentStudent.final_grade || 0;
          const studentUsername = currentStudent.student_username || '';
          const nameParts = studentUsername.split('.');
          const firstName = nameParts[0] || 'Student';
          const lastName = nameParts[1] || '';

          const grade: Grade = currentStudent.letter_grade as Grade || getLetterGrade(total);

          students = [{
            id: '1',
            email: currentStudent.student_email || '',
            firstName: firstName,
            lastName: lastName,
            assignment: assignmentScore,
            quiz: quizScore,
            exam: examScore,
            total: total,
            grade: grade
          }];
        }

        set({ 
          gradeData: students, 
          isLoading: false,
          error: null 
        });
        
        if (students.length > 0) {
          toast.success(`Loaded your grade information for this course`);
        } else {
          toast.info('No grade data available for you in this course');
        }
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