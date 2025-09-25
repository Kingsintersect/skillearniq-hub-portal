import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { formatToCurrency } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

export const CourseCard = () => {
    return (
        <Card className='pt-0 shadow-xl border-0'>
            <CardHeader className='relative w-full h-40 '>
                <Image
                    alt='Course Image'
                    src={`/course/probability.png`}
                    fill
                    className='rounded-t-lg'
                />
            </CardHeader>
            <CardContent>
                <div className='text-primary-500 text-xl font-bold'>English Language</div>
                <div className='text-mute text-xl text-secondary-700 font-bold'>Mr. Alfred</div>
                <div className='text-mute'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis omnis provident cupiditate aut ipsum doloribus minima dolorem laudantium deleniti animi!</div>
            </CardContent>
            <CardFooter>
                <p className='text-secondary font-bold'>{formatToCurrency(10000)}</p>
            </CardFooter>
        </Card>
    )
}
