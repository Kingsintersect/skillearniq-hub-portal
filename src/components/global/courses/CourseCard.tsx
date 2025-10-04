import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useInitializeCoursePurchase } from '@/hooks/usePayments'
import { CategoryCourse } from '@/lib/services/courseServices'
import { formatToCurrency } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

export const CourseCard = ({ courses }: { courses: CategoryCourse }) => {
    const { mutate, data, isPending, isError, error } = useInitializeCoursePurchase();

    return (
        <Card
            className='pt-0 shadow-xl border-0 cursor-pointer hover:scale-[1.02] transition-transform'
            onClick={() => mutate({
                courseId: courses.id,
                amount: 20000,
            })}
        >
            <CardHeader className='relative w-full h-40 '>
                <Image
                    alt='Course Image'
                    src={`/course/probability.png`}
                    fill
                    className='rounded-t-lg'
                />
            </CardHeader>
            <CardContent>
                <div className='text-primary-500 text-xl font-bold'>{courses.fullname}</div>
                <div className='text-mute text-xl text-accent-700 font-bold'>Mr. Alfred</div>
                <div className='text-mute'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis omnis provident cupiditate aut ipsum doloribus minima dolorem laudantium deleniti animi!</div>
            </CardContent>
            <CardFooter>
                <p className='text-accent font-bold'>{formatToCurrency(20000)}</p>
                {isPending && <p className='text-sm text-blue-600 ml-5'><LoadingSpinner /></p>}
                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error.message}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
