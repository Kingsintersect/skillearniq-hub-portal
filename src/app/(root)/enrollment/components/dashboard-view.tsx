// components/dashboard-view.tsx
import { useCourseStore } from '../stores/course-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Plus, Award, Rocket, Target, Database, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourseQueries } from '../hooks/use-course-queries';

export function DashboardView({ userId }: { userId: string }) {
    const { enrolledCourses, toggleShowAllCategories, clearCache } = useCourseStore();
    const { reloadCategoriesAndCourses, isLoading, isFetching } = useCourseQueries(userId);

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
                        <h1 className="text-4xl font-bold text-gray-900">
                            Start Your Learning Journey!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                        <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Set Your Goals</h3>
                        <p className="text-gray-600">Choose from 100+ courses aligned with your career objectives</p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Learn by Doing</h3>
                        <p className="text-gray-600">Hands-on projects and real-world scenarios</p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                        <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Get Certified</h3>
                        <p className="text-gray-600">Earn certificates to showcase your skills</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-8"
                >
                    <div className="space-x-5">
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
        <div className="space-y-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
                    <p className="text-gray-600 mt-2">Continue where you left off</p>
                </div>
                <div className="flex items-center space-x-5">
                    <Button
                        type="button"
                        variant="outline"
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
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll in More Programs
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((enrollment, index) => (
                    <motion.div
                        key={enrollment.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="h-full border-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg leading-tight">
                                        {enrollment.course.title}
                                    </CardTitle>
                                    <Award className="w-5 h-5 text-yellow-500" />
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {enrollment.course.instructor}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        {/* <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {enrollment.course.duration}
                                        </div> */}
                                        {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                            enrollment.course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {enrollment.course.level}
                                        </span> */}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold">{enrollment.progress}%</span>
                                        </div>
                                        <Progress value={enrollment.progress} className="h-2" />
                                    </div>

                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Continue Learning
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}