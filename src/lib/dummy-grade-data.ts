import { Student } from "@/types/grades";

export function generateMockGradeData(courseId: string): Student[] {
    const studentCount = Math.floor(Math.random() * 15) + 10; // 10-25 students
    const students: Student[] = [];

    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Blake', 'Cameron'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 0; i < studentCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`;

        // Generate random scores
        const assignmentScore = Math.floor(Math.random() * 30) + 50; // 50-80
        const quizScore = Math.floor(Math.random() * 30) + 50; // 50-80
        const examScore = Math.floor(Math.random() * 30) + 50; // 50-80
        const total = Math.round((assignmentScore * 0.3) + (quizScore * 0.3) + (examScore * 0.4));

        // Determine grade
        let grade: 'A' | 'B' | 'C' | 'D' | 'F';
        if (total >= 90) grade = 'A';
        else if (total >= 80) grade = 'B';
        else if (total >= 70) grade = 'C';
        else if (total >= 60) grade = 'D';
        else grade = 'F';

        students.push({
            id: i + 1,
            email,
            firstName,
            lastName,
            assignment: assignmentScore,
            quiz: quizScore,
            exam: examScore,
            total,
            grade,
        });
    }

    return students;
}