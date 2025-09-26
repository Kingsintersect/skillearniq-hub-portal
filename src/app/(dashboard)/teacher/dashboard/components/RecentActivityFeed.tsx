'use client'
import React from 'react';
import { RecentActivity } from '@/lib/services/analyticsService';

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return '📝';
      case 'grade': return '🎯';
      case 'attendance': return '📊';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission': return 'text-blue-600 bg-blue-50';
      case 'grade': return 'text-green-600 bg-green-50';
      case 'attendance': return 'text-purple-600 bg-purple-50';
      case 'announcement': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              {activity.studentName && (
                <p className="text-xs text-gray-500">Student: {activity.studentName}</p>
              )}
              {activity.score && (
                <p className="text-xs text-gray-500">Score: {activity.score}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};