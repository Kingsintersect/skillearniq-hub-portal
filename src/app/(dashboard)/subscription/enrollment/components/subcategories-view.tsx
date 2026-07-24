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
        <div className="space-y-10">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setView('categories')}
                    className="rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/40"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-foreground">{selectedCategory.name}</h1>
                    <p className="text-muted-foreground mt-1">{selectedCategory.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1 text-primary-500" />
                            {selectedCategory.subCategories.length} sub-categories
                            {allSubCategoriesEmpty && (
                                <span className="ml-2 text-accent-600 dark:text-accent-400 font-medium">(All coming soon)</span>
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
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Rocket className="w-14 h-14 text-white" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold font-outfit text-foreground">
                            Exciting content coming soon!
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            We're building comprehensive learning material for <strong className="text-foreground">{selectedCategory.name}</strong>.
                            All subcategories are currently in development.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <BookOpen className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">In development</h3>
                            <p className="text-muted-foreground text-sm">Subjects being created by experts</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <Users className="w-10 h-10 text-secondary-600 dark:text-secondary-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">Quality focus</h3>
                            <p className="text-muted-foreground text-sm">Ensuring the best learning experience</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
                            <FolderOpen className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2 font-outfit">Stay tuned</h3>
                            <p className="text-muted-foreground text-sm">New content launching soon</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button
                            size="lg"
                            onClick={() => setView('categories')}
                            className="bg-primary-600 hover:bg-primary-700 text-primary-foreground px-8 py-3 font-semibold rounded-full shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Browse other categories
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Show subcategories grid when there are some with courses */}
            {!allSubCategoriesEmpty && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {selectedCategory.subCategories.map((subCategory, index) => (
                        <motion.div
                            key={subCategory.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card
                                className={`cursor-pointer h-full border-2 transition-all duration-300 bg-card ${subCategory.courseCount === 0
                                    ? 'border-border opacity-70 hover:opacity-100'
                                    : 'border-transparent hover:border-accent-400 hover:shadow-lg hover:shadow-primary-500/10'
                                    }`}
                                onClick={() => selectSubCategory(subCategory)}
                            >
                                <CardHeader className="pb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${subCategory.courseCount === 0 ? 'bg-muted' : 'bg-primary-100 dark:bg-primary-800/40'
                                        }`}>
                                        <span className="text-lg">{subCategory.icon}</span>
                                    </div>
                                    <CardTitle className="text-lg flex items-center justify-between font-outfit">
                                        {subCategory.name}
                                        {subCategory.courseCount === 0 && (
                                            <span className="text-xs bg-secondary-200 text-secondary-800 dark:bg-secondary-800/40 dark:text-secondary-200 px-2.5 py-1 rounded-full font-medium">
                                                Coming soon
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {subCategory.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-1 text-primary-500" />
                                                {subCategory.courseCount} courses
                                            </div>
                                            {subCategory.courseCount > 0 && (
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1 text-secondary-600" />
                                                    {subCategory.courses.reduce((total, course) => total + course.studentsEnrolled, 0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {subCategory.courseCount === 0 && (
                                        <div className="mt-3 text-xs text-muted-foreground bg-muted p-2 rounded-lg">
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


