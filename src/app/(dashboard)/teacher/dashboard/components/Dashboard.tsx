'use client'
import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatsOverview } from './StatsOverview';
import { StudentPerformanceGrid } from './StudentPerformanceGrid';
import { RecentActivityFeed } from './RecentActivityFeed';
import { AssignmentList } from './AssignmentList';
import { LiveClassSchedule } from './LiveClassSchedule';
import { PerformanceTrendChart } from './charts/PerformanceTrendChart';
import { ScoreDistributionChart } from './charts/ScoreDistributionChart';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Error loading dashboard data</div>
      </div>
    );
  }

  if (!stats) return null;

  const trendData = [
    { period: 'Week 1', average: 72, submissions: 15 },
    { period: 'Week 2', average: 75, submissions: 17 },
    { period: 'Week 3', average: 74, submissions: 16 },
    { period: 'Week 4', average: 76.5, submissions: 18 },
  ];

  const distributionData = [
    { range: '90-100', count: 8, color: '#10b981' },
    { range: '80-89', count: 6, color: '#34d399' },
    { range: '70-79', count: 4, color: '#f59e0b' },
    { range: '60-69', count: 2, color: '#f97316' },
    { range: '0-59', count: 1, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Teacher Dashboard</h1>
          <p className="dark:text-gray-100 text-gray-800">Welcome back! Here's your class overview for today.</p>
        </div>

        {/* Main Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <PerformanceTrendChart data={trendData} />
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
            <ScoreDistributionChart data={distributionData} />
          </div>
        </div>

        {/* Student Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <StudentPerformanceGrid students={stats.studentPerformance} />
          </div>
          <div>
            <RecentActivityFeed activities={stats.recentActivity} />
          </div>
        </div>

        {/* Assignments & Live Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AssignmentList classId={1} />
          </div>
          <div>
            <LiveClassSchedule />
          </div>
        </div>

        {/* Upcoming Deadlines Quick View */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {stats.upcomingDeadlines.map((deadline, index) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(deadline.dueDate).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {index === 0 ? 'Urgent' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};