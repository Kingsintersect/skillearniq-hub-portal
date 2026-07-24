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
        return paidCategories.some(cat => cat.course_group_id === selectedSubCategory.apiId);
    };

    // Empty state when no courses are available
    if (selectedSubCategory.courses.length === 0) {
        return (
            <div className="space-y-10">
                <div className="flex items-center space-x-4">
                    <Button
                        className="flex items-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/40"
                        variant="ghost"
                        size="icon"
                        onClick={() => setView('subcategories')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-foreground">{selectedSubCategory.name}</h1>
                        <p className="text-muted-foreground mt-1">{selectedSubCategory.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
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
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Rocket className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold font-outfit text-foreground">
                            Exciting subjects coming soon!
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            We're working hard to bring you amazing courses for <strong className="text-foreground">{selectedSubCategory.name}</strong>.
                            Our team is developing comprehensive learning materials to help you master this subject.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <Clock className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">Coming soon</h3>
                            <p className="text-muted-foreground text-sm">New courses in development</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <BookOpen className="w-10 h-10 text-secondary-600 dark:text-secondary-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">Expert content</h3>
                            <p className="text-muted-foreground text-sm">Created by industry professionals</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <Users className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">Stay updated</h3>
                            <p className="text-muted-foreground text-sm">We'll notify you when ready</p>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Interested in this subject? Let us know what you'd like to learn!
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Button
                                onClick={() => setView('subcategories')}
                                variant="outline"
                                className="border-primary-300 text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/40 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to categories
                            </Button>
                            <Button
                                onClick={() => setView('categories')}
                                className="bg-primary-600 hover:bg-primary-700 text-primary-foreground rounded-full"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Browse all subjects
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setView('subcategories')}
                        className="flex-shrink-0 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/40"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-foreground break-words">{selectedSubCategory.name}</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">{selectedSubCategory.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1 flex-shrink-0 text-primary-500" />
                                <span>{selectedSubCategory.courses.length} courses available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!isCategoryPaidFor() && (
                    <div className="w-full lg:w-auto">
                        <Button
                            className="w-full lg:w-auto bg-accent-500 hover:bg-accent-600 text-white shadow-md shadow-accent-500/25 rounded-full"
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
                                    <span className="sm:hidden">Enroll now</span>
                                </div>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {selectedSubCategory.courses.map((course, index) => {
                    return (
                        <motion.div
                            key={course.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.015, y: -2 }}
                        >
                            <Card className="pt-0 overflow-hidden border-2 border-transparent bg-card shadow-sm hover:shadow-lg hover:shadow-primary-500/10 hover:border-accent-400 transition-all duration-300">
                                <div className="h-40 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 relative">
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                        <span className="text-white text-4xl font-bold font-outfit tracking-tight">{course.title.split(' ')[0]}</span>
                                    </div>
                                </div>

                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="text-xl leading-tight font-outfit">{course.title}</CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-base">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {course.studentsEnrolled.toLocaleString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 mr-1 text-secondary-500 fill-secondary-500" />
                                                {course.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        {isEnrolled(course.id) ? (
                                            <Button disabled variant="outline" className="border-primary-400 text-primary-700 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
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
                                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-primary-foreground rounded-full"
                                                    >
                                                        {enrollmentInCourseMutation.isPending && selectedCourse === course.id ? (
                                                            <>
                                                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                                                Enrolling...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <BookOpen className="w-4 h-4 mr-2" />
                                                                Enroll now
                                                            </>
                                                        )}
                                                    </Button>
                                                }
                                            </>
                                        )}
                                    </div>

                                    {selectedCourse === course.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center space-x-2 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 p-3 rounded-xl"
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
