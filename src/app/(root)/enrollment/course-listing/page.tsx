"use client";

import { CourseCard } from '@/components/global/courses/CourseCard'
import React from 'react'
import { useCategoriesCourse } from '@/hooks/useAccademics';

const CourseListingPage = () => {
    const { data: categoriesCourse, isSuccess: isCoursesLoading } = useCategoriesCourse();

    return (
        <div className='min-h-screen relative'>
            <div className="relative w-full h-60 bg-gradient-primary text-primary-foreground rounded-b-full">
                <span className='absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-gradient-primary'>Course Listing</span>
            </div>
            <div className="px-20 py-10 max-w-7xl mx-auto">
                {(!isCoursesLoading)
                    ? <div>Loading...</div>
                    : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                        {categoriesCourse?.map((data, i) => (
                            <CourseCard courses={data} key={i} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default CourseListingPage