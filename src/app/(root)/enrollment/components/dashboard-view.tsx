import { useCourseStore } from '../stores/course-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Plus, Award, Rocket, Target, Database, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourseQueries } from '../hooks/use-course-queries';
import { courseService } from '../services/course-service';
import { ConfirmModal } from '@/components/global/confirm-modal';

export function DashboardView({ userId }: { userId: string }) {
    const { enrolledCourses, toggleShowAllCategories, clearCache } = useCourseStore();
    const {
        reloadCategoriesAndCourses,
        isLoading,
        isFetching,
        unenrollFromCourseMutation,
        isUnenrollmentProcessing,
        user,
        unenrollModalOpen,
        setUnenrollModalOpen,
        courseToUnenroll,
        setCourseToUnenroll,
    } = useCourseQueries(userId);

    // const handleUnenroll = (courseId: string, courseGroupId: number) => {
    //     unenrollFromCourseMutation.mutate({
    //         courseGroupId: courseGroupId,
    //         courseId: parseInt(courseId)
    //     });
    // };

    const handleUnenrollClick = (courseId: string, courseGroupId: number, courseName: string) => {
        setCourseToUnenroll({ courseId, courseGroupId, courseName });
        setUnenrollModalOpen(true);
    };

    const handleConfirmUnenroll = () => {
        if (courseToUnenroll) {
            unenrollFromCourseMutation.mutate({
                courseGroupId: courseToUnenroll.courseGroupId,
                courseId: parseInt(courseToUnenroll.courseId)
            });
            setUnenrollModalOpen(false);
            setCourseToUnenroll(null);
        }
    };

    if (enrolledCourses.length === 0) {
        return (
            <div className="text-center space-y-8 py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900  dark:text-white">
                            Start Your Learning Journey!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-white">
                            Discover amazing courses tailored for your career growth.
                            Learn from industry experts and join a community of passionate learners.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
                >
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/30 dark:border-gray-700">
                        <Target className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 dark:text-white">Set Your Goals</h3>
                        <p className="text-gray-600 dark:text-gray-300">Choose from 100+ courses aligned with your career objectives</p>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/30 dark:border-gray-700">
                        <BookOpen className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 dark:text-white">Learn by Doing</h3>
                        <p className="text-gray-600 dark:text-gray-300">Hands-on projects and real-world scenarios</p>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/30 dark:border-gray-700">
                        <Award className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 dark:text-white">Get Certified</h3>
                        <p className="text-gray-600 dark:text-gray-300">Earn certificates to showcase your skills</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-8"
                >
                    <div className="flex flex-col space-x-5 md:flex-row justify-center items-center gap-4">
                        <Button
                            size="lg"
                            onClick={reloadCategoriesAndCourses}
                            disabled={isLoading || isFetching}
                            className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg"
                        >
                            <RefreshCcw className={`w-6 h-6 mr-3 ${isLoading || isFetching ? ' animate-spin' : ''}`} />
                            Reload Courses
                        </Button>

                        <Button
                            size="lg"
                            onClick={toggleShowAllCategories}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg"
                        >
                            <Plus className="w-6 h-6 mr-3" />
                            Explore All Courses
                        </Button>
                    </div>

                    <p className="text-gray-500 mt-4 text-sm">
                        Join 50,000+ students already learning with us
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning Dashboard</h1>
                        <p className="text-primary-800 mt-2">Continue where you left off</p>
                    </div>
                    <div className="flex items-center space-x-5">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={clearCache}
                            className="text-xs"
                        >
                            <Database className="w-3 h-3 mr-1" />
                            Refresh Data
                        </Button>
                        <Button
                            onClick={toggleShowAllCategories}
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:border-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-50 dark:hover:text-yellow-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Enroll in More Programs
                        </Button>
                    </div>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {enrolledCourses.map((enrollment, index) => {
                        return (
                            <motion.div
                                key={enrollment.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-full border-2 border-transparent dark:border-gray-600 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg leading-tight">
                                                {enrollment.course.course_name || enrollment.course.title}
                                            </CardTitle>
                                            <Award className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {enrollment.course.course_group}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span className="text-xs text-gray-500">
                                                    {enrollment.course.short_name}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-semibold">{enrollment.progress}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-5">
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => courseService.redirectToCourseWarePlatform(String(user?.username))}
                                                >
                                                    Continue Learning
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="dark:hover:text-white"
                                                    // onClick={() => handleUnenroll(enrollment.course.id, enrollment.course.course_group_id)}
                                                    // disabled={isUnenrollmentProcessing}
                                                    onClick={() => handleUnenrollClick(
                                                        enrollment.courseId,
                                                        enrollment.course.course_group_id,
                                                        enrollment.course.course_name || enrollment.course.title
                                                    )}
                                                    disabled={isUnenrollmentProcessing}
                                                >
                                                    {isUnenrollmentProcessing ? 'Unenrolling...' : 'Unenroll'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
            <ConfirmModal
                open={unenrollModalOpen}
                onOpenChange={setUnenrollModalOpen}
                onConfirm={handleConfirmUnenroll}
                title="Unenroll from Course"
                description={`Are you sure you want to unenroll from "${courseToUnenroll?.courseName}"? `}
                confirmText="Yes, Unenroll"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}