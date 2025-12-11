import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';


export const AttendanceOverview: React.FC<{
    attendance: any;
    term: string
}> = ({
    attendance,
    term
}) => {
        const attendanceData = attendance.daily || [];
        // Calculate average attendance rate
        const averageRate = attendanceData.length > 0
            ? attendanceData.reduce((acc: number, day: any) => acc + day.rate, 0) / attendanceData.length
            : 0;
        const totalPresent = attendanceData.reduce((acc: number, day: any) => acc + day.present, 0);
        const totalAbsent = attendanceData.reduce((acc: number, day: any) => acc + day.absent, 0);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Attendance Records</CardTitle>
                    <CardDescription>
                        Viewing attendance for  <span className="text-accent-400">{(attendance.course_details?.fullname).toUpperCase()}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Attendance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                                <div className="text-2xl font-bold text-green-600">{averageRate.toFixed(1)}%</div>
                                <div className="text-sm text-green-700">Average Attendance Rate</div>
                            </div>
                            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                                <div className="text-2xl font-bold text-blue-600">{totalPresent}</div>
                                <div className="text-sm text-blue-700">Total Present Days</div>
                            </div>
                            <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                                <div className="text-2xl font-bold text-orange-600">{totalAbsent}</div>
                                <div className="text-sm text-orange-700">Absent Days</div>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Present</TableHead>
                                        <TableHead>Absent</TableHead>
                                        <TableHead>Late</TableHead>
                                        <TableHead>Attendance Rate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData.map((day: any) => (
                                        <TableRow key={day.date}>
                                            <TableCell className="font-medium">
                                                {new Date(day.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="default" className="bg-green-100 text-green-700">
                                                    {day.present}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-red-600 border-red-200">
                                                    {day.absent}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                                    {day.late}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Progress value={day.rate} className="w-20 h-2" />
                                                    <span className="text-sm font-medium">{day.rate}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        );
    };