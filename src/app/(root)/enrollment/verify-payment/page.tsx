"use client";

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useVerifyCoursePurchase } from '@/hooks/usePayments';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuthContext } from '@/providers/AuthProvider';

const VerifyPaymentPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuthContext();

    // Extract all parameters from URL
    const verifyCredentials = {
        transAmount: searchParams.get('transAmount') || '',
        reference: searchParams.get('reference') || '',
        transRef: searchParams.get('transRef') || '',
        processorFee: searchParams.get('processorFee') || '',
        errorMessage: searchParams.get('errorMessage') || '',
        currency: searchParams.get('currency') || '',
        gateway: searchParams.get('gateway') || '',
        status: searchParams.get('status') || '',
    };

    const { data, isLoading, isError, error } = useVerifyCoursePurchase(verifyCredentials);


    // useEffect(() => {
    //     if (data && data.status === "Successful") {
    //         // Wait 2 seconds then redirect to success page
    //         const timer = setTimeout(() => {
    //             router.push(`${user?.role.toLowerCase()}/dashboard`);
    //         }, 10000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [data, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <LoadingSpinner />
                    <h1 className='text-2xl font-bold mb-6'>Verifying Payment...</h1>
                    <div className="rounded-lg shadow-sm text-left">
                        <Table className='border-none w-[600px]'>
                            <TableHeader>
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableHead className="w-[200px] bg-muted/50">Field</TableHead>
                                    <TableHead className="bg-muted/50">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableCell className="font-medium">Transaction Amount</TableCell>
                                    <TableCell className="font-mono">{verifyCredentials.transAmount}</TableCell>
                                </TableRow>
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableCell className="font-medium">Reference</TableCell>
                                    <TableCell className="font-mono">{verifyCredentials.reference}</TableCell>
                                </TableRow>
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableCell className="font-medium">Transaction Reference</TableCell>
                                    <TableCell className="font-mono">{verifyCredentials.transRef}</TableCell>
                                </TableRow>
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableCell className="font-medium">Processor Fee</TableCell>
                                    <TableCell className="font-mono">{verifyCredentials.processorFee}</TableCell>
                                </TableRow>
                                {/* <TableRow className='border-b-5 border-b-muted/50'>
                                <TableCell className="font-medium">Error Message</TableCell>
                                <TableCell className={verifyCredentials.errorMessage ? "text-amber-600" : ""}>
                                    {verifyCredentials.errorMessage || "None"}
                                </TableCell>
                            </TableRow> */}
                                <TableRow className='border-b-5 border-b-muted/50'>
                                    <TableCell className="font-medium">Currency</TableCell>
                                    <TableCell className="font-mono">{verifyCredentials.currency}</TableCell>
                                </TableRow>
                                {/* <TableRow className='border-b-5 border-b-muted/50'>
                                <TableCell className="font-medium">Gateway</TableCell>
                                <TableCell>{verifyCredentials.gateway || "Not specified"}</TableCell>
                            </TableRow> */}
                                <TableRow>
                                    <TableCell className="font-medium">Status</TableCell>
                                    <TableCell className={
                                        verifyCredentials.status === "0" ? "text-green-600 font-semibold" :
                                            verifyCredentials.status === "1" ? "text-red-600 font-semibold" : ""
                                    }>
                                        {verifyCredentials.status}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center text-red-600'>
                    <h1 className='text-2xl font-bold mb-4'>Payment Verification Failed</h1>
                    <p className='mb-4'>{error?.message || 'An error occurred during payment verification'}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Show success state
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='text-center text-green-600'>
                <h1 className='text-2xl font-bold mb-4'>Payment Verified Successfully!</h1>
                <p className='mb-2'>Your payment has been confirmed.</p>
                <p className='mb-4'>Reference: {verifyCredentials.reference}</p>
                <Button onClick={() => window.location.href = `/${user?.role.toLowerCase()}/dashboard`}>
                    Continue to Courses
                </Button>
            </div>
        </div>
    );
}

export default VerifyPaymentPage;
