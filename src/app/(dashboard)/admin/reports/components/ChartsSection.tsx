// components/ChartsSection.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBar, ChartPie } from "lucide-react";
import { useGradeStore } from "@/store/gradeStore";
import { useTheme } from "next-themes";

export default function ChartsSection() {
    const { gradeData } = useGradeStore();
    const { theme } = useTheme();

    if (gradeData.length === 0) return null;

    // Calculate grade distribution
    const gradeDistribution = {
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
    };

    gradeData.forEach(student => {
        gradeDistribution[student.grade as keyof typeof gradeDistribution]++;
    });

    // Use chart colors from your CSS variables
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

    // Prepare data for bar chart
    const barChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
        grade,
        students: count,
    }));

    // Prepare data for pie chart
    const pieChartData = [
        { name: 'Excellent (A)', value: gradeDistribution.A },
        { name: 'Good (B)', value: gradeDistribution.B },
        { name: 'Average (C)', value: gradeDistribution.C },
        { name: 'Below Average (D)', value: gradeDistribution.D },
        { name: 'Fail (F)', value: gradeDistribution.F },
    ];

    // Text colors based on theme
    const textColor = theme === 'dark' ? '#ffffff' : '#1f2937';
    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-foreground">{payload[0].payload?.name || payload[0].name}</p>
                    <p className="text-sm text-muted-foreground">Students: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Grade Breakdown Bar Chart */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <ChartBar className="h-5 w-5 text-primary" />
                        Grade Breakdown
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Number of students per grade
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey="grade"
                                tick={{ fill: textColor }}
                                axisLine={{ stroke: gridColor }}
                            />
                            <YAxis
                                tick={{ fill: textColor }}
                                axisLine={{ stroke: gridColor }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ color: textColor }}
                                formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                            />
                            <Bar
                                dataKey="students"
                                fill="var(--chart-1)"
                                name="Number of Students"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Performance Summary Pie Chart */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <ChartPie className="h-5 w-5 text-primary" />
                        Performance Summary
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Overall class performance distribution
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
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ color: textColor }}
                                formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}