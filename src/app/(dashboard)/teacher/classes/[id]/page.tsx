'use client';
import React, { useMemo, useState } from 'react'
import { StudentListDetails } from '../components/StudentListDetails'
import { useClassAssessments, useClassStudentsInfinite, useStudentPerformance, useTeacherClasses } from '@/hooks/use-classes';
import { useParams } from 'next/navigation';

const CourseDetailsPage = () => {
    const params = useParams();
    const courseId = parseInt(params.id as string);
    const [studentSearch, setStudentSearch] = useState('');
    const [filters, setFilters] = useState({
        term: '1st',
    });
    const currentTeacherId = 1;
    const { data: classes } = useTeacherClasses(currentTeacherId, filters);

    const {
        data: studentsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: studentsLoading
    } = useClassStudentsInfinite(courseId || 0, studentSearch);

    const { data: assessments } = useClassAssessments(courseId || 0);
    const { data: performanceData } = useStudentPerformance(courseId || 0);

    const allStudents = useMemo(() => {
        return studentsData?.pages.flatMap(page => page.students) || [];
    }, [studentsData]);

    const selectedClassData = classes?.find(cls => cls.id === courseId);

    return (
        <StudentListDetails
            class={selectedClassData}
            students={allStudents}
            studentSearch={studentSearch}
            onStudentSearchChange={setStudentSearch}
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage}
            isLoading={studentsLoading}
            isFetchingMore={isFetchingNextPage}
            assessments={assessments || []}
            performanceData={performanceData || []}
        />
    )
}

export default CourseDetailsPage