"use client";

import { CourseCard } from '@/components/global/courses/CourseCard'
import React, { useCallback, useEffect } from 'react'
import { formatToCurrency } from '../../../../lib/utils';
import { useInitializeCoursePurchase } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// import { useAuth } from '@/hooks/use-auth';

const CourseListingPage = () => {
    const { mutate, data, isPending, isError, error } = useInitializeCoursePurchase();
    // const { access_token } = useAuth();
    const router = useRouter()

    // console.log('access_token', access_token)

    const handlePayApplicationFee = useCallback((url: string) => {
        router.push(url);
    }, [router]);

    useEffect(() => {
        if (data?.status === 200) {
            // Redirect to payment page or show success message
            handlePayApplicationFee(data?.data?.authorizationUrl as string);
        } else if (isError) {
            // Handle error, e.g., show notification
            toast.error("Failed to initialize Enrollment",);
        }
    }, [data, isError, error, handlePayApplicationFee]);

    return (
        <div className='min-h-screen relative'>
            <div className="relative w-full h-60 bg-gradient-primary text-primary-foreground rounded-b-full">
                <span className='absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-gradient-primary'>Course Listing</span>
            </div>
            <div className="px-20 py-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                    {[...Array(9)].map((data, i) => (
                        <CourseCard key={i} />
                    ))}
                </div>
            </div>
            <div className="fixed right-5 top-1/4 px-10 py-5 bg-secondary text-secondary-foreground shadow-2xl gradient-secondary space-y-3 rounded-l-2xl text-center">
                <div className="font-bold text-xl">
                    {formatToCurrency(90000)}
                </div>
                {/* <Link href={`#`} className='text-2xl'>Enroll Now</Link> */}
                <Button
                    onClick={() => mutate()}
                    disabled={isPending}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center shadow-lg cursor-pointer"
                >
                    <CreditCard className="h-5 w-5 mr-3" />
                    <span>Enroll Now</span>
                    {(isPending)
                        ? (<Loader2 className="animate-spin" />)
                        : (<ArrowRight className="h-5 w-5 ml-3" />)
                    }
                </Button>
            </div>
        </div>
    )
}

export default CourseListingPage