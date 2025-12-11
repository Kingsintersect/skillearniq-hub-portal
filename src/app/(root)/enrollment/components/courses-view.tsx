"use client";

import { useCourseStore } from '../stores/course-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, Clock, Users, CreditCard, CheckCircle, BookOpen, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourseQueries } from '../hooks/use-course-queries';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const COURSE_ENROLLMENT_AMOUNT = 20000;

export function CoursesView({ userId }: { userId: string }) {
    const { selectedSubCategory, setView, enrolledCourses, paidCategories } = useCourseStore();
    const { paymentMutation, enrollmentInCourseMutation, isPaymentProcessing } = useCourseQueries(userId);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    if (!selectedSubCategory) {
        setView('subcategories');
        return null;
    }

    const handleProgramPayment = () => {
        setSelectedCourse(selectedSubCategory.id);
        paymentMutation.mutate({
            programId: selectedSubCategory.id,
            paymentData: {
                method: 'card',
                amount: COURSE_ENROLLMENT_AMOUNT,
                program_name: selectedSubCategory.name
            }
        });
    };

    const handleEnroll = (courseId: string) => {
        setSelectedCourse(courseId);
        enrollmentInCourseMutation.mutate({
            paymentData: {
                courseId,
                programId: selectedSubCategory.id,
                program_name: selectedSubCategory.name
            }
        });
    };

    // Check if a course is already enrolled
    const isEnrolled = (courseId: string) => {
        return enrolledCourses.some(e => String(e.courseId) === courseId);
    };

    // Check if a category has been paid for
    const isCategoryPaidFor = () => {
        // console.log('paidCategories', paidCategories)
        return paidCategories.some(cat => cat.course_group_id === selectedSubCategory.apiId);
    };

    // Empty state when no courses are available
    if (selectedSubCategory.courses.length === 0) {
        return (
            <div className="space-y-12">
                <div className="flex items-center space-x-4 ">
                    <Button className='flex items-center' variant="ghost" size="icon" onClick={() => setView('subcategories')}>
                        <ArrowLeft className="w-5 h-5" />
                        backwards
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedSubCategory.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{selectedSubCategory.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-primary">
                            <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                0 courses available
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-8 pb-12"
                >
                    <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                        <Rocket className="w-12 h-12 text-blue-500" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Exciting Courses Coming Soon!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                            We're working hard to bring you amazing courses for <strong>{selectedSubCategory.name}</strong>.
                            Our team is developing comprehensive learning materials to help you master this subject.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-blue-100 dark:border-gray-700">
                            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
                            <p className="text-gray-600 dark:text-gray-300">New courses in development</p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-green-100 dark:border-gray-700">
                            <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Expert Content</h3>
                            <p className="text-gray-600 dark:text-gray-300">Created by industry professionals</p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700">
                            <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                            <p className="text-gray-600 dark:text-gray-300">We'll notify you when ready</p>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Interested in this subject? Let us know what you'd like to learn!
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Button
                                onClick={() => setView('subcategories')}
                                variant="outline"
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:bg-blue-50 hover:text-blue-600"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Categories
                            </Button>
                            <Button
                                onClick={() => setView('categories')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Browse All Courses
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => setView('subcategories')} className="flex-shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">{selectedSubCategory.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">{selectedSubCategory.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-primary">
                            <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span>{selectedSubCategory.courses.length} courses available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!isCategoryPaidFor() && <div className="w-full lg:w-auto">
                    <Button
                        className="w-full lg:w-auto bg-accent-400 hover:bg-accent-700 text-white"
                        onClick={() => handleProgramPayment()}
                        disabled={isPaymentProcessing}
                        size="xl"
                    >
                        {isPaymentProcessing ? (
                            <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Unlock access to courses</span>
                                <span className="sm:hidden">Enroll Now</span>
                            </div>
                        )}
                    </Button>
                </div>}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {selectedSubCategory.courses.map((course, index) => {
                    return (
                        <motion.div
                            key={course.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="pt-0 overflow-hidden border-2 border-transparent dark:shadow-2xl dark:shadow-accent-500/30 hover:border-blue-300 transition-all duration-300">
                                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <span className="text-white text-4xl font-bold">{course.title.split(' ')[0]}</span>
                                    </div>
                                </div>

                                <CardHeader className=''>
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-base">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {course.studentsEnrolled.toLocaleString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                                {course.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        {isEnrolled(course.id) ? (
                                            <Button disabled variant="outline" className='border-green-600 text-green-700'>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Enrolled
                                            </Button>
                                        ) : (
                                            <>
                                                {!isCategoryPaidFor()
                                                    ? <div className="w-full lg:w-auto"></div>
                                                    : <Button
                                                        onClick={() => handleEnroll(course.id)}
                                                        disabled={enrollmentInCourseMutation.isPending && selectedCourse === course.id}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        {enrollmentInCourseMutation.isPending && selectedCourse === course.id ? (
                                                            <>
                                                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                                                Enrolling...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <BookOpen className="w-4 h-4 mr-2" />
                                                                Enroll Now
                                                            </>
                                                        )}
                                                    </Button>
                                                }
                                            </>
                                        )}
                                        {/* <Button variant="outline">
                                            View Details
                                        </Button> */}
                                    </div>

                                    {selectedCourse === course.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">Successfully enrolled!</span>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}

