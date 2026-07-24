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
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-xl shadow-primary-500/25">
                        <Rocket className="w-16 h-16 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold font-outfit text-foreground">
                            Start your learning journey!
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                    <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                        <Target className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 font-outfit text-foreground">Set your goals</h3>
                        <p className="text-muted-foreground">Choose from 100+ courses aligned with your career objectives</p>
                    </div>

                    <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                        <BookOpen className="w-12 h-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 font-outfit text-foreground">Learn by doing</h3>
                        <p className="text-muted-foreground">Hands-on projects and real-world scenarios</p>
                    </div>

                    <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                        <Award className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 font-outfit text-foreground">Get certified</h3>
                        <p className="text-muted-foreground">Earn certificates to showcase your skills</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-8"
                >
                    <div className="flex flex-col space-x-0 space-y-3 md:flex-row md:space-y-0 md:space-x-4 justify-center items-center gap-1">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={reloadCategoriesAndCourses}
                            disabled={isLoading || isFetching}
                            className="border-primary-300 text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:border-primary-700 dark:hover:bg-primary-800/40 px-8 py-4 text-base font-semibold rounded-full"
                        >
                            <RefreshCcw className={`w-5 h-5 mr-2 ${isLoading || isFetching ? ' animate-spin' : ''}`} />
                            Reload subjects
                        </Button>

                        <Button
                            size="lg"
                            onClick={toggleShowAllCategories}
                            className="bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg shadow-primary-500/25"
                        >
                            <Plus className="w-6 h-6 mr-3" />
                            Explore all subjects
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-4 text-sm">
                        Join 50,000+ students already learning with us
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-foreground">My learning dashboard</h1>
                        <p className="text-muted-foreground mt-2">Continue where you left off</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearCache}
                            className="text-xs border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
                        >
                            <Database className="w-3 h-3 mr-1.5" />
                            Refresh data
                        </Button>
                        <Button
                            onClick={toggleShowAllCategories}
                            className="bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-sm shadow-accent-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Enroll in more programs
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
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-full border-2 border-transparent bg-card shadow-sm hover:border-accent-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <CardTitle className="text-lg leading-tight font-outfit">
                                                {enrollment.course.course_name || enrollment.course.title}
                                            </CardTitle>
                                            <div className="w-9 h-9 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center shrink-0">
                                                <Award className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                                            </div>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {enrollment.course.course_group}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                    {enrollment.course.short_name}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-semibold text-foreground">{enrollment.progress}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2 [&>div]:bg-accent-500" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    className="w-full bg-primary-600 hover:bg-primary-700 text-primary-foreground rounded-full"
                                                    onClick={() => courseService.redirectToCourseWarePlatform(String(user?.email))}
                                                >
                                                    Continue
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                    onClick={() => handleUnenrollClick(
                                                        enrollment.courseId,
                                                        enrollment.course.course_group_id,
                                                        enrollment.course.course_name || enrollment.course.title
                                                    )}
                                                    disabled={isUnenrollmentProcessing}
                                                >
                                                    {isUnenrollmentProcessing ? 'Unenrolling…' : 'Unenroll'}
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
                title="Unenroll from course"
                description={`Are you sure you want to unenroll from "${courseToUnenroll?.courseName}"? `}
                confirmText="Yes, unenroll"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}
