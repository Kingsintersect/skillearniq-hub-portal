'use client'

import React from 'react';
import { StudentPerformance } from '@/lib/services/analyticsService';

interface StudentPerformanceGridProps {
  students: StudentPerformance[];
}

export const StudentPerformanceGrid: React.FC<StudentPerformanceGridProps> = ({ students }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      default: return '→';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.studentId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{student.studentName}</h4>
                <p className="text-sm text-gray-600">{student.assignmentsCompleted} assignments</p>
              </div>
              <span className="text-lg">{getTrendIcon(student.trend)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(student.averageScore)}`}>
                {student.averageScore}%
              </span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${student.averageScore}%`,
                    backgroundColor: student.averageScore >= 80 ? '#10b981' :
                                    student.averageScore >= 70 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};