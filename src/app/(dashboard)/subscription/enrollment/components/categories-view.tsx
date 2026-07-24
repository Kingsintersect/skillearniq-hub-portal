import { useCourseStore } from '../stores/course-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ChevronRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function CategoriesView() {
    const { categories, selectCategory, toggleShowAllCategories } = useCourseStore();

    return (
        <div className="space-y-10">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleShowAllCategories}
                    className="rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/40"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-foreground">Browse all subjects</h1>
                    <p className="text-muted-foreground mt-1">Choose a category that matches your interests</p>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-muted/40">
                    <p className="text-muted-foreground">No categories available.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.015, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className="cursor-pointer border-2 border-transparent hover:border-accent-400 transition-all duration-300 group bg-card shadow-sm hover:shadow-lg hover:shadow-primary-500/10"
                                onClick={() => selectCategory(category)}
                            >
                                <CardHeader className="flex flex-row items-start space-x-4 pb-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/40 dark:ring-black/10"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        <span className="text-2xl">{category.icon}</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <CardTitle className="text-xl group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors font-outfit">
                                            {category.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {category.description}
                                        </CardDescription>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent-500 group-hover:translate-x-1 transition-all shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-1.5 text-primary-500" />
                                                {category.subCategories.length} sub-categories
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1.5 text-secondary-600" />
                                                {category.subCategories.reduce((total, sub) => total + sub.courseCount, 0)} courses
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
