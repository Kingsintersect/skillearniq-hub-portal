import React, { useState } from 'react';
import { Assignment } from '@/types';
import { useAssignments } from '@/hooks/useAssignments';
import { AssignmentCard } from './AssigmentCard';
import { CreateAssignmentForm } from './CreateAssignmentForm';


interface AssignmentListProps {
  classId?: number;
  subjectId?: number;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ classId, subjectId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: assignments, isLoading, error } = useAssignments({ classId, subjectId });

  if (isLoading) return <div className="flex justify-center p-4">Loading assignments...</div>;
  if (error) return <div className="text-red-600 p-4">Error loading assignments</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Assignments & Assessments</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Create New
        </button>
      </div>

      {showCreateForm && (
        <CreateAssignmentForm 
          onClose={() => setShowCreateForm(false)}
          classId={classId}
          subjectId={subjectId}
        />
      )}

      <div className="space-y-4">
        {assignments?.map(assignment => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
        
        {assignments?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No assignments found. Create your first assignment!
          </div>
        )}
      </div>
    </div>
  );
};