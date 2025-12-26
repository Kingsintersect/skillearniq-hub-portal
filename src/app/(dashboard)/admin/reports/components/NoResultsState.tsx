// app/(admin)/grade-reports/components/NoResultsState.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, RefreshCw } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";

export default function NoResultsState() {
  const { 
    selectedCourse, 
    courses, 
    courseInfo, 
    fetchGradeData,
    resetState 
  } = useGradeStore();

  const getSelectedCourseName = () => {
    if (courseInfo) {
      return `${courseInfo.course_code}: ${courseInfo.course_name}`;
    }
    
    const selected = courses.find(course => course.id === selectedCourse);
    return selected ? `${selected.course_code || 'N/A'}: ${selected.name}` : 'Selected Course';
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <FileWarning className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-3 text-card-foreground">
            No Grade Data Available
          </h3>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-2">
              Course: <span className="font-medium text-foreground">{getSelectedCourseName()}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              No student grade records were found for this course.
            </p>
          </div>

          <div className="space-y-4 w-full max-w-md">
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2 text-foreground">Possible Reasons:</h4>
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>No students are enrolled in this course</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Grades haven't been entered yet</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The course might not have started</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={fetchGradeData}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Loading Again
              </Button>
              
              <Button
                onClick={resetState}
                variant="outline"
              >
                Select Different Course
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}