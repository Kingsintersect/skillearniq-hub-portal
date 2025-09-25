'use client'

import React, { useState } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { useStudents } from '@/hooks/useStudents';
import { useGrades, useGradeMutation, useBulkGradeUpload } from '@/hooks/useAssignments';
import { Grade } from '@/types';

export const GradeAssignment: React.FC = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [bulkUpload, setBulkUpload] = useState(false);
  
  const { data: assignments } = useAssignments({ classId: selectedClass || undefined });
  const { data: students } = useStudents(selectedClass || undefined);
  const { data: grades } = useGrades(selectedAssignment || 0);
  const gradeMutation = useGradeMutation();
  const bulkUploadMutation = useBulkGradeUpload();

  const [gradingData, setGradingData] = useState<Record<number, { score: number; feedback: string }>>({});

  const handleGradeSubmit = async (studentId: number) => {
    if (!selectedAssignment) return;
    
    const data = gradingData[studentId];
    if (!data || data.score === undefined) return;

    await gradeMutation.mutateAsync({
      studentId,
      assignmentId: selectedAssignment,
      score: data.score,
      feedback: data.feedback,
      gradedBy: 1 // From auth context
    });
  };

  const handleBulkUpload = async (file: File) => {
    if (!selectedAssignment) return;
    await bulkUploadMutation.mutateAsync({ assignmentId: selectedAssignment, file });
  };

  const getStudentGrade = (studentId: number) => {
    return grades?.find(g => g.studentId === studentId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Grade Assignments</h3>
      
      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select 
            value={selectedClass || ''} 
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Class</option>
            <option value="1">JSS1A</option>
            <option value="2">JSS1B</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Assignment</label>
          <select 
            value={selectedAssignment || ''} 
            onChange={(e) => setSelectedAssignment(Number(e.target.value))}
            className="w-full p-2 border rounded"
            disabled={!selectedClass}
          >
            <option value="">Select Assignment</option>
            {assignments?.map(assignment => (
              <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setBulkUpload(!bulkUpload)}
            className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
          >
            {bulkUpload ? 'Manual Grading' : 'Bulk Upload'}
          </button>
        </div>
      </div>

      {bulkUpload ? (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Bulk Grade Upload</h4>
          <p className="text-sm text-gray-600 mb-3">Upload Excel file with student grades</p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => e.target.files?.[0] && handleBulkUpload(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-2">
            Download template: <a href="#" className="text-blue-600">Grade Template.xlsx</a>
          </p>
        </div>
      ) : selectedAssignment && students ? (
        <div className="space-y-3">
          <h4 className="font-medium">Student Grades</h4>
          {students.map(student => {
            const existingGrade = getStudentGrade(student.id);
            
            return (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{student.avatar}</span>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    {existingGrade && (
                      <div className="text-sm text-gray-600">
                        Current: {existingGrade.score}/{assignments?.find(a => a.id === selectedAssignment)?.maxScore}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Score"
                    min="0"
                    max={assignments?.find(a => a.id === selectedAssignment)?.maxScore}
                    defaultValue={existingGrade?.score || ''}
                    onChange={(e) => setGradingData(prev => ({
                      ...prev,
                      [student.id]: { ...prev[student.id], score: Number(e.target.value) }
                    }))}
                    className="w-20 p-1 border rounded"
                  />
                  <span>/ {assignments?.find(a => a.id === selectedAssignment)?.maxScore}</span>
                  <button
                    onClick={() => handleGradeSubmit(student.id)}
                    disabled={gradeMutation.isPending}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Select a class and assignment to start grading
        </div>
      )}
    </div>
  );
};