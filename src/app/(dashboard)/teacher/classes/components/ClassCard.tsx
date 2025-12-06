import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ClassCard: React.FC<{
    classItem: any;
    isSelected: boolean;
    onClick: () => void;
}> = ({ classItem, isSelected, onClick }) => {
    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''
                }`}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span>{classItem.shortName}</span>
                    <Badge variant="secondary">{classItem.studentCount}</Badge>
                </CardTitle>
                <CardDescription>{classItem.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Term:</span>
                        <Badge variant="outline">{classItem.term}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Level:</span>
                        <Badge variant="secondary">{classItem.level}</Badge>
                    </div>
                </div>
                <Button className="w-full mt-4" variant={isSelected ? "default" : "outline"}>
                    {isSelected ? 'Viewing Details' : 'View Details'}
                </Button>
            </CardContent>
        </Card>
    );
};
