import React from 'react'
import { ClassCard } from './components/ClassCard'
import Link from 'next/link'

const CourseOverviewPage = () => {
    return (
        <div className='min-h-screen'>
            <div className="relative w-full h-60 bg-gradient-primary text-primary-foreground rounded-b-full">
                <span className='absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-gradient-primary'>Course Overview</span>
            </div>
            <div className="px-20 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {[...Array(6)].map((data, i) => (
                        <Link key={i} href={`/course-overview/course-listing`}>
                            <ClassCard />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CourseOverviewPage