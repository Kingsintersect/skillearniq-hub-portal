import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';


export const ClassDetails: React.FC<{
    class: any;
    assessments: any[];
    performanceData: any[];
    studentCount: number;
    onClose: () => void;
}> = ({ class: classItem, assessments, performanceData, studentCount, onClose }) => {
    const averagePerformance = performanceData.length > 0
        ? performanceData.reduce((sum, student) => sum + student.averageScore, 0) / performanceData.length
        : 0;

    return (
        <Card className="sticky top-6 h-fit">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{classItem.shortName}</CardTitle>
                        <CardDescription>{classItem.name}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                        ✕
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Class Information</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Term:</span>
                            <Badge variant="outline">{classItem.term}</Badge>
                            <span className="text-muted-foreground">Level:</span>
                            <span>{classItem.level}</span>
                            <span className="text-muted-foreground">Arm:</span>
                            <span>{classItem.arm}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-primary/10 rounded">
                            <div className="font-bold text-primary">{studentCount}</div>
                            <div>Students</div>
                        </div>
                        <div className="text-center p-2 bg-green-500/10 rounded">
                            <div className="font-bold text-green-500">{assessments.length}</div>
                            <div>Assessments</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Class Performance</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Average Score:</span>
                                <span className="font-medium">{averagePerformance.toFixed(1)}%</span>
                            </div>
                            <Progress value={averagePerformance} className="h-2" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Recent Assessments</h4>
                        <div className="space-y-2">
                            {assessments.slice(0, 3).map((assessment) => (
                                <div key={assessment.id} className="flex justify-between items-center p-2 border rounded text-sm">
                                    <span className="truncate">{assessment.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {assessment.type}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};