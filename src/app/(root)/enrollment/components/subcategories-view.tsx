import { useCourseStore } from '../stores/course-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Users, FolderOpen, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export function SubCategoriesView() {
    const { selectedCategory, selectSubCategory, setView } = useCourseStore();

    if (!selectedCategory) {
        setView('categories');
        return null;
    }

    // Check if ALL subcategories have no courses
    const allSubCategoriesEmpty = selectedCategory.subCategories.every(
        subCategory => subCategory.courseCount === 0
    );

    return (
        <div className="space-y-12">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setView('categories')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedCategory.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{selectedCategory.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-primary">
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {selectedCategory.subCategories.length} sub-categories
                            {allSubCategoriesEmpty && (
                                <span className="ml-2 text-orange-600">(All coming soon)</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty state when ALL subcategories have no courses */}
            {allSubCategoriesEmpty && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-8 pb-16"
                >
                    <div className="w-32 h-32 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-blue-500" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Exciting Content Coming Soon!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                            We're working hard to bring you amazing courses for <strong>{selectedCategory.name}</strong>.
                            All subcategories are currently in development with comprehensive learning materials.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-blue-100 dark:border-gray-700">
                            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">In Development</h3>
                            <p className="text-gray-600 dark:text-gray-300">Courses being created by experts</p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-green-100 dark:border-gray-700">
                            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Quality Focus</h3>
                            <p className="text-gray-600 dark:text-gray-300">Ensuring the best learning experience</p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-indigo-950 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700">
                            <FolderOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Stay Tuned</h3>
                            <p className="text-gray-600 dark:text-gray-300">New content launching soon</p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button
                            size="lg"
                            onClick={() => setView('categories')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Browse Other Categories
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Show subcategories grid when there are some with courses OR when showing empty ones */}
            {!allSubCategoriesEmpty && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {selectedCategory.subCategories.map((subCategory, index) => (
                        <motion.div
                            key={subCategory.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card
                                className={`cursor-pointer h-full border-2 transition-all duration-300 dark:shadow-2xl dark:shadow-accent-500/30 ${subCategory.courseCount === 0
                                    ? 'border-gray-200 hover:border-gray-300 opacity-75'
                                    : 'border-transparent hover:border-blue-500'
                                    }`}
                                onClick={() => selectSubCategory(subCategory)}
                            >
                                <CardHeader className="pb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${subCategory.courseCount === 0 ? 'bg-gray-100' : 'bg-blue-100'
                                        }`}>
                                        <span className="text-lg">{subCategory.icon}</span>
                                    </div>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        {subCategory.name}
                                        {subCategory.courseCount === 0 && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                Coming Soon
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {subCategory.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-1" />
                                                {subCategory.courseCount} courses
                                            </div>
                                            {subCategory.courseCount > 0 && (
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {subCategory.courses.reduce((total, course) => total + course.studentsEnrolled, 0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {subCategory.courseCount === 0 && (
                                        <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                            No courses available yet. Check back soon!
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
