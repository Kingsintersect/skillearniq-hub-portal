// app/(student)/grade-reports/components/StudentChartsSection.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBar, ChartPie } from "lucide-react";
import { useStudentGradeStore } from "@/store/student-grade-store";
import { useTheme } from "next-themes";
import { getGradeColor } from "../utils";

export default function StudentChartsSection() {
    const { gradeData } = useStudentGradeStore();
    const { theme } = useTheme();

    if (gradeData.length === 0) return null;

    // Student only has their own data
    const student = gradeData[0];
    
    // Prepare data for bar chart (component scores)
    const componentData = [
        { name: 'Assignments', score: student.assignment, max: 100 },
        { name: 'Quizzes', score: student.quiz, max: 100 },
        { name: 'Exam', score: student.exam, max: 100 },
        { name: 'Total', score: student.total, max: 100 }
    ];

    // Prepare data for grade distribution (just the student's grade)
    const gradeDistribution = {
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
    };
    
    if (student.grade in gradeDistribution) {
        gradeDistribution[student.grade as keyof typeof gradeDistribution] = 1;
    }
    
    const pieChartData = Object.entries(gradeDistribution)
        .filter(([_, count]) => count > 0)
        .map(([grade, count]) => ({
            name: `${grade} Grade`,
            value: count
        }));

    const getChartColors = () => {
        const colors = [
            'var(--chart-1)',    // Primary Navy
            'var(--chart-2)',    // Secondary Gold
            'var(--chart-3)',    // Accent Orange
            'var(--chart-4)',    // Destructive Red
            'var(--chart-5)',    // Light Navy
        ];
        return colors;
    };

    const chartColors = getChartColors();

    const textColor = theme === 'dark' ? '#ffffff' : '#1f2937';
    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-foreground">{payload[0].payload?.name}</p>
                    <p className="text-sm text-muted-foreground">Score: {payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Component Scores Bar Chart */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <ChartBar className="h-5 w-5 text-primary" />
                        Component Scores
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Your scores across different assessment components
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={componentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: textColor }}
                                axisLine={{ stroke: gridColor }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fill: textColor }}
                                axisLine={{ stroke: gridColor }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ color: textColor }}
                                formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                            />
                            <Bar
                                dataKey="score"
                                fill="var(--chart-1)"
                                name="Your Score (%)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Grade Summary Pie Chart */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <ChartPie className="h-5 w-5 text-primary" />
                        Grade Summary
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Your final grade for this course
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name }) => name}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={getGradeColor(entry.name.charAt(0))}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Grade Summary Stats */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Final Grade</p>
                                <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg ${getGradeColor(student.grade)}`}>
                                    <span className="font-bold text-lg">{student.grade}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Score</p>
                                <p className="text-2xl font-bold">{student.total}%</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}