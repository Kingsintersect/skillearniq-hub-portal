import React from 'react';
import { Assignment } from '@/types';
import { useRouter } from 'next/navigation';

interface AssignmentCardProps {
  assignment: Assignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {

    const router = useRouter();
  
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && assignment.status !== 'completed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-lg">{assignment.title}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
          {assignment.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <div className="space-y-1">
          <div className="text-gray-500">
            Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
          </div>
          <div className="text-gray-500">
            Max Score: {assignment.maxScore} points • Type: {assignment.type}
          </div>
        </div>
        
        <div className="space-x-2">
          <button
            onClick={() => router.push(`/assignments/${assignment.id}/grade`)}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
          >
            Grade
          </button>
          <button
            onClick={() => router.push(`/assignments/${assignment.id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>
      
      {isOverdue && (
        <div className="mt-2 text-red-600 text-xs font-medium">
          ⚠️ This assignment is overdue for grading
        </div>
      )}
    </div>
  );
};