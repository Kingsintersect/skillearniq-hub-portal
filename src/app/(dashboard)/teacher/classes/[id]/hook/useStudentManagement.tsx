import { useTeacherQueries } from "@/hooks/useTeacherQueries";

interface AttendanceData {
  daily: any[];
  monthly: any[];
  course_details: {
    id: number;
    fullname: string;
    shortname: string;
    idnumber: string;
    category: number;
    categoryName: string;
  };
}

export const useStudentManagement = (teacherId: number, filters: any) => {
    const { useStudents, useClasses, useAttendancePerCourse } = useTeacherQueries();

    const studentsQuery = useStudents(teacherId, filters);
    const classesQuery = useClasses(teacherId, { term: filters.term });
    const attendanceQuery = useAttendancePerCourse(teacherId, filters);

    // Debug logging
    console.log('=== DEBUG: useStudentManagement ===');
    console.log('Teacher ID:', teacherId);
    console.log('Filters:', filters);
    console.log('Class ID from filters:', filters?.classId);
    console.log('Students Query:', studentsQuery.data);
    console.log('Classes Query:', classesQuery.data);
    console.log('Attendance Query Status:', attendanceQuery.status);
    console.log('Attendance Query Data:', attendanceQuery.data);
    console.log('Attendance Query Error:', attendanceQuery.error);
    console.log('Is Attendance Loading:', attendanceQuery.isLoading);
    
    if (attendanceQuery.data) {
        console.log('Attendance Response Status:', attendanceQuery.data.status);
        console.log('Attendance Response Message:', attendanceQuery.data.message);
        console.log('Attendance Data:', attendanceQuery.data.data);
        
        // Type guard to check if data exists
        if (attendanceQuery.data.data) {
            console.log('Course Details:', attendanceQuery.data.data.course_details);
            console.log('Daily Count:', attendanceQuery.data.data.daily?.length);
            console.log('Monthly Count:', attendanceQuery.data.data.monthly?.length);
        }
    }
    console.log('=== END DEBUG ===');

    // Default attendance data
    const defaultAttendanceData: AttendanceData = {
        daily: [],
        monthly: [],
        course_details: {
            id: filters?.classId || 0,
            fullname: `Class ${filters?.classId || 'Unknown'}`,
            shortname: '',
            idnumber: '',
            category: 0,
            categoryName: ''
        }
    };

    // Extract attendance data with proper typing
    let attendanceData: AttendanceData = defaultAttendanceData;

    if (attendanceQuery.data?.data) {
        attendanceData = {
            daily: Array.isArray(attendanceQuery.data.data.daily) 
                ? attendanceQuery.data.data.daily 
                : [],
            monthly: Array.isArray(attendanceQuery.data.data.monthly) 
                ? attendanceQuery.data.data.monthly 
                : [],
            course_details: attendanceQuery.data.data.course_details || defaultAttendanceData.course_details
        };
    }

    return {
        students: Array.isArray(studentsQuery.data?.data) ? studentsQuery.data.data : [],
        classes: Array.isArray(classesQuery.data) ? classesQuery.data : [],
        attendance: attendanceData,
        isLoading: studentsQuery.isLoading || classesQuery.isLoading || attendanceQuery.isLoading,
        isError: studentsQuery.isError || classesQuery.isError || attendanceQuery.isError
    };
};