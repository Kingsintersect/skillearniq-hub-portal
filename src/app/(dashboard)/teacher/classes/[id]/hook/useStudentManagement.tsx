"use"

import { useTeacherQueries } from "@/hooks/useTeacherQueries";

// Custom hooks for student management
export const useStudentManagement = (teacherId: number, filters: any) => {
    const { useStudents, useClasses, useAttendance, useGroups } = useTeacherQueries();

    const studentsQuery = useStudents(teacherId, filters);
    const classesQuery = useClasses(teacherId, filters);
    const attendanceQuery = useAttendance(teacherId, filters);
    const groupsQuery = useGroups(teacherId, filters.classId);
    // console.log('Students Query Data:', studentsQuery.data);
    // console.log('Classes Query Data:', classesQuery.data);
    // console.log('Groups Query Data:', groupsQuery.data);
    // console.log('Attendance Query Data:', attendanceQuery.data);


    return {
        students: studentsQuery.data?.data || [],
        classes: classesQuery.data?.data || [],
        groups: groupsQuery.data?.data || [],
        attendance: attendanceQuery.data?.data || { daily: [], monthly: [] },
        isLoading: studentsQuery.isLoading || classesQuery.isLoading || groupsQuery.isLoading,
        isError: studentsQuery.isError || classesQuery.isError
    };
};