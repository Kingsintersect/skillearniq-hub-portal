import { Card, CardContent } from '@/components/ui/card'
import { School2Icon } from 'lucide-react'
import React from 'react'

export const ClassCard = () => {
    return (
        <Card className='cursor-pointer border-none shadow-lg'>
            <CardContent className='text-center space-y-5 py-10'>
                <div className="flex justify-center mb-4">
                    <School2Icon size={60} className="text-blue-800 animate-pulse" />
                </div>
                <p className="text-primary-600 text-2xl ">JSS 1 Courses</p>
            </CardContent>
        </Card>
    )
}
