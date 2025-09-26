'use client'
import React from 'react';
import { DashboardStats } from '@/lib/services/analyticsService';
import { CompletionGauge } from './charts/CompletionGauge';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const scoreDistribution = [
    { range: '90-100', count: 8, color: '#10b981' },
    { range: '80-89', count: 6, color: '#34d399' },
    { range: '70-79', count: 4, color: '#f59e0b' },
    { range: '60-69', count: 2, color: '#f97316' },
    { range: '0-59', count: 1, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      {/* Grading Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <CompletionGauge
          value={stats.gradedAssignments}
          max={stats.totalAssignments}
          title="Grading Progress"
          subtitle="Assignments graded"
          color="#4f46e5"
        />
      </div>

      {/* Average Score */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats.averageClassScore}%
          </div>
          <div className="text-lg font-medium text-gray-900">Class Average</div>
          <div className="text-sm text-gray-600">Across all assignments</div>
          <div className={`mt-2 text-sm ${
            stats.averageClassScore >= 80 ? 'text-green-600' :
            stats.averageClassScore >= 70 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.averageClassScore >= 80 ? 'Excellent' :
             stats.averageClassScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <CompletionGauge
          value={stats.attendanceRate}
          max={100}
          title="Attendance Rate"
          subtitle="This term"
          color="#10b981"
        />
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Pending Grading</span>
              <span className="text-lg font-bold text-red-600">{stats.pendingGrading}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.pendingGrading / stats.totalAssignments) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Upcoming Deadlines</span>
              <span className="text-lg font-bold text-orange-600">{stats.upcomingDeadlines.length}</span>
            </div>
            <div className="text-xs text-gray-600">
              Next: {stats.upcomingDeadlines[0]?.title}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Total Students</span>
              <span className="text-lg font-bold text-blue-600">{stats.studentPerformance.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};