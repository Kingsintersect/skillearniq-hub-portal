// store/gradeStore.ts
import { create } from 'zustand';
import { GradeStore, Student } from '@/types/grades';
import { gradeService } from '@/lib/services/admin/gradeService';
import { toast } from 'sonner';

const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const useGradeStore = create<GradeStore>((set, get) => ({
  courseCategories: [],
  courses: [],
  selectedCategory: '',
  selectedCourse: '',
  gradeData: [],
  isLoading: false,
  error: null,
  courseInfo: null,

  // FIXED: fetchCategories function with better error handling
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await gradeService.getCourseCategories();
      
      console.log('Categories API Response:', response); // Debug log
      
      if (response.status === 200 || response.status === 201) {
        const categories = response.data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name
        }));
        
        console.log('Processed categories:', categories); // Debug log
        
        set({ 
          courseCategories: categories, 
          isLoading: false,
          error: null 
        });
        
        // Show success toast only if we actually got categories
        if (categories.length > 0) {
          toast.success(`Loaded ${categories.length} categories`);
        } else {
          toast.info('No categories available');
        }
      } else {
        const errorMsg = response.message || 'Failed to fetch categories';
        set({ 
          error: errorMsg, 
          isLoading: false 
        });
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Error in fetchCategories:', error); // Debug log
      const errorMsg = error.message || 'Network error while fetching categories';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      toast.error(errorMsg);
    }
  },

  // FIXED: setSelectedCategory with better error handling
  setSelectedCategory: async (categoryId: string) => {
    set({ 
      selectedCategory: categoryId,
      selectedCourse: '',
      courses: [],
      gradeData: [],
      courseInfo: null,
      error: null
    });

    if (!categoryId) return;

    set({ isLoading: true });

    try {
      const response = await gradeService.getCoursesByCategory(parseInt(categoryId));
      
      console.log('Courses API Response:', response); // Debug log
      
      if (response.status === 200 || response.status === 201) {
        const courses = response.data.map((course: any) => ({
          id: course.id.toString(),
          name: course.fullname,
          category: course.category.toString(),
          course_code: course.shortname
        }));
        
        console.log('Processed courses:', courses); // Debug log
        
        set({ 
          courses, 
          isLoading: false,
          error: null 
        });
        
        if (courses.length > 0) {
          toast.success(`Found ${courses.length} courses`);
        } else {
          toast.info('No courses available for this category');
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
      console.error('Error in setSelectedCategory:', error); // Debug log
      const errorMsg = error.message || 'Network error while fetching courses';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      toast.error(errorMsg);
    }
  },

  setSelectedCourse: (courseId: string) => {
    set({ selectedCourse: courseId });
  },

  setGradeData: (data: Student[]) => {
    set({ gradeData: data });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // FIXED: fetchGradeData with better error handling
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
      const response = await gradeService.getCourseGrades(parseInt(selectedCourse));
      
      console.log('Grades API Response:', response); // Debug log
      
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

        const students: Student[] = courseData.students.map((student: any, index: number) => {
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

          return {
            id: (index + 1).toString(),
            email: student.student_email || '',
            firstName: firstName,
            lastName: lastName,
            assignment: assignmentScore,
            quiz: quizScore,
            exam: examScore,
            total: total,
            grade: student.letter_grade || getLetterGrade(total)
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
      console.error('Error in fetchGradeData:', error); // Debug log
      const errorMsg = error.message || 'Network error while fetching grades';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      toast.error(errorMsg);
    }
  },

  getLetterGrade: (percentage: number): string => {
    return getLetterGrade(percentage);
  },

  resetState: () => {
    set({
      selectedCategory: '',
      selectedCourse: '',
      courses: [],
      gradeData: [],
      courseInfo: null,
      error: null,
    });
  },
}));