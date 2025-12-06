import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ClassCard } from './ClassCard';
import { useRouter } from 'next/navigation';

export const ClassesGridView: React.FC<{
    classes: any[];
    onSelectClass: (classId: number) => void;
    selectedClass: number | null;
}> = ({ classes, onSelectClass, selectedClass }) => {
    const router = useRouter();
    const redirectTo = (id: number) => {
        router.push(`/teacher/classes/${id}`);
        onSelectClass(id)
    }
    if (classes.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No classes found</h3>
                    <p className="text-muted-foreground">No classes assigned for the selected filters</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
                <ClassCard
                    key={classItem.id}
                    classItem={classItem}
                    isSelected={selectedClass === classItem.id}
                    onClick={() => redirectTo(classItem.id)}
                />
            ))}
        </div>
    );
};