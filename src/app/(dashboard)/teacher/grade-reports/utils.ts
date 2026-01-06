import { Student } from "@/types/grades";

export function calculateGradeDistribution(students: Student[]) {
    const distribution = {
        A: 0, B: 0, C: 0, D: 0, F: 0
    };

    students.forEach(student => {
        distribution[student.grade]++;
    });

    return distribution;
}

export function calculatePerformanceSummary(students: Student[]) {
    const distribution = calculateGradeDistribution(students);

    return {
        excellent: distribution.A,
        good: distribution.B,
        average: distribution.C,
        belowAverage: distribution.D,
        fail: distribution.F,
    };
}

export function getGradeColor(grade: string) {
    const colors = {
        A: 'bg-green-100 text-green-800',
        B: 'bg-blue-100 text-blue-800',
        C: 'bg-yellow-100 text-yellow-800',
        D: 'bg-orange-100 text-orange-800',
        F: 'bg-red-100 text-red-800',
    };

    return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}